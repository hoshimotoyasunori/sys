import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useProjectData } from './ProjectDataContext';

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  createProject: (name: string, description: string) => Promise<{ error: any }>;
  selectProject: (project: Project) => void;
  deleteProject: (projectId: string) => Promise<{ error: any }>;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      // ユーザーがオーナーまたはメンバーであるプロジェクトを取得
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_members!inner(user_id)
        `)
        .eq('project_members.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // 重複を除去してプロジェクトのみを取得
      const uniqueProjects = data?.reduce((acc: Project[], project: any) => {
        const existingProject = acc.find(p => p.id === project.id);
        if (!existingProject) {
          acc.push({
            id: project.id,
            name: project.name,
            description: project.description,
            created_at: project.created_at,
            updated_at: project.updated_at,
            owner_id: project.owner_id
          });
        }
        return acc;
      }, []) || [];

      setProjects(uniqueProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const createProject = async (name: string, description: string) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            name,
            description,
            owner_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // プロジェクトオーナーをメンバーとして追加
      const { error: memberError } = await supabase
        .from('project_members')
        .insert([
          {
            project_id: data.id,
            user_id: user.id,
            role: 'owner',
          },
        ]);

      if (memberError) {
        console.error('Error adding project owner as member:', memberError);
        // メンバー追加に失敗してもプロジェクト作成は成功とする
      }

      // 新規プロジェクトをリストに追加
      setProjects(prev => [data, ...prev]);
      
      // 新規プロジェクトを自動的に選択
      setCurrentProject(data);
      
      // プロジェクトリストを再取得して最新の状態を保つ
      await fetchProjects();
      
      return { error: null };
    } catch (error) {
      console.error('Error creating project:', error);
      return { error };
    }
  };

  const selectProject = (project: Project) => {
    setCurrentProject(project);
  };

  const deleteProject = async (projectId: string) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      console.log('Attempting to delete project:', projectId);
      console.log('Current user:', user.id);
      
      // まずプロジェクトの存在と権限を確認
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, owner_id')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('Error fetching project for deletion:', projectError);
        return { error: new Error('プロジェクトが見つかりません') };
      }

      if (!projectData) {
        return { error: new Error('プロジェクトが見つかりません') };
      }

      // オーナーかどうかチェック
      if (projectData.owner_id !== user.id) {
        return { error: new Error('プロジェクトを削除する権限がありません') };
      }

      console.log('Project found, owner confirmed. Proceeding with deletion...');

      // 関連データを削除（CASCADEが効かない場合のため）
      // 1. プロジェクトメンバーを削除
      const { error: membersError } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId);

      if (membersError) {
        console.warn('Error deleting project members:', membersError);
      }

      // 2. プロジェクト招待を削除
      const { error: invitationsError } = await supabase
        .from('project_invitations')
        .delete()
        .eq('project_id', projectId);

      if (invitationsError) {
        console.warn('Error deleting project invitations:', invitationsError);
      }

      // 3. タスクを削除
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('project_id', projectId);

      if (tasksError) {
        console.warn('Error deleting project tasks:', tasksError);
      }

      // 4. 成果物を削除
      const { error: deliverablesError } = await supabase
        .from('deliverables')
        .delete()
        .eq('project_id', projectId);

      if (deliverablesError) {
        console.warn('Error deleting project deliverables:', deliverablesError);
      }

      // 5. フェーズを削除
      const { error: phasesError } = await supabase
        .from('phases')
        .delete()
        .eq('project_id', projectId);

      if (phasesError) {
        console.warn('Error deleting project phases:', phasesError);
      }

      // 6. 最後にプロジェクトを削除
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (deleteError) {
        console.error('Error deleting project:', deleteError);
        return { error: new Error('プロジェクトの削除に失敗しました') };
      }

      console.log('Project deleted successfully');

      // 削除されたプロジェクトが現在のプロジェクトの場合、currentProjectをクリア
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }

      // プロジェクトリストから削除
      setProjects(prev => prev.filter(project => project.id !== projectId));

      return { error: null };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { error };
    }
  };

  const refreshProjects = async () => {
    await fetchProjects();
  };

  const value = {
    projects,
    currentProject,
    loading,
    createProject,
    selectProject,
    deleteProject,
    refreshProjects,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export { useProject, ProjectProvider };
