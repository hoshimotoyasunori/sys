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
  AlertCircle,
  Calendar,
  User,
  Tag,
  Archive,
  Clock
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';

interface MobileDocumentManagerProps {
  onBack: () => void;
}

interface Document {
  id: string;
  name: string;
  type: 'requirements-definition' | 'basic-design' | 'external-design' | 'development-prep' | 'other';
  size: number;
  uploadDate: Date;
  updateDate: Date;
  author: string;
  content?: string;
  description?: string;
  tags: string[];
  isLatest: boolean;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

// デスクトップ版と同じドキュメントタイプ定義
const documentTypes = {
  "requirements-definition": {
    label: "要件定義",
    color: "bg-blue-500",
  },
  "basic-design": { 
    label: "基本設計", 
    color: "bg-green-500" 
  },
  "external-design": {
    label: "外部設計",
    color: "bg-purple-500",
  },
  "development-prep": {
    label: "開発準備",
    color: "bg-orange-500",
  },
  other: { 
    label: "その他", 
    color: "bg-gray-500" 
  },
};

// モックデータ（デスクトップ版と同じ構造）
const mockDocuments: Document[] = [
  {
    id: '1',
    name: '要件定義書',
    type: 'requirements-definition',
    description: 'システムの要件を定義したドキュメント',
    content: '# 要件定義書\n\n## 1. プロジェクト概要\n...',
    tags: ['要件定義', 'システム設計'],
    isLatest: true,
    uploadDate: new Date('2024-01-15'),
    updateDate: new Date('2024-01-20'),
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
    isLatest: true,
    uploadDate: new Date('2024-01-25'),
    updateDate: new Date('2024-01-30'),
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
    isLatest: true,
    uploadDate: new Date('2024-02-01'),
    updateDate: new Date('2024-02-05'),
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
    isLatest: false,
    uploadDate: new Date('2024-01-10'),
    updateDate: new Date('2024-01-15'),
    size: 1536,
    author: '田中太郎'
  }
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
    type: 'requirements-definition' as Document['type'],
    description: '',
    content: '',
    tags: [] as string[],
    isLatest: true
  });

  // コンテキストからプロジェクト情報を取得
  const { currentProject } = useProject();

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
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
      isLatest: newDoc.isLatest,
      uploadDate: new Date(),
      updateDate: new Date(),
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
      const blob = new Blob([doc.content || ''], { type: 'text/markdown' });
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
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesStatus = selectedStatus === 'all'; // モックデータにはstatusがないため
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const renderDocumentDetail = (doc: Document) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">{doc.name}</h3>
            <button
              onClick={() => setSelectedDocument(null)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">説明</h4>
            <p className="text-gray-600 text-sm">{doc.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">タイプ</h4>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                {documentTypes[doc.type].label}
              </span>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-1">バージョン</h4>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                doc.isLatest ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {doc.isLatest ? '最新版' : '旧版'}
              </span>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-1">作成者</h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              {doc.author}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-1">更新日</h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              {formatDateTime(doc.updateDate)}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-1">ファイルサイズ</h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              {formatFileSize(doc.size)}
            </div>
          </div>
          
          {doc.tags.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">タグ</h4>
              <div className="flex flex-wrap gap-1">
                {doc.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleDownload(doc)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              ダウンロード
            </button>
            <button
              onClick={() => handleDelete(doc.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              削除
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
          <h1 className="text-lg font-bold text-gray-900">ドキュメント管理</h1>
        </div>
      </div>

      {/* 現在のプロジェクト情報 */}
      {currentProject && (
        <div className="p-4">
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-blue-900 mb-2">現在のプロジェクト</h3>
            <p className="text-blue-800">{currentProject.name}</p>
            <p className="text-sm text-blue-600 mt-1">プロジェクトのドキュメントを管理できます</p>
          </div>
        </div>
      )}

      {/* 検索・フィルター */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="ドキュメントを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedType === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全て
          </button>
          <button
            onClick={() => setSelectedType('requirements-definition')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedType === 'requirements-definition' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            要件定義
          </button>
          <button
            onClick={() => setSelectedType('basic-design')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedType === 'basic-design' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            基本設計
          </button>
          <button
            onClick={() => setSelectedType('external-design')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedType === 'external-design' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            外部設計
          </button>
          <button
            onClick={() => setSelectedType('development-prep')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedType === 'development-prep' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            開発準備
          </button>
        </div>
      </div>

      {/* アップロードボタン */}
      <div className="px-4 mb-4">
        <button
          onClick={() => setShowUpload(true)}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <Upload className="h-4 w-4" />
          ドキュメントをアップロード
        </button>
      </div>

      {/* ドキュメント一覧 */}
      <div className="p-4 space-y-4">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">該当するドキュメントが見つかりません</p>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 truncate">{doc.name}</h3>
                    {doc.isLatest && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        最新版
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                      {documentTypes[doc.type].label}
                    </span>
                    <span>•</span>
                    <span>{formatFileSize(doc.size)}</span>
                    <span>•</span>
                    <span>更新: {formatDateTime(doc.updateDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDocument(doc)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Eye className="h-4 w-4" />
                  詳細
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  ダウンロード
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* アップロードモーダル */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">ドキュメントをアップロード</h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ファイル名</label>
                <input
                  type="text"
                  value={newDoc.name}
                  onChange={(e) => setNewDoc(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ドキュメント名を入力"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">タイプ</label>
                <select
                  value={newDoc.type}
                  onChange={(e) => setNewDoc(prev => ({ ...prev, type: e.target.value as Document['type'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="requirements-definition">要件定義</option>
                  <option value="basic-design">基本設計</option>
                  <option value="external-design">外部設計</option>
                  <option value="development-prep">開発準備</option>
                  <option value="other">その他</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                <textarea
                  value={newDoc.description}
                  onChange={(e) => setNewDoc(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="ドキュメントの説明を入力"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                <textarea
                  value={newDoc.content}
                  onChange={(e) => setNewDoc(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={5}
                  placeholder="ドキュメントの内容を入力（Markdown形式）"
                />
              </div>
              
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={handleUpload}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  アップロード
                </button>
                <button
                  onClick={() => setShowUpload(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ドキュメント詳細モーダル */}
      {selectedDocument && renderDocumentDetail(selectedDocument)}

      {/* 通知 */}
      {notification && (
        <div className={`fixed bottom-4 left-4 right-4 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
            {notification.type === 'error' && <AlertCircle className="h-4 w-4" />}
            <span className="text-sm">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
} 