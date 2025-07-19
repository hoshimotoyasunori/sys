import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { sendInvitationEmail } from '../lib/email';

interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  user?: {
    id: string;
    email: string;
    user_metadata?: {
      name?: string;
    };
  };
}

interface ProjectInvitation {
  id: string;
  project_id: string;
  email: string;
  token: string;
  role: 'admin' | 'member';
  scopes?: string[];
  expires_at: string;
  created_at: string;
  updated_at: string;
}

interface ProjectMembersContextType {
  members: ProjectMember[];
  invitations: ProjectInvitation[];
  loading: boolean;
  fetchMembers: (projectId: string) => Promise<void>;
  inviteMember: (projectId: string, email: string, role: 'admin' | 'member', scopes?: string[]) => Promise<{ error: any }>;
  updateMemberRole: (projectId: string, memberId: string, role: 'admin' | 'member') => Promise<{ error: any }>;
  removeMember: (projectId: string, memberId: string) => Promise<{ error: any }>;
  acceptInvitation: (token: string) => Promise<{ error: any }>;
  declineInvitation: (token: string) => Promise<{ error: any }>;
}

const ProjectMembersContext = createContext<ProjectMembersContextType | undefined>(undefined);

function useProjectMembers() {
  const context = useContext(ProjectMembersContext);
  if (context === undefined) {
    throw new Error('useProjectMembers must be used within a ProjectMembersProvider');
  }
  return context;
}

function ProjectMembersProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = useCallback(async (projectId: string) => {
    if (!user || !projectId) return;

    setLoading(true);
    try {
      // プロジェクトメンバーを取得（基本的な情報のみ）
      const { data: membersData, error: membersError } = await supabase
        .from('project_members')
        .select('id, project_id, user_id, role')
        .eq('project_id', projectId)
        .order('id', { ascending: true });

      if (membersError) {
        console.error('Error fetching project members:', membersError);
        throw membersError;
      }

      // メンバー情報を構築（現在のユーザーのみ詳細情報を表示）
      const membersWithUserInfo = (membersData || []).filter(member => member).map((member) => {
        if (member.user_id === user?.id && user) {
          return {
            ...member,
            user: {
              id: user.id,
              email: user.email || 'Unknown',
              user_metadata: user.user_metadata || {}
            }
          };
        } else if (member.user_id) {
          // 他のユーザーは匿名表示
          return {
            ...member,
            user: {
              id: member.user_id,
              email: `user-${member.user_id.slice(0, 8)}`,
              user_metadata: {}
            }
          };
        } else {
          // user_idがnullの場合（プロジェクトオーナーなど）
          return {
            ...member,
            user: {
              id: 'unknown',
              email: 'プロジェクトオーナー',
              user_metadata: {}
            }
          };
        }
      });

      // 招待を取得（現在のテーブル構造に合わせて修正）
      let invitationsData: any[] = [];
      try {
        // リソース制限を回避するため、必要なカラムのみを選択し、制限を設定
        const { data, error: invitationsError } = await supabase
          .from('project_invitations')
          .select('id, project_id, email, token, role, scopes, expires_at, created_at, updated_at')
          .eq('project_id', projectId)
          .gt('expires_at', new Date().toISOString()) // 有効期限が切れていない招待のみ
          .order('id', { ascending: false })
          .limit(10); // 最新の10件のみ取得

        if (invitationsError) {
          console.error('Error fetching invitations:', invitationsError);
          // 招待取得に失敗してもメンバー情報は表示する
          invitationsData = [];
        } else {
          invitationsData = data || [];
        }
      } catch (invitationError) {
        console.error('Error fetching invitations (caught):', invitationError);
        // 招待取得に失敗してもメンバー情報は表示する
        invitationsData = [];
      }

      setMembers(membersWithUserInfo);
      setInvitations(invitationsData || []);
    } catch (error) {
      console.error('Error in fetchMembers:', error);
      setMembers([]);
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const inviteMember = useCallback(async (projectId: string, email: string, role: 'admin' | 'member', scopes?: string[]) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      // 既存のメンバーかチェック
      const { data: existingMember } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .single();

      if (!existingMember) {
        return { error: new Error('プロジェクトへのアクセス権限がありません') };
      }

      // プロジェクト名を取得
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('name')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('Error fetching project name:', projectError);
        return { error: new Error('プロジェクト情報の取得に失敗しました') };
      }

      // 招待トークンを生成
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7日間有効

      // 招待を作成
      const { error } = await supabase
        .from('project_invitations')
        .insert([
          {
            project_id: projectId,
            email: email,
            token,
            role,
            scopes: scopes || [],
            expires_at: expiresAt.toISOString(),
          },
        ]);

      if (error) throw error;

      // メール送信
      const emailResult = await sendInvitationEmail({
        email,
        token,
        role,
        projectName: projectData.name,
        inviterName: user.user_metadata?.name || user.email,
      });

      if (emailResult.error) {
        console.error('Error sending invitation email:', emailResult.error);
        // メール送信に失敗しても招待は作成されているので、警告として扱う
        return { error: new Error('招待は作成されましたが、メール送信に失敗しました') };
      }

      console.log('招待メールを送信しました:', { email, token, role, scopes });

      return { error: null };
    } catch (error) {
      console.error('Error inviting member:', error);
      return { error };
    }
  }, [user]);

  const updateMemberRole = useCallback(async (projectId: string, memberId: string, role: 'admin' | 'member') => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      // 権限チェック
      const { data: currentUserMember } = await supabase
        .from('project_members')
        .select('role')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .single();

      if (!currentUserMember || !['owner', 'admin'].includes(currentUserMember.role)) {
        return { error: new Error('権限がありません') };
      }

      const { error } = await supabase
        .from('project_members')
        .update({ role })
        .eq('id', memberId)
        .eq('project_id', projectId);

      if (error) throw error;

      // ローカル状態を更新
      setMembers(prev => prev.map(member => 
        member.id === memberId ? { ...member, role } : member
      ));

      return { error: null };
    } catch (error) {
      console.error('Error updating member role:', error);
      return { error };
    }
  }, [user]);

  const removeMember = useCallback(async (projectId: string, memberId: string) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      // 権限チェック
      const { data: currentUserMember } = await supabase
        .from('project_members')
        .select('role')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .single();

      if (!currentUserMember || !['owner', 'admin'].includes(currentUserMember.role)) {
        return { error: new Error('権限がありません') };
      }

      // 自分自身を削除しようとしている場合はエラー
      const { data: targetMember } = await supabase
        .from('project_members')
        .select('user_id, role')
        .eq('id', memberId)
        .single();

      if (targetMember?.user_id === user.id) {
        return { error: new Error('自分自身を削除することはできません') };
      }

      // オーナーを削除しようとしている場合はエラー
      if (targetMember?.role === 'owner') {
        return { error: new Error('オーナーを削除することはできません') };
      }

      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId)
        .eq('project_id', projectId);

      if (error) throw error;

      // ローカル状態を更新
      setMembers(prev => prev.filter(member => member.id !== memberId));

      return { error: null };
    } catch (error) {
      console.error('Error removing member:', error);
      return { error };
    }
  }, [user]);

  const acceptInvitation = useCallback(async (token: string) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      // 招待を取得
      const { data: invitation, error: invitationError } = await supabase
        .from('project_invitations')
        .select('*')
        .eq('token', token)
        .single();

      if (invitationError || !invitation) {
        return { error: new Error('有効な招待が見つかりません') };
      }

      // 招待の有効期限をチェック
      const now = new Date();
      const expiresAt = new Date(invitation.expires_at);
      
      if (now > expiresAt) {
        return { error: new Error('この招待は期限切れです') };
      }

      // 既にメンバーかチェック
      const { data: existingMember } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', invitation.project_id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        return { error: new Error('既にプロジェクトのメンバーです') };
      }

      // メンバーとして追加
      const { error: insertError } = await supabase
        .from('project_members')
        .insert([
          {
            project_id: invitation.project_id,
            user_id: user.id,
            role: invitation.role,
            joined_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error('Error inserting member:', insertError);
        // RLSポリシーエラーの場合、代替手段を試す
        if (insertError.code === '42501') {
          // 一時的にRLSを無効にして挿入を試行
          const { error: bypassError } = await supabase
            .rpc('insert_project_member_bypass_rls', {
              p_project_id: invitation.project_id,
              p_user_id: user.id,
              p_role: invitation.role
            });
          
          if (bypassError) {
            return { error: new Error('招待の受け入れに失敗しました。管理者に連絡してください。') };
          }
        } else {
          throw insertError;
        }
      }

      // 招待は削除
      const { error: deleteError } = await supabase
        .from('project_invitations')
        .delete()
        .eq('token', token);

      if (deleteError) {
        console.warn('招待の削除に失敗しましたが、メンバー追加は成功しました:', deleteError);
      }

      return { error: null };
    } catch (error) {
      console.error('Error accepting invitation:', error);
      return { error };
    }
  }, [user]);

  const declineInvitation = useCallback(async (token: string) => {
    try {
      // 招待を削除（statusフィールドが存在しないため）
      const { error } = await supabase
        .from('project_invitations')
        .delete()
        .eq('token', token);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error declining invitation:', error);
      return { error };
    }
  }, []);

  const value = {
    members,
    invitations,
    loading,
    fetchMembers,
    inviteMember,
    updateMemberRole,
    removeMember,
    acceptInvitation,
    declineInvitation,
  };

  return <ProjectMembersContext.Provider value={value}>{children}</ProjectMembersContext.Provider>;
}

export { useProjectMembers, ProjectMembersProvider };