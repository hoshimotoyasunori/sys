import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Eye,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface MobileDeliverablesChecklistProps {
  onBack: () => void;
}

interface Deliverable {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  phase: string;
  assignee: string;
  dueDate: Date;
  completedAt?: Date;
  checklist: ChecklistItem[];
  attachments: string[];
  notes: string;
  dependencies: string[];
}

interface ChecklistItem {
  id: string;
  description: string;
  isCompleted: boolean;
  completedAt?: Date;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

// モックデータ
const mockDeliverables: Deliverable[] = [
  {
    id: '1',
    name: '要件定義書',
    description: 'システムの要件を定義したドキュメント',
    category: 'ドキュメント',
    status: 'completed',
    priority: 'high',
    phase: '要件定義',
    assignee: '田中太郎',
    dueDate: new Date('2024-01-20'),
    completedAt: new Date('2024-01-18'),
    checklist: [
      { id: '1-1', description: 'プロジェクト概要の整理', isCompleted: true, completedAt: new Date('2024-01-15') },
      { id: '1-2', description: '機能要件の定義', isCompleted: true, completedAt: new Date('2024-01-17') },
      { id: '1-3', description: '非機能要件の定義', isCompleted: true, completedAt: new Date('2024-01-18') }
    ],
    attachments: ['要件定義書_v1.0.pdf', 'ユースケース図.pdf'],
    notes: 'ステークホルダーの承認済み',
    dependencies: []
  },
  {
    id: '2',
    name: '基本設計書',
    description: 'システムの基本設計を記述したドキュメント',
    category: 'ドキュメント',
    status: 'in-progress',
    priority: 'high',
    phase: '基本設計',
    assignee: '佐藤花子',
    dueDate: new Date('2024-02-10'),
    checklist: [
      { id: '2-1', description: 'システムアーキテクチャの設計', isCompleted: true, completedAt: new Date('2024-01-25') },
      { id: '2-2', description: 'データベース設計', isCompleted: false },
      { id: '2-3', description: 'API設計', isCompleted: false }
    ],
    attachments: ['基本設計書_v0.8.pdf'],
    notes: 'データベース設計が遅れている',
    dependencies: ['要件定義書']
  },
  {
    id: '3',
    name: '画面設計書',
    description: 'ユーザーインターフェースの設計書',
    category: 'ドキュメント',
    status: 'not-started',
    priority: 'medium',
    phase: '外部設計',
    assignee: '鈴木一郎',
    dueDate: new Date('2024-02-20'),
    checklist: [
      { id: '3-1', description: '画面一覧の作成', isCompleted: false },
      { id: '3-2', description: '画面レイアウトの設計', isCompleted: false },
      { id: '3-3', description: 'プロトタイプの作成', isCompleted: false }
    ],
    attachments: [],
    notes: '基本設計書の完了を待つ',
    dependencies: ['基本設計書']
  },
  {
    id: '4',
    name: 'データベース構築',
    description: '開発環境のデータベース構築',
    category: '開発',
    status: 'blocked',
    priority: 'critical',
    phase: '開発準備',
    assignee: '高橋美咲',
    dueDate: new Date('2024-02-05'),
    checklist: [
      { id: '4-1', description: 'DBサーバーの準備', isCompleted: false },
      { id: '4-2', description: 'スキーマの作成', isCompleted: false },
      { id: '4-3', description: '初期データの投入', isCompleted: false }
    ],
    attachments: ['DB設計書.pdf'],
    notes: 'インフラチームとの調整が必要',
    dependencies: ['基本設計書']
  }
];

const categories = ['全て', 'ドキュメント', '開発', 'テスト', '運用'];
const statusOptions = ['全て', 'not-started', 'in-progress', 'completed', 'blocked'];
const priorityOptions = ['全て', 'low', 'medium', 'high', 'critical'];

const statusColors = {
  'not-started': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'blocked': 'bg-red-100 text-red-800'
};

const statusLabels = {
  'not-started': '未開始',
  'in-progress': '進行中',
  'completed': '完了',
  'blocked': 'ブロック'
};

const priorityColors = {
  'low': 'bg-gray-100 text-gray-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'high': 'bg-orange-100 text-orange-800',
  'critical': 'bg-red-100 text-red-800'
};

const priorityLabels = {
  'low': '低',
  'medium': '中',
  'high': '高',
  'critical': '緊急'
};

export function MobileDeliverablesChecklist({ onBack }: MobileDeliverablesChecklistProps) {
  const [deliverables, setDeliverables] = useState<Deliverable[]>(mockDeliverables);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全て');
  const [selectedStatus, setSelectedStatus] = useState('全て');
  const [selectedPriority, setSelectedPriority] = useState('全て');
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  const formatDate = (date: Date) => date.toLocaleDateString('ja-JP', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });

  const getProgress = (deliverable: Deliverable) => {
    const completed = deliverable.checklist.filter(item => item.isCompleted).length;
    return Math.round((completed / deliverable.checklist.length) * 100);
  };

  const toggleChecklistItem = (deliverableId: string, itemId: string) => {
    setDeliverables(prev => prev.map(deliverable => {
      if (deliverable.id === deliverableId) {
        const updatedChecklist = deliverable.checklist.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              isCompleted: !item.isCompleted,
              completedAt: !item.isCompleted ? new Date() : undefined
            };
          }
          return item;
        });
        
        // ステータスを更新
        const completedCount = updatedChecklist.filter(item => item.isCompleted).length;
        let newStatus = deliverable.status;
        
        if (completedCount === 0) {
          newStatus = 'not-started';
        } else if (completedCount === updatedChecklist.length) {
          newStatus = 'completed';
        } else {
          newStatus = 'in-progress';
        }
        
        return {
          ...deliverable,
          checklist: updatedChecklist,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date() : deliverable.completedAt
        };
      }
      return deliverable;
    }));
    
    showNotification('チェックリストを更新しました', 'success');
  };

  const filteredDeliverables = deliverables.filter(deliverable => {
    const matchesSearch = deliverable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deliverable.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '全て' || deliverable.category === selectedCategory;
    const matchesStatus = selectedStatus === '全て' || deliverable.status === selectedStatus;
    const matchesPriority = selectedPriority === '全て' || deliverable.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

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
        <h2 className="text-xl font-bold">成果物チェック</h2>
      </div>

      {/* 検索・フィルター */}
      <div className="space-y-4">
        {/* 検索 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="成果物を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* フィルター */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status === '全て' ? 'ステータス' : statusLabels[status as keyof typeof statusLabels]}
              </option>
            ))}
          </select>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priorityOptions.map(priority => (
              <option key={priority} value={priority}>
                {priority === '全て' ? '優先度' : priorityLabels[priority as keyof typeof priorityLabels]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 成果物一覧 */}
      <div className="space-y-4">
        {filteredDeliverables.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">成果物が見つかりません</h3>
            <p className="text-gray-500">検索条件を変更してください</p>
          </div>
        ) : (
          filteredDeliverables.map(deliverable => (
            <div key={deliverable.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{deliverable.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${priorityColors[deliverable.priority]}`}>
                      {priorityLabels[deliverable.priority]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{deliverable.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {deliverable.category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[deliverable.status]}`}>
                      {statusLabels[deliverable.status]}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {deliverable.phase}
                    </span>
                  </div>
                  
                  {/* プログレスバー */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>進捗: {getProgress(deliverable)}%</span>
                      <span>{deliverable.checklist.filter(item => item.isCompleted).length}/{deliverable.checklist.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgress(deliverable)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>担当: {deliverable.assignee}</span>
                    <span>期限: {formatDate(deliverable.dueDate)}</span>
                    {deliverable.completedAt && (
                      <span>完了: {formatDate(deliverable.completedAt)}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDeliverable(deliverable)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>詳細</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 成果物詳細モーダル */}
      {selectedDeliverable && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedDeliverable.name}</h2>
                <button
                  onClick={() => setSelectedDeliverable(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>説明:</strong> {selectedDeliverable.description}</p>
                <p><strong>担当者:</strong> {selectedDeliverable.assignee}</p>
                <p><strong>期限:</strong> {formatDate(selectedDeliverable.dueDate)}</p>
                {selectedDeliverable.completedAt && (
                  <p><strong>完了日:</strong> {formatDate(selectedDeliverable.completedAt)}</p>
                )}
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
              {/* チェックリスト */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">チェックリスト</h3>
                <div className="space-y-2">
                  {selectedDeliverable.checklist.map(item => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <button
                        onClick={() => toggleChecklistItem(selectedDeliverable.id, item.id)}
                        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          item.isCompleted 
                            ? 'bg-green-600 border-green-600 text-white' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {item.isCompleted && <CheckCircle2 className="h-3 w-3" />}
                      </button>
                      <div className="flex-1">
                        <span className={`text-sm ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.description}
                        </span>
                        {item.completedAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            完了: {formatDate(item.completedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 添付ファイル */}
              {selectedDeliverable.attachments.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">添付ファイル</h3>
                  <div className="space-y-2">
                    {selectedDeliverable.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* メモ */}
              {selectedDeliverable.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">メモ</h3>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedDeliverable.notes}</p>
                  </div>
                </div>
              )}
              
              {/* 依存関係 */}
              {selectedDeliverable.dependencies.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">依存関係</h3>
                  <div className="space-y-2">
                    {selectedDeliverable.dependencies.map((dependency, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-blue-700">{dependency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
} 