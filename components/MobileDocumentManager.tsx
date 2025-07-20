import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Upload, 
  Trash2, 
  Search,
  Filter,
  FileText,
  Eye,
  Edit,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface MobileDocumentManagerProps {
  onBack: () => void;
}

interface Document {
  id: string;
  name: string;
  type: string;
  description: string;
  content: string;
  tags: string[];
  status: 'draft' | 'review' | 'approved' | 'archived';
  isLatest: boolean;
  createdAt: Date;
  updatedAt: Date;
  size: number;
  author: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

// モックデータ
const mockDocuments: Document[] = [
  {
    id: '1',
    name: '要件定義書',
    type: 'requirements-definition',
    description: 'システムの要件を定義したドキュメント',
    content: '# 要件定義書\n\n## 1. プロジェクト概要\n...',
    tags: ['要件定義', 'システム設計'],
    status: 'approved',
    isLatest: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    size: 2048,
    author: '田中太郎'
  },
  {
    id: '2',
    name: '基本設計書',
    type: 'basic-design',
    description: 'システムの基本設計を記述したドキュメント',
    content: '# 基本設計書\n\n## 1. システム概要\n...',
    tags: ['基本設計', 'アーキテクチャ'],
    status: 'review',
    isLatest: true,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-30'),
    size: 4096,
    author: '佐藤花子'
  },
  {
    id: '3',
    name: '外部設計書',
    type: 'external-design',
    description: '画面設計とAPI設計を記述したドキュメント',
    content: '# 外部設計書\n\n## 1. 画面設計\n...',
    tags: ['外部設計', 'UI/UX'],
    status: 'draft',
    isLatest: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
    size: 3072,
    author: '鈴木一郎'
  },
  {
    id: '4',
    name: '要件定義書_v1.1',
    type: 'requirements-definition',
    description: '要件定義書の更新版',
    content: '# 要件定義書 v1.1\n\n## 1. プロジェクト概要\n...',
    tags: ['要件定義', '更新版'],
    status: 'archived',
    isLatest: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    size: 1536,
    author: '田中太郎'
  }
];

const documentTypes = [
  { value: 'all', label: '全て' },
  { value: 'requirements-definition', label: '要件定義' },
  { value: 'basic-design', label: '基本設計' },
  { value: 'external-design', label: '外部設計' },
  { value: 'development-prep', label: '開発準備' },
  { value: 'other', label: 'その他' }
];

const statusOptions = [
  { value: 'all', label: '全て' },
  { value: 'draft', label: '下書き' },
  { value: 'review', label: 'レビュー中' },
  { value: 'approved', label: '承認済み' },
  { value: 'archived', label: 'アーカイブ' }
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  archived: 'bg-blue-100 text-blue-800'
};

const statusLabels = {
  draft: '下書き',
  review: 'レビュー中',
  approved: '承認済み',
  archived: 'アーカイブ'
};

export function MobileDocumentManager({ onBack }: MobileDocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [newDoc, setNewDoc] = useState({
    name: '',
    type: 'requirements-definition',
    description: '',
    content: '',
    tags: [] as string[],
    isLatest: true
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  const formatFileSize = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

  const formatDateTime = (date: Date) => date.toLocaleString('ja-JP', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleUpload = () => {
    if (!newDoc.name.trim()) {
      showNotification('ファイル名を入力してください', 'error');
      return;
    }

    const newDocument: Document = {
      id: Date.now().toString(),
      name: newDoc.name,
      type: newDoc.type,
      description: newDoc.description,
      content: newDoc.content,
      tags: newDoc.tags,
      status: 'draft',
      isLatest: newDoc.isLatest,
      createdAt: new Date(),
      updatedAt: new Date(),
      size: new Blob([newDoc.content]).size,
      author: '現在のユーザー'
    };

    setDocuments(prev => [newDocument, ...prev]);
    setShowUpload(false);
    setNewDoc({
      name: '',
      type: 'requirements-definition',
      description: '',
      content: '',
      tags: [],
      isLatest: true
    });
    showNotification('ドキュメントをアップロードしました', 'success');
  };

  const handleDownload = (doc: Document) => {
    try {
      const blob = new Blob([doc.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.name}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification(`${doc.name}をダウンロードしました`, 'success');
    } catch (error) {
      showNotification('ダウンロードに失敗しました', 'error');
    }
  };

  const handleDelete = (docId: string) => {
    if (window.confirm('このドキュメントを削除しますか？')) {
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      showNotification('ドキュメントを削除しました', 'success');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
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
        <h2 className="text-xl font-bold">ドキュメント管理</h2>
      </div>

      {/* 検索・フィルター */}
      <div className="space-y-4">
        {/* 検索 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="ドキュメントを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* フィルター */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* アップロードボタン */}
      <button
        onClick={() => setShowUpload(true)}
        className="w-full flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span>新規ドキュメント作成</span>
      </button>

      {/* ドキュメント一覧 */}
      <div className="space-y-4">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">ドキュメントが見つかりません</h3>
            <p className="text-gray-500">検索条件を変更するか、新しいドキュメントを作成してください</p>
          </div>
        ) : (
          filteredDocuments.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{doc.name}</h3>
                    {doc.isLatest && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        最新版
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {documentTypes.find(t => t.value === doc.type)?.label}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[doc.status]}`}>
                      {statusLabels[doc.status]}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {doc.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>作成者: {doc.author}</span>
                    <span>サイズ: {formatFileSize(doc.size)}</span>
                    <span>更新: {formatDateTime(doc.updatedAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDocument(doc)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>詳細</span>
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>ダウンロード</span>
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* アップロードダイアログ */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-bold text-lg">新規ドキュメント作成</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ファイル名 *</label>
                <input
                  type="text"
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                  placeholder="ファイル名.md"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                <select
                  value={newDoc.type}
                  onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {documentTypes.filter(t => t.value !== 'all').map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                <input
                  type="text"
                  value={newDoc.description}
                  onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                  placeholder="ドキュメントの説明"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">内容 (Markdown)</label>
                <textarea
                  value={newDoc.content}
                  onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                  placeholder="# タイトル\n\n## セクション1\n..."
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">タグ（カンマ区切り）</label>
                <input
                  type="text"
                  value={newDoc.tags.join(', ')}
                  onChange={(e) => setNewDoc({ 
                    ...newDoc, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                  })}
                  placeholder="タグ1, タグ2, タグ3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newDoc.isLatest}
                  onChange={(e) => setNewDoc({ ...newDoc, isLatest: e.target.checked })}
                  className="rounded"
                />
                <span>最新版としてマーク</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleUpload}
                disabled={!newDoc.name.trim()}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
              >
                作成
              </button>
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ドキュメント詳細モーダル */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedDocument.name}</h2>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>説明:</strong> {selectedDocument.description}</p>
                <p><strong>作成者:</strong> {selectedDocument.author}</p>
                <p><strong>サイズ:</strong> {formatFileSize(selectedDocument.size)}</p>
                <p><strong>作成日:</strong> {formatDateTime(selectedDocument.createdAt)}</p>
                <p><strong>更新日:</strong> {formatDateTime(selectedDocument.updatedAt)}</p>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                  {selectedDocument.content}
                </pre>
              </div>
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