import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, ArrowLeft, Search, Filter, FileText, Calendar, Tag, Download, Trash2, Plus, Eye } from 'lucide-react';
import { useProjectData } from '../contexts/ProjectDataContext';
import { useProject } from '../contexts/ProjectContext';

interface MobileDeliverablesChecklistProps {
  onBack: () => void;
}

interface Deliverable {
  id: string;
  project_id: string;
  phase_id: string;
  name: string;
  description?: string;
  type: 'document' | 'design' | 'code' | 'other';
  status: 'pending' | 'in-progress' | 'completed';
  order_index: number;
  created_at: string;
  updated_at: string;
}

export function MobileDeliverablesChecklist({ onBack }: MobileDeliverablesChecklistProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);

  // コンテキストからデータを取得
  const { currentProject } = useProject();
  const { phases, deliverables, loading, updateDeliverable } = useProjectData();

  // フェーズごとに成果物をグループ化
  const deliverablesByPhase = phases.map(phase => ({
    ...phase,
    deliverables: deliverables.filter(d => d.phase_id === phase.id)
  }));

  // フィルタリングされた成果物
  const filteredDeliverables = deliverables.filter(deliverable => {
    const matchesSearch = deliverable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deliverable.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || deliverable.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || deliverable.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // 進捗計算
  const getProgress = (deliverables: Deliverable[]) => {
    const total = deliverables.length;
    const completed = deliverables.filter(d => d.status === 'completed').length;
    return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
  };

  // 全体の進捗
  const overallProgress = getProgress(deliverables);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '完了';
      case 'in-progress': return '進行中';
      case 'pending': return '未着手';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'text-blue-600 bg-blue-50';
      case 'design': return 'text-purple-600 bg-purple-50';
      case 'code': return 'text-green-600 bg-green-50';
      case 'other': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'document': return 'ドキュメント';
      case 'design': return '設計書';
      case 'code': return 'コード';
      case 'other': return 'その他';
      default: return type;
    }
  };

  const handleStatusUpdate = async (deliverableId: string, newStatus: string) => {
    try {
      const { error } = await updateDeliverable(deliverableId, { status: newStatus as any });
      if (error) {
        alert(`更新エラー: ${error.message}`);
      }
    } catch (error) {
      alert('更新処理中にエラーが発生しました');
    }
  };

  const handleDownload = (deliverable: Deliverable) => {
    // ダウンロード機能のシミュレーション
    const content = `# ${deliverable.name}\n\n${deliverable.description}\n\nステータス: ${getStatusLabel(deliverable.status)}\nタイプ: ${getTypeLabel(deliverable.type)}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deliverable.name}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderDeliverableDetail = (deliverable: Deliverable) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">{deliverable.name}</h3>
            <button
              onClick={() => setSelectedDeliverable(null)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">説明</h4>
            <p className="text-gray-600 text-sm">{deliverable.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">ステータス</h4>
              <div className="flex items-center gap-2">
                {getStatusIcon(deliverable.status)}
                <span className="text-sm">{getStatusLabel(deliverable.status)}</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-1">タイプ</h4>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(deliverable.type)}`}>
                {getTypeLabel(deliverable.type)}
              </span>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-1">作成日</h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              {new Date(deliverable.created_at).toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleDownload(deliverable)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              ダウンロード
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">成果物チェックリスト</h1>
        </div>
      </div>

      {/* 全体進捗 */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-900">全体進捗</h2>
            <span className="text-sm text-gray-600">
              {overallProgress.completed}/{overallProgress.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress.percent}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">{overallProgress.percent}% 完了</p>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="成果物を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">全タイプ</option>
                <option value="document">ドキュメント</option>
                <option value="design">設計書</option>
                <option value="code">コード</option>
                <option value="other">その他</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">全ステータス</option>
                <option value="pending">未着手</option>
                <option value="in-progress">進行中</option>
                <option value="completed">完了</option>
              </select>
            </div>
          </div>
        </div>

        {/* 成果物一覧 */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">読み込み中...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliverablesByPhase.map((phase) => {
              const phaseDeliverables = filteredDeliverables.filter(d => d.phase_id === phase.id);
              if (phaseDeliverables.length === 0) return null;
              
              const progress = getProgress(phaseDeliverables);
              
              return (
                <div key={phase.id} className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">{phase.name}</h3>
                    <span className="text-sm text-gray-600">
                      {progress.completed}/{progress.total}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    {phaseDeliverables.map((deliverable) => (
                      <div key={deliverable.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">{deliverable.name}</h4>
                              {getStatusIcon(deliverable.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{deliverable.description}</p>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(deliverable.type)}`}>
                                {getTypeLabel(deliverable.type)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedDeliverable(deliverable)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <select
                              value={deliverable.status}
                              onChange={(e) => handleStatusUpdate(deliverable.id, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="pending">未着手</option>
                              <option value="in-progress">進行中</option>
                              <option value="completed">完了</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {filteredDeliverables.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>成果物が見つかりません</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 詳細モーダル */}
      {selectedDeliverable && renderDeliverableDetail(selectedDeliverable)}
    </div>
  );
} 