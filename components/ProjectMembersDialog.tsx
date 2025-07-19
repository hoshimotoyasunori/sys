import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Users, UserPlus, Mail, X, Crown, Shield, User, Settings } from 'lucide-react';
import { useProjectMembers } from '../contexts/ProjectMembersContext';
import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';

interface ProjectMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// 利用可能なスコープの定義
const AVAILABLE_SCOPES = [
  { key: 'requirements', label: '要件定義', description: '要件定義フェーズの編集' },
  { key: 'analysis_design', label: '分析・設計', description: '分析・設計フェーズの編集' },
  { key: 'external_design', label: '外部設計', description: '外部設計フェーズの編集' },
  { key: 'development_prep', label: '開発準備', description: '開発準備フェーズの編集' },
  { key: 'members', label: 'メンバー管理', description: 'プロジェクトメンバーの管理' },
  { key: 'settings', label: 'プロジェクト設定', description: 'プロジェクトの基本設定' },
];

export function ProjectMembersDialog({
  isOpen,
  onClose
}: ProjectMembersDialogProps) {
  const { user } = useAuth();
  const { currentProject } = useProject();
  const { 
    members, 
    invitations, 
    loading, 
    fetchMembers, 
    inviteMember, 
    updateMemberRole, 
    removeMember 
  } = useProjectMembers();
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [inviting, setInviting] = useState(false);
  const [showScopeSelector, setShowScopeSelector] = useState(false);

  useEffect(() => {
    if (isOpen && currentProject) {
      console.log('ProjectMembersDialog - currentProject:', currentProject);
      fetchMembers(currentProject.id);
    }
  }, [isOpen, currentProject?.id]); // fetchMembersを依存配列から削除

  // 役割が変更されたときにスコープを自動設定
  useEffect(() => {
    if (inviteRole === 'admin') {
      // 管理者は全てのスコープにアクセス可能
      setSelectedScopes(AVAILABLE_SCOPES.map(scope => scope.key));
    } else {
      // メンバーはデフォルトでフェーズ編集のみ
      setSelectedScopes(['requirements', 'analysis_design', 'external_design', 'development_prep']);
    }
  }, [inviteRole]);

  const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !currentProject) return;

    setInviting(true);
    try {
      const { error } = await inviteMember(currentProject.id, inviteEmail.trim(), inviteRole, selectedScopes);
      if (error) {
        alert(`招待エラー: ${error.message}`);
      } else {
        alert(`${inviteEmail} に招待メールを送信しました`);
        setInviteEmail('');
        setInviteRole('member');
        setSelectedScopes(['requirements', 'analysis_design', 'external_design', 'development_prep']);
        setShowScopeSelector(false);
        // メンバーリストを更新
        await fetchMembers(currentProject.id);
      }
    } catch (error) {
      alert('招待処理中にエラーが発生しました');
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!currentProject || !window.confirm('このメンバーを削除しますか？')) return;

    try {
      const { error } = await removeMember(currentProject.id, memberId);
      if (error) {
        alert(`削除エラー: ${error.message}`);
      } else {
        alert('メンバーを削除しました');
      }
    } catch (error) {
      alert('削除処理中にエラーが発生しました');
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: 'admin' | 'member') => {
    if (!currentProject) return;

    try {
      const { error } = await updateMemberRole(currentProject.id, memberId, newRole);
      if (error) {
        alert(`権限更新エラー: ${error.message}`);
      } else {
        alert('権限を更新しました');
      }
    } catch (error) {
      alert('権限更新処理中にエラーが発生しました');
    }
  };

  const toggleScope = (scopeKey: string) => {
    setSelectedScopes(prev => 
      prev.includes(scopeKey) 
        ? prev.filter(s => s !== scopeKey)
        : [...prev, scopeKey]
    );
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'オーナー';
      case 'admin': return '管理者';
      case 'member': return 'メンバー';
      default: return 'メンバー';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'member': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const canManageMembers = () => {
    if (!user || !currentProject) return false;
    const currentMember = members.find(m => m.user_id === user.id);
    return currentMember && ['owner', 'admin'].includes(currentMember.role);
  };

  const isCurrentUser = (memberId: string) => {
    return user && members.find(m => m.id === memberId)?.user_id === user.id;
  };

  if (!currentProject) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            プロジェクトメンバー管理
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* プロジェクト情報 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">{currentProject.name}</h3>
            <p className="text-sm text-gray-600">
              参加メンバー: {members.length}人 | 招待中: {invitations.length}人
            </p>
          </div>

          {/* メンバー招待 */}
          {canManageMembers() && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">メンバーを招待</h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="invite-email" className="sr-only">メールアドレス</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="メールアドレスを入力"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleInviteMember()}
                    />
                  </div>
                  <Select value={inviteRole} onValueChange={(value: 'admin' | 'member') => setInviteRole(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">メンバー</SelectItem>
                      <SelectItem value="admin">管理者</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleInviteMember} 
                    disabled={!inviteEmail.trim() || inviting}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {inviting ? '招待中...' : '招待'}
                  </Button>
                </div>

                {/* スコープ選択 */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowScopeSelector(!showScopeSelector)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    アクセス権限を設定 {showScopeSelector ? '(閉じる)' : '(開く)'}
                  </Button>
                  
                  {showScopeSelector && (
                    <div className="border rounded-lg p-4 space-y-3">
                      <h5 className="font-medium text-sm text-gray-700">アクセス権限</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {AVAILABLE_SCOPES.map((scope) => (
                          <div key={scope.key} className="flex items-start space-x-2">
                            <Checkbox
                              id={scope.key}
                              checked={selectedScopes.includes(scope.key)}
                              onCheckedChange={() => toggleScope(scope.key)}
                              disabled={inviteRole === 'admin'} // 管理者は全てのスコープにアクセス
                            />
                            <div className="space-y-1">
                              <Label htmlFor={scope.key} className="text-sm font-medium">
                                {scope.label}
                              </Label>
                              <p className="text-xs text-gray-500">{scope.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {inviteRole === 'admin' && (
                        <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                          管理者は全ての機能にアクセスできます
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 招待中一覧 */}
          {invitations.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">招待中</h4>
              <div className="space-y-2">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invitation.invitee_email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRoleColor(invitation.role)}>
                            {getRoleLabel(invitation.role)}
                          </Badge>
                          {invitation.scopes && invitation.scopes.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {invitation.scopes.length}個の権限
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                      招待中
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* メンバー一覧 */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">メンバー一覧</h4>
            {loading ? (
              <div className="text-center py-4 text-gray-500">読み込み中...</div>
            ) : members.length === 0 ? (
              <div className="text-center py-4 text-gray-500">メンバーがいません</div>
            ) : (
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {getRoleIcon(member.role)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.user?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRoleColor(member.role)}>
                            {getRoleLabel(member.role)}
                          </Badge>
                          {isCurrentUser(member.id) && (
                            <Badge variant="outline" className="text-blue-700 border-blue-300">
                              あなた
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {canManageMembers() && !isCurrentUser(member.id) && member.role !== 'owner' && (
                      <div className="flex items-center gap-2">
                        <Select 
                          value={member.role} 
                          onValueChange={(value: 'admin' | 'member') => handleUpdateRole(member.id, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">メンバー</SelectItem>
                            <SelectItem value="admin">管理者</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 