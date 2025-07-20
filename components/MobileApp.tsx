import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Download, FileText, Target, Layout, Settings, Code, Search, MessageCircle, Layers, Users, Plus, Trash2, LogOut, User, AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext';
import { useProjectData } from '../contexts/ProjectDataContext';
import { ProjectMembersDialog } from './ProjectMembersDialog';
import { CreateProjectDialog } from './CreateProjectDialog';
import { DeleteProjectDialog } from './DeleteProjectDialog';
import { ProjectSwitchDialog } from './ProjectSwitchDialog';
import { MobileProjectManagement } from './MobileProjectManagement';
import { MobileTemplates } from './MobileTemplates';
import { MobileGuide } from './MobileGuide';
import { MobileDocumentManager } from './MobileDocumentManager';
import { MobileDeliverablesChecklist } from './MobileDeliverablesChecklist';

// 通知の型定義
interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface MobileNotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const phases = [
  { id: 'requirements-definition', label: '要件定義', icon: <span>🔍</span> },
  { id: 'basic-design', label: '基本設計', icon: <span>📝</span> },
  { id: 'external-design', label: '外部設計', icon: <span>📐</span> },
  { id: 'development-prep', label: '開発準備', icon: <span>⚙️</span> },
];

// 進捗表示コンポーネント（改善版）
function MobilePhaseOverview({ phase }) {
  const totalTasks = phase.tasks.length;
  const completedTasks = phase.tasks.filter(task => task.status === 'completed').length;
  const totalDeliverables = phase.deliverables.length;
  const completedDeliverables = phase.deliverables.filter(deliverable => deliverable.status === 'completed').length;
  
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const deliverableProgress = totalDeliverables > 0 ? (completedDeliverables / totalDeliverables) * 100 : 0;
  const overallProgress = totalTasks + totalDeliverables > 0 ? 
    ((completedTasks + completedDeliverables) / (totalTasks + totalDeliverables)) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-4">{phase.title}</h2>
        
        {/* 全体進捗 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">全体進捗</span>
            <span className="text-sm font-bold text-blue-600">{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* 詳細進捗 */}
        <div className="grid grid-cols-2 gap-4">
          {/* タスク進捗 */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-blue-700">タスク</span>
              <span className="text-xs font-bold text-blue-600">{completedTasks}/{totalTasks}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${taskProgress}%` }}
              ></div>
            </div>
          </div>

          {/* 成果物進捗 */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-green-700">成果物</span>
              <span className="text-xs font-bold text-green-600">{completedDeliverables}/{totalDeliverables}</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${deliverableProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <div className="font-bold text-gray-900">{totalTasks}</div>
              <div className="text-gray-500">タスク</div>
            </div>
            <div>
              <div className="font-bold text-gray-900">{totalDeliverables}</div>
              <div className="text-gray-500">成果物</div>
            </div>
            <div>
              <div className="font-bold text-gray-900">{Math.round(overallProgress)}%</div>
              <div className="text-gray-500">完了率</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 検索・フィルタリング機能なしのタスク一覧
function MobileTaskManager({ phase, onTaskUpdate }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '低';
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-base font-bold mb-3">主要タスク</h2>
      
      {/* タスク一覧 */}
      <div className="space-y-3">
        {phase.tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>タスクがありません</p>
          </div>
        ) : (
          phase.tasks.map(task => (
            <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={() => onTaskUpdate(task.id, task.status === 'completed' ? false : true)}
                className="mt-1 accent-blue-500"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>{task.title}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityColor(task.priority)}`}>{getPriorityLabel(task.priority)}</span>
                </div>
                <p className={`text-xs text-gray-600 ${task.status === 'completed' ? 'line-through' : ''}`}>{task.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 検索・フィルタリング機能なしの成果物一覧
function MobileDeliverableTracker({ phase, onStatusUpdate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-gray-100 text-gray-600';
      case 'not-started': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return '完了';
      case 'in-progress': return '進行中';
      case 'pending': return '未着手';
      case 'not-started': return '未着手';
      default: return '未着手';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'document': return 'ドキュメント';
      case 'design': return '設計';
      case 'code': return 'コード';
      case 'test': return 'テスト';
      default: return 'その他';
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-base font-bold mb-3">主要成果物</h2>
      
      {/* 成果物一覧 */}
      <div className="space-y-3">
        {phase.deliverables.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>成果物がありません</p>
          </div>
        ) : (
          phase.deliverables.map(deliverable => (
            <div key={deliverable.id} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${deliverable.status === 'completed' ? 'line-through text-gray-400' : ''}`}>{deliverable.title}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(deliverable.status)}`}>{getStatusLabel(deliverable.status)}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">{getTypeLabel(deliverable.type)}</span>
                </div>
                <p className={`text-xs text-gray-600 ${deliverable.status === 'completed' ? 'line-through' : ''}`}>{deliverable.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 通知コンポーネント
function MobileNotification({ message, type, onClose }: MobileNotificationProps) {
  const isSuccess = type === 'success';
  const isError = type === 'error';
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      isSuccess ? 'bg-green-50 border border-green-200' : 
      isError ? 'bg-red-50 border border-red-200' : 
      'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex items-center gap-3">
        {isSuccess && <CheckCircle2 className="h-5 w-5 text-green-600" />}
        {isError && <AlertCircle className="h-5 w-5 text-red-600" />}
        <span className={`text-sm font-medium ${
          isSuccess ? 'text-green-800' : 
          isError ? 'text-red-800' : 
          'text-blue-800'
        }`}>
          {message}
        </span>
        <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">
          ×
        </button>
      </div>
    </div>
  );
}





// 統一されたモーダルコンポーネント（アニメーション付き）
function MobileUnifiedModal({ isOpen, onClose, onNavigateToView }) {
  const [activeSection, setActiveSection] = useState('main');
  const [notification, setNotification] = useState<Notification | null>(null);
  
  const { projects, currentProject, selectProject, deleteProject, createProject } = useProject();
  const { signOut, user } = useAuth();
  const { phases, tasks, deliverables } = useProjectData();

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showNotification('ログアウトしました', 'success');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      showNotification('ログアウトに失敗しました', 'error');
    }
  };

  const handleProjectSelect = (project) => {
    selectProject(project);
    showNotification(`プロジェクト「${project.name}」に切り替えました`, 'success');
    onClose();
  };

  const confirmDeleteProject = async () => {
    if (currentProject && window.confirm(`プロジェクト「${currentProject.name}」を削除しますか？\nこの操作は取り消せません。`)) {
      try {
        const result = await deleteProject(currentProject.id);
        if (result.error) {
          showNotification(result.error.message, 'error');
        } else {
          showNotification('プロジェクトを削除しました', 'success');
          onClose();
        }
      } catch (error) {
        console.error('プロジェクト削除エラー:', error);
        showNotification('プロジェクトの削除に失敗しました', 'error');
      }
    }
  };

  const handleExportData = () => {
    const data = {
      project: currentProject,
      phases,
      tasks,
      deliverables,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject?.name || 'project'}_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('データをエクスポートしました', 'success');
  };

  const handleBackupData = () => {
    const data = {
      project: currentProject,
      phases,
      tasks,
      deliverables,
      backupDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject?.name || 'project'}_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('バックアップを作成しました', 'success');
  };

  const handleImportData = () => {
    // プレースホルダー実装
    showNotification('インポート機能は今後実装予定です', 'info');
  };

  const handleNavigateToView = (view) => {
    onNavigateToView(view);
    onClose();
  };

  const menuItems = [
    { id: 'project', label: 'プロジェクト管理', icon: <Settings className="h-5 w-5" />, color: 'text-blue-600' },
    { id: 'templates', label: 'テンプレート', icon: <FileText className="h-5 w-5" />, color: 'text-green-600' },
    { id: 'guide', label: '基本ガイド', icon: <Target className="h-5 w-5" />, color: 'text-purple-600' },
    { id: 'documents', label: 'ドキュメント管理', icon: <Layers className="h-5 w-5" />, color: 'text-orange-600' },
    { id: 'deliverables', label: '成果物チェック', icon: <CheckCircle className="h-5 w-5" />, color: 'text-red-600' },
  ];

  const projectSubItems = [
    { id: 'project-members', label: 'メンバー一覧', icon: <Users className="h-5 w-5" />, color: 'text-blue-600' },
    { id: 'create-project', label: 'プロジェクト作成', icon: <Plus className="h-5 w-5" />, color: 'text-green-600' },
    { id: 'switch-project', label: 'プロジェクト切り替え', icon: <Settings className="h-5 w-5" />, color: 'text-yellow-600' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景オーバーレイ（アニメーション付き） */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* モーダル本体（アニメーション付き） */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-11/12 max-w-md max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
        {/* 通知 */}
        {notification && (
          <div className={`absolute top-4 left-4 right-4 z-10 p-3 rounded-lg shadow-lg transform transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' :
            notification.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{notification.message}</span>
              <button 
                onClick={() => setNotification(null)}
                className="ml-2 text-lg hover:opacity-70 transition-opacity"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {activeSection === 'main' ? 'メニュー' : 
             activeSection === 'project' ? 'プロジェクト管理' :
             activeSection === 'project-members' ? 'メンバー一覧' :
             activeSection === 'create-project' ? 'プロジェクト作成' :
             activeSection === 'switch-project' ? 'プロジェクト切り替え' :
             activeSection === 'templates' ? 'テンプレート' :
             activeSection === 'guide' ? '基本ガイド' :
             activeSection === 'documents' ? 'ドキュメント管理' :
             '成果物チェック'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <span className="text-2xl text-gray-500 hover:text-gray-700">×</span>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {activeSection === 'main' && (
            <div className="space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'project') {
                      handleNavigateToView('project-management');
                    } else {
                      handleNavigateToView(item.id);
                    }
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] bg-white"
                >
                  <div className={`p-2 rounded-lg bg-gray-50 ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-left font-medium text-gray-900">{item.label}</span>
                  <div className="ml-auto">
                    <span className="text-gray-400">›</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeSection === 'project' && (
            <div className="space-y-4">
              {/* 現在のプロジェクト情報 */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-bold text-blue-900 mb-2">現在のプロジェクト</h3>
                <p className="text-blue-800">{currentProject?.name || 'プロジェクトが選択されていません'}</p>
              </div>

              {/* プロジェクト管理サブメニュー */}
              <div className="space-y-3">
                {projectSubItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <div className={`p-2 rounded-lg bg-gray-50 ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-gray-900">{item.label}</span>
                    <div className="ml-auto">
                      <span className="text-gray-400">›</span>
                    </div>
                  </button>
                ))}
                
                <button 
                  onClick={confirmDeleteProject}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 bg-white"
                >
                  <div className="p-2 rounded-lg bg-gray-50 text-red-600">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-gray-900">プロジェクト削除</span>
                </button>
              </div>
            </div>
          )}

          {activeSection === 'project-members' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">メンバー一覧</h3>
                <p className="text-gray-600">プロジェクトのメンバーを管理できます</p>
              </div>
              <button 
                onClick={() => handleNavigateToView('project-members')}
                className="w-full p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                メンバー一覧を表示
              </button>
            </div>
          )}

          {activeSection === 'create-project' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Plus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">プロジェクト作成</h3>
                <p className="text-gray-600">新しいプロジェクトを作成できます</p>
              </div>
              <button 
                onClick={() => handleNavigateToView('create-project')}
                className="w-full p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200"
              >
                プロジェクト作成画面を表示
              </button>
            </div>
          )}

          {activeSection === 'switch-project' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">プロジェクト切り替え</h3>
                <p className="text-gray-600">別のプロジェクトに切り替えることができます</p>
              </div>
              <button 
                onClick={() => handleNavigateToView('switch-project')}
                className="w-full p-4 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors duration-200"
              >
                プロジェクト切り替え画面を表示
              </button>
            </div>
          )}

        </div>

        {/* 戻るボタン（メイン以外の画面で表示） */}
        {activeSection !== 'main' && (
          <div className="p-6 border-t border-gray-200">
            <button 
              onClick={() => {
                if (activeSection === 'project-members' || activeSection === 'create-project' || activeSection === 'switch-project') {
                  setActiveSection('project');
                } else {
                  setActiveSection('main');
                }
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <span className="text-lg">‹</span>
              <span className="font-medium">戻る</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MobileApp() {
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [unifiedModalOpen, setUnifiedModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('phase'); // 'phase' | 'templates' | 'guide' | 'documents'
  const [notification, setNotification] = useState<Notification | null>(null);
  
  const { currentProject } = useProject();
  const { phases, tasks, deliverables, loading, updateTask, updateDeliverable } = useProjectData();
  const { signOut } = useAuth();

  // データを組み合わせて表示用のフェーズデータを作成
  const phasesWithData = phases.map(phase => ({
    ...phase,
    title: phase.name,
    tasks: tasks.filter(task => task.phase_id === phase.id),
    deliverables: deliverables.filter(deliverable => deliverable.phase_id === phase.id),
  }));

  // activePhaseの初期値を設定（より安全な処理）
  useEffect(() => {
    if (phasesWithData.length > 0) {
      // activePhaseがnullの場合、または現在のactivePhaseが有効でない場合のみ設定
      if (!activePhase || !phasesWithData.find(phase => phase.id === activePhase)) {
        setActivePhase(phasesWithData[0].id);
      }
    } else {
      // フェーズデータが空の場合はactivePhaseをリセット
      setActivePhase(null);
    }
  }, [phasesWithData]); // activePhaseを依存配列から削除

  // currentPhaseを安全に取得
  const currentPhase = activePhase ? phasesWithData.find(phase => phase.id === activePhase) : null;

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showNotification('ログアウトしました', 'success');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      showNotification('ログアウトに失敗しました', 'error');
    }
  };

  // タスク・成果物の状態更新（実際のデータベースと連携）
  const handleTaskUpdate = async (taskId, isCompleted) => {
    try {
      await updateTask(taskId, { status: isCompleted ? 'completed' : 'todo' });
      showNotification(isCompleted ? 'タスクを完了しました' : 'タスクを未完了にしました', 'success');
    } catch (error) {
      console.error('タスク更新エラー:', error);
      showNotification('タスクの更新に失敗しました', 'error');
    }
  };

  const handleDeliverableUpdate = async (deliverableId, status) => {
    try {
      // フロントエンドのステータスをデータベースのステータスに変換
      const dbStatus = status === 'not-started' ? 'pending' : status;
      await updateDeliverable(deliverableId, { status: dbStatus });
      showNotification('成果物のステータスを更新しました', 'success');
    } catch (error) {
      console.error('成果物更新エラー:', error);
      showNotification('成果物の更新に失敗しました', 'error');
    }
  };

  // 成果物チェックリストの状態更新
  const handleDeliverableCheck = async (phaseId, deliverableId, isCompleted) => {
    try {
      const status = isCompleted ? 'completed' : 'pending';
      await updateDeliverable(deliverableId, { status });
      showNotification(isCompleted ? '成果物を完了しました' : '成果物を未完了にしました', 'success');
    } catch (error) {
      console.error('成果物チェックエラー:', error);
      showNotification('成果物の更新に失敗しました', 'error');
    }
  };

  // モーダルからの画面遷移ハンドラー
  const handleNavigateToView = (view) => {
    setActiveView(view);
    setUnifiedModalOpen(false);
  };

  // ローディング状態
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="flex items-center justify-between h-14 px-4 bg-white border-b shadow-sm">
          <span className="font-bold text-lg">{currentProject?.name || 'システム設計アシスタント'}</span>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">データを読み込み中...</p>
          </div>
        </main>
      </div>
    );
  }

  // プロジェクトが選択されていない場合
  if (!currentProject) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="flex items-center justify-between h-14 px-4 bg-white border-b shadow-sm">
          <span className="font-bold text-lg">システム設計アシスタント</span>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg mb-2">プロジェクトが選択されていません</div>
            <div className="text-sm text-gray-500">プロジェクトを選択してください</div>
          </div>
        </main>
      </div>
    );
  }

  // フェーズデータが空の場合
  if (phasesWithData.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="flex items-center justify-between h-14 px-4 bg-white border-b shadow-sm">
          <span className="font-bold text-lg">{currentProject?.name || 'システム設計アシスタント'}</span>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg mb-2">フェーズデータが見つかりません</div>
            <div className="text-sm text-gray-500">プロジェクトにフェーズが設定されていない可能性があります</div>
          </div>
        </main>
      </div>
    );
  }

  // 現在のフェーズが取得できない場合
  if (!currentPhase) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="flex items-center justify-between h-14 px-4 bg-white border-b shadow-sm">
          <span className="font-bold text-lg">{currentProject?.name || 'システム設計アシスタント'}</span>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg mb-2">フェーズの読み込みに失敗しました</div>
            <div className="text-sm text-gray-500">ページを再読み込みしてください</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 通知 */}
      {notification && (
        <MobileNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* ヘッダー */}
      <header className="flex items-center justify-between h-14 px-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">{currentProject?.name || 'システム設計アシスタント'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setUnifiedModalOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <LogOut className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* メイン */}
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        {activeView === "phase" && currentPhase && (
          <>
            <MobilePhaseOverview phase={currentPhase} />
            <MobileTaskManager
              phase={currentPhase}
              onTaskUpdate={handleTaskUpdate}
            />
            <MobileDeliverableTracker
              phase={currentPhase}
              onStatusUpdate={handleDeliverableUpdate}
            />
          </>
        )}
        {activeView === "templates" && <MobileTemplates onBack={() => setActiveView('phase')} />}
        {activeView === "guide" && <MobileGuide onBack={() => setActiveView('phase')} />}
        {activeView === "documents" && <MobileDocumentManager onBack={() => setActiveView('phase')} />}
        {activeView === "deliverables-checklist" && (
          <MobileDeliverablesChecklist 
            onBack={() => setActiveView('phase')}
          />
        )}
        {activeView === "project-management" && (
          <MobileProjectManagement 
            onBack={() => setActiveView('phase')} 
            onNavigateToView={(view) => setActiveView(view as any)}
          />
        )}
        {activeView === "project-members" && (
          <MobileProjectManagement 
            onBack={() => setActiveView('phase')} 
            onNavigateToView={(view) => setActiveView(view as any)}
          />
        )}
        {activeView === "create-project" && (
          <MobileProjectManagement 
            onBack={() => setActiveView('phase')} 
            onNavigateToView={(view) => setActiveView(view as any)}
          />
        )}
        {activeView === "switch-project" && (
          <MobileProjectManagement 
            onBack={() => setActiveView('phase')} 
            onNavigateToView={(view) => setActiveView(view as any)}
          />
        )}
      </main>

      {/* フッター（ボトムナビゲーション） */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around items-center h-24 z-20">
        {phasesWithData.map(phase => (
          <button
            key={phase.id}
            onClick={() => { setActivePhase(phase.id); setActiveView('phase'); }}
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              activePhase === phase.id && activeView === 'phase' ? 'text-blue-600 font-bold' : 'text-gray-500'
            }`}
          >
            <span className="text-2xl">
              {phase.title === '要件定義' ? '🔍' : 
               phase.title === '基本設計' ? '📝' : 
               phase.title === '外部設計' ? '📐' : '⚙️'}
            </span>
            <span className="text-sm mt-1">{phase.title}</span>
          </button>
        ))}
      </footer>

      {/* 統一されたモーダル */}
      <MobileUnifiedModal
        isOpen={unifiedModalOpen}
        onClose={() => setUnifiedModalOpen(false)}
        onNavigateToView={handleNavigateToView}
      />
    </div>
  );
} 