import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Settings, 
  Trash2, 
  User, 
  LogOut, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';

interface MobileProjectManagementProps {
  onBack: () => void;
  onNavigateToView: (view: string) => void;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

export function MobileProjectManagement({ onBack, onNavigateToView }: MobileProjectManagementProps) {
  const { projects, currentProject, selectProject, deleteProject, createProject } = useProject();
  const { signOut, user } = useAuth();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [showProjectSwitch, setShowProjectSwitch] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showNotification('ログアウトしました', 'success');
    } catch (error) {
      showNotification('ログアウトに失敗しました', 'error');
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    try {
      const { error } = await createProject(newProjectName, newProjectDescription);
      
      if (error) {
        showNotification(error.message, 'error');
      } else {
        showNotification('プロジェクトを作成しました', 'success');
        setShowCreateProject(false);
        setNewProjectName('');
        setNewProjectDescription('');
      }
    } catch (error) {
      showNotification('プロジェクトの作成に失敗しました', 'error');
    }
  };

  const handleProjectSelect = (project) => {
    selectProject(project);
    showNotification(`${project.name}に切り替えました`, 'success');
    setShowProjectSwitch(false);
  };

  const confirmDeleteProject = async () => {
    if (!currentProject) return;
    
    try {
      const { error } = await deleteProject(currentProject.id);
      if (!error) {
        showNotification('プロジェクトを削除しました', 'success');
        setShowDeleteProject(false);
      } else {
        showNotification('プロジェクトの削除に失敗しました', 'error');
      }
    } catch (error) {
      showNotification('プロジェクトの削除に失敗しました', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold">プロジェクト管理</h2>
      </div>

      {/* 現在のプロジェクト情報 */}
      {currentProject && (
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-900 mb-2">現在のプロジェクト</h3>
          <div className="text-blue-800">
            <div className="font-medium">{currentProject.name}</div>
            {currentProject.description && (
              <div className="text-sm mt-1">{currentProject.description}</div>
            )}
          </div>
        </div>
      )}

      {/* プロジェクト管理オプション */}
      <div className="space-y-3">
        <button 
          onClick={() => onNavigateToView('project-members')}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <Users className="h-5 w-5 text-blue-600" />
          <span className="font-medium">メンバー一覧</span>
        </button>
        
        <button 
          onClick={() => setShowCreateProject(true)}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
        >
          <Plus className="h-5 w-5 text-green-600" />
          <span className="font-medium">プロジェクト作成</span>
        </button>
        
        <button 
          onClick={() => setShowProjectSwitch(true)}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200"
        >
          <Settings className="h-5 w-5 text-yellow-600" />
          <span className="font-medium">プロジェクト切り替え</span>
        </button>

        {currentProject && (
          <button 
            onClick={() => setShowDeleteProject(true)}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200"
          >
            <Trash2 className="h-5 w-5 text-red-600" />
            <span className="font-medium">プロジェクト削除</span>
          </button>
        )}
      </div>

      {/* ユーザー情報 */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-4">
          <User className="h-5 w-5 text-gray-600" />
          <div className="text-left">
            <div className="font-medium text-gray-900">{user?.email}</div>
            <div className="text-sm text-gray-500">システム設計アシスタント</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <LogOut className="h-5 w-5 text-gray-600" />
          <span className="text-left">ログアウト</span>
        </button>
      </div>

      {/* 通知 */}
      {notification && (
        <div className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' : 
          notification.type === 'error' ? 'bg-red-50 border border-red-200' : 
          'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
            {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            <span className={`text-sm font-medium ${
              notification.type === 'success' ? 'text-green-800' : 
              notification.type === 'error' ? 'text-red-800' : 
              'text-blue-800'
            }`}>
              {notification.message}
            </span>
            <button onClick={() => setNotification(null)} className="ml-auto text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        </div>
      )}

      {/* プロジェクト作成ダイアログ */}
      {showCreateProject && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-bold text-lg">新規プロジェクト作成</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">プロジェクト名 *</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="プロジェクト名を入力"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="プロジェクトの説明を入力"
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
              >
                作成
              </button>
              <button
                onClick={() => setShowCreateProject(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* プロジェクト切り替えダイアログ */}
      {showProjectSwitch && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-bold text-lg">プロジェクト切り替え</h3>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectSelect(project)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    currentProject?.id === project.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{project.name}</div>
                  {project.description && (
                    <div className="text-sm text-gray-600 mt-1">{project.description}</div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowProjectSwitch(false)}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* プロジェクト削除確認ダイアログ */}
      {showDeleteProject && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-bold text-lg text-red-600">プロジェクト削除</h3>
            <p className="text-gray-600">
              プロジェクト「{currentProject?.name}」を削除しますか？<br />
              この操作は取り消せません。
            </p>
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={confirmDeleteProject}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium"
              >
                削除
              </button>
              <button
                onClick={() => setShowDeleteProject(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 