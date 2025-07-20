import React, { useState, useEffect } from 'react';
import { Users, Plus, Settings, Trash2, LogOut, User, ArrowLeft, Search, Mail, Phone, Calendar, UserPlus, X, Crown, Shield } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useProjectMembers } from '../contexts/ProjectMembersContext';
import { useAuth } from '../contexts/AuthContext';

interface MobileProjectManagementProps {
  onBack: () => void;
  onNavigateToView: (view: string) => void;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinedAt: string;
}

export function MobileProjectManagement({ onBack, onNavigateToView }: MobileProjectManagementProps) {
  const [activeView, setActiveView] = useState<'main' | 'members' | 'create' | 'switch' | 'invite'>('main');
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [inviting, setInviting] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // コンテキストからデータを取得
  const { user } = useAuth();
  const { projects, currentProject, createProject, deleteProject, selectProject } = useProject();
  const { 
    members, 
    invitations, 
    loading, 
    fetchMembers, 
    inviteMember, 
    updateMemberRole, 
    removeMember 
  } = useProjectMembers();

  // メンバー一覧を取得
  useEffect(() => {
    if (currentProject && activeView === 'members') {
      fetchMembers(currentProject.id);
    }
  }, [currentProject, activeView, fetchMembers]);

  const filteredMembers = members.filter(member =>
    member.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.user?.user_metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !currentProject) return;

    setInviting(true);
    try {
      const { error } = await inviteMember(currentProject.id, inviteEmail.trim(), inviteRole);
      if (error) {
        alert(`招待エラー: ${error.message}`);
      } else {
        alert(`${inviteEmail} に招待メールを送信しました`);
        setInviteEmail('');
        setInviteRole('member');
        // メンバーリストを更新
        await fetchMembers(currentProject.id);
      }
    } catch (error) {
      alert('招待処理中にエラーが発生しました');
    } finally {
      setInviting(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      const { error } = await createProject(newProjectName, newProjectDescription);
      if (error) {
        alert(`プロジェクト作成エラー: ${error.message}`);
      } else {
        alert('プロジェクトを作成しました');
        setNewProjectName('');
        setNewProjectDescription('');
        setActiveView('main');
      }
    } catch (error) {
      alert('プロジェクト作成中にエラーが発生しました');
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

  const handleProjectSelect = (project: any) => {
    selectProject(project);
    alert(`プロジェクト「${project.name}」に切り替えました`);
    setActiveView('main');
  };

  const handleDeleteProject = async () => {
    if (!currentProject || !window.confirm('プロジェクトを削除しますか？この操作は取り消せません。')) return;

    try {
      const { error } = await deleteProject(currentProject.id);
      if (error) {
        alert(`削除エラー: ${error.message}`);
      } else {
        alert('プロジェクトを削除しました');
        setActiveView('main');
      }
    } catch (error) {
      alert('削除処理中にエラーが発生しました');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'オーナー';
      case 'admin': return '管理者';
      case 'member': return 'メンバー';
      default: return role;
    }
  };

  const canManageMembers = () => {
    if (!currentProject || !user) return false;
    const currentMember = members.find(m => m.user_id === user.id);
    return currentMember?.role === 'owner' || currentMember?.role === 'admin';
  };

  const isCurrentUser = (memberId: string) => {
    return members.find(m => m.id === memberId)?.user_id === user?.id;
  };

  const renderMainView = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-bold text-blue-900 mb-2">現在のプロジェクト</h3>
        <p className="text-blue-800">{currentProject?.name || 'プロジェクトが選択されていません'}</p>
        <p className="text-sm text-blue-600 mt-1">メンバー数: {members.length}名</p>
      </div>

      <div className="space-y-3">
        <button 
          onClick={() => setActiveView('members')}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 bg-white"
        >
          <div className="p-2 rounded-lg bg-gray-50 text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          <span className="font-medium text-gray-900">メンバー一覧</span>
          <div className="ml-auto">
            <span className="text-gray-400">›</span>
          </div>
        </button>
        
        <button 
          onClick={() => setActiveView('create')}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 bg-white"
        >
          <div className="p-2 rounded-lg bg-gray-50 text-green-600">
            <Plus className="h-5 w-5" />
          </div>
          <span className="font-medium text-gray-900">プロジェクト作成</span>
          <div className="ml-auto">
            <span className="text-gray-400">›</span>
          </div>
        </button>
        
        <button 
          onClick={() => setActiveView('switch')}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 bg-white"
        >
          <div className="p-2 rounded-lg bg-gray-50 text-yellow-600">
            <Settings className="h-5 w-5" />
          </div>
          <span className="font-medium text-gray-900">プロジェクト切り替え</span>
          <div className="ml-auto">
            <span className="text-gray-400">›</span>
          </div>
        </button>
        
        <button 
          onClick={handleDeleteProject}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 bg-white"
        >
          <div className="p-2 rounded-lg bg-gray-50 text-red-600">
            <Trash2 className="h-5 w-5" />
          </div>
          <span className="font-medium text-gray-900">プロジェクト削除</span>
        </button>
      </div>
    </div>
  );

  const renderMembersView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="メンバーを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {canManageMembers() && (
          <button
            onClick={() => setActiveView('invite')}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">読み込み中...</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">👤</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">
                        {member.user?.user_metadata?.name || member.user?.email || 'Unknown User'}
                      </h4>
                      {getRoleIcon(member.role)}
                    </div>
                    <p className="text-sm text-gray-600">{getRoleLabel(member.role)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{member.user?.email}</span>
                    </div>
                  </div>
                  {canManageMembers() && !isCurrentUser(member.id) && member.role !== 'owner' && (
                    <div className="flex items-center gap-2">
                      <select
                        value={member.role}
                        onChange={(e) => handleUpdateRole(member.id, e.target.value as 'admin' | 'member')}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="member">メンバー</option>
                        <option value="admin">管理者</option>
                      </select>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>メンバーが見つかりません</p>
            </div>
          )}

          {invitations.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">招待中 ({invitations.length}件)</h4>
              <div className="space-y-2">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-yellow-900">{invitation.email}</p>
                        <p className="text-sm text-yellow-700">{getRoleLabel(invitation.role)}</p>
                      </div>
                      <span className="text-xs text-yellow-600">招待中</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderInviteView = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-bold text-blue-900 mb-2">メンバーを招待</h3>
        <p className="text-blue-800 text-sm">メールアドレスと権限を設定してメンバーを招待してください</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
          <input
            type="email"
            placeholder="招待するメンバーのメールアドレス"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">権限</label>
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="member">メンバー</option>
            <option value="admin">管理者</option>
          </select>
        </div>

        <button 
          onClick={handleInviteMember}
          disabled={!inviteEmail.trim() || inviting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
        >
          {inviting ? '招待中...' : '招待を送信'}
        </button>
      </div>
    </div>
  );

  const renderCreateView = () => (
    <div className="space-y-4">
      <div className="bg-green-50 rounded-xl p-4">
        <h3 className="font-bold text-green-900 mb-2">新しいプロジェクトを作成</h3>
        <p className="text-green-800 text-sm">プロジェクト名と説明を入力してください</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">プロジェクト名</label>
          <input
            type="text"
            placeholder="プロジェクト名を入力"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">説明</label>
          <textarea
            placeholder="プロジェクトの説明を入力"
            rows={3}
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <button 
          onClick={handleCreateProject}
          disabled={!newProjectName.trim()}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
        >
          プロジェクトを作成
        </button>
      </div>
    </div>
  );

  const renderSwitchView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="プロジェクトを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => handleProjectSelect(project)}
            className={`w-full text-left bg-white border rounded-xl p-4 transition-all duration-200 ${
              currentProject?.id === project.id
                ? 'border-yellow-300 bg-yellow-50'
                : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{project.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{members.length}名</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">作成日: {new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              {currentProject?.id === project.id && (
                <div className="text-yellow-600">
                  <span className="text-sm font-medium">現在</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Settings className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>プロジェクトが見つかりません</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (activeView === 'main') {
                onBack();
              } else {
                setActiveView('main');
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            {activeView === 'main' ? 'プロジェクト管理' :
             activeView === 'members' ? 'メンバー一覧' :
             activeView === 'invite' ? 'メンバー招待' :
             activeView === 'create' ? 'プロジェクト作成' :
             'プロジェクト切り替え'}
          </h1>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="p-4">
        {activeView === 'main' && renderMainView()}
        {activeView === 'members' && renderMembersView()}
        {activeView === 'invite' && renderInviteView()}
        {activeView === 'create' && renderCreateView()}
        {activeView === 'switch' && renderSwitchView()}
      </div>
    </div>
  );
} 