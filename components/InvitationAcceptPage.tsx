import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProjectMembers } from '../contexts/ProjectMembersContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function InvitationAcceptPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { acceptInvitation, declineInvitation } = useProjectMembers();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'declined' | 'pending'>('loading');
  const [message, setMessage] = useState('');
  const [invitationData, setInvitationData] = useState<any>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    const fetchInvitationData = async () => {
      if (!token) {
        setStatus('error');
        setMessage('招待リンクが無効です。');
        return;
      }

      try {
        console.log('Fetching invitation with token:', token);
        console.log('Current user state:', user);
        console.log('User email:', user?.email);
        
        // まず招待データを取得（関連データなし）
        const { data: invitationBasic, error: invitationBasicError } = await supabase
          .from('project_invitations')
          .select('id, project_id, email, role, scopes, expires_at, created_at')
          .eq('token', token)
          .single();

        console.log('Basic invitation data:', invitationBasic);
        console.log('Basic invitation error:', invitationBasicError);

        if (invitationBasicError) {
          console.error('Error fetching basic invitation:', invitationBasicError);
          setStatus('error');
          setMessage('招待データの取得に失敗しました。');
          return;
        }

        if (!invitationBasic) {
          console.error('No invitation found with token:', token);
          setStatus('error');
          setMessage('有効な招待が見つかりません。招待リンクが正しいかご確認ください。');
          return;
        }

        // デバッグ情報を追加
        console.log('Project ID from invitation:', invitationBasic.project_id);
        console.log('Project ID type:', typeof invitationBasic.project_id);
        console.log('Project ID length:', invitationBasic.project_id?.length);
        console.log('Invitation email:', invitationBasic.email);

        // 認証状態を確認
        if (!user) {
          console.log('User is not authenticated, showing login required message');
          setStatus('error');
          setMessage(`ログインが必要です。招待メールアドレス: ${invitationBasic.email}`);
          return;
        }

        console.log('User is authenticated:', user.email);

        // プロジェクトデータを取得
        console.log('Fetching project data for ID:', invitationBasic.project_id);
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('name, description')
          .eq('id', invitationBasic.project_id)
          .single();

        console.log('Project data:', projectData);
        console.log('Project error:', projectError);
        console.log('Project error details:', projectError?.details);

        // 招待者データは招待データから取得（auth.usersへのアクセスは削除）
        const inviterEmail = invitationBasic.email || '招待者@example.com';
        const inviterName = inviterEmail.split('@')[0] || '招待者';

        console.log('Inviter email:', inviterEmail);

        // 招待の有効性をチェック（expires_atを使用）
        const now = new Date();
        const expiresAt = new Date(invitationBasic.expires_at);
        
        if (now > expiresAt) {
          setStatus('error');
          setMessage('この招待は期限切れです。');
          return;
        }

        // 既にメンバーかチェック（メールアドレスで比較）
        if (user && user.email) {
          console.log('Checking existing member for project_id:', invitationBasic.project_id, 'user_id:', user.id);
          const { data: existingMember } = await supabase
            .from('project_members')
            .select('id')
            .eq('project_id', invitationBasic.project_id)
            .eq('user_id', user.id)
            .single();

          console.log('Existing member check result:', existingMember);

          if (existingMember) {
            setStatus('error');
            setMessage('既にプロジェクトのメンバーです。');
            return;
          }
        }

        // 招待メールアドレスとユーザーのメールアドレスが一致するかチェック
        if (user && user.email && user.email !== invitationBasic.email) {
          console.log('Email mismatch - User email:', user.email, 'Invitation email:', invitationBasic.email);
          setStatus('error');
          setMessage('この招待は別のメールアドレス宛てです。正しいアカウントでログインしてください。');
          return;
        }

        console.log('All checks passed, setting status to pending');
        setInvitationData({
          project_name: projectData?.name || 'プロジェクト名',
          project_description: projectData?.description || '',
          inviter_email: inviterEmail,
          inviter_name: inviterName,
          role: invitationBasic.role,
          scopes: invitationBasic.scopes || []
        });
        setStatus('pending');
      } catch (error) {
        console.error('Error fetching invitation data:', error);
        setStatus('error');
        setMessage('招待データの取得に失敗しました。');
      }
    };

    fetchInvitationData();
  }, [token, user]);

  const handleAccept = async () => {
    if (!token) return;

    try {
      const { error } = await acceptInvitation(token);
      if (error) {
        throw error;
      }
      
      setStatus('success');
      setMessage('プロジェクトへの参加が完了しました！');
      
      // 成功後、少し待ってからプロジェクトページにリダイレクト
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage('招待の承認に失敗しました。');
    }
  };

  const handleDecline = async () => {
    if (!token) return;

    try {
      const { error } = await declineInvitation(token);
      if (error) {
        throw error;
      }
      
      setStatus('declined');
      setMessage('招待を辞退しました。');
    } catch (error) {
      setStatus('error');
      setMessage('招待の辞退に失敗しました。');
    }
  };

  const handleGoToProject = () => {
    navigate('/');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">招待を確認中...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'success' ? (
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          ) : status === 'error' ? (
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          ) : status === 'declined' ? (
            <XCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          ) : null}
          
          <CardTitle>
            {status === 'success' && '招待を承認しました'}
            {status === 'error' && 'エラーが発生しました'}
            {status === 'declined' && '招待を辞退しました'}
          </CardTitle>
          
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {status === 'pending' && invitationData && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-lg mb-2">
                  {invitationData?.project_name} への招待
                </h3>
                {invitationData?.project_description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {invitationData.project_description}
                  </p>
                )}
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    招待者: <span className="font-medium">{invitationData?.inviter_name}</span>
                  </p>
                  <p className="text-gray-600">
                    役割: <span className="font-medium">
                      {invitationData?.role === 'admin' ? '管理者' : 'メンバー'}
                    </span>
                  </p>
                  {invitationData?.scopes && invitationData.scopes.length > 0 && (
                    <p className="text-gray-600">
                      アクセス権限: <span className="font-medium">
                        {invitationData.scopes.length}個の権限
                      </span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleDecline}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  辞退
                </Button>
                <Button 
                  onClick={handleAccept}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  参加する
                </Button>
              </div>
            </div>
          )}
          
          {status === 'success' && (
            <Button onClick={handleGoToProject} className="w-full">
              プロジェクトに移動
            </Button>
          )}
          
          {(status === 'error' || status === 'declined') && (
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              ホームに戻る
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 