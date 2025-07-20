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
      return { error: new Error('ユーザーが認証されていません') };
    }

    try {
      // プロジェクトの存在確認とオーナー権限チェック
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (fetchError) {
        return { error: new Error('プロジェクトが見つかりません') };
      }

      if (!project) {
        return { error: new Error('プロジェクトが見つかりません') };
      }

      if (project.owner_id !== user.id) {
        return { error: new Error('プロジェクトを削除する権限がありません') };
      }

      // プロジェクトの削除
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (deleteError) {
        return { error: new Error('プロジェクトの削除に失敗しました') };
      }

      // 現在のプロジェクトが削除された場合、他のプロジェクトを選択
      if (currentProject?.id === projectId) {
        const { data: otherProjects } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', user.id)
          .neq('id', projectId)
          .limit(1);

        if (otherProjects && otherProjects.length > 0) {
          setCurrentProject(otherProjects[0]);
        } else {
          setCurrentProject(null);
        }
      }

      // プロジェクトリストを更新
      await fetchProjects();
      
      return { error: null };
    } catch (error) {
      console.error('プロジェクト削除エラー:', error);
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
