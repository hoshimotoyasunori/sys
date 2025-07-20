import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface MobileTemplatesProps {
  onBack: () => void;
}

interface Template {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  content: string;
  tags: string[];
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

const templates: Template[] = [
  {
    id: 'requirements-definition',
    name: '要件定義書テンプレート',
    category: '要件定義',
    difficulty: 'beginner',
    description: 'システム要件を整理するための要件定義書テンプレート',
    content: `# 要件定義書

## 1. プロジェクト概要
### 1.1 プロジェクト名
[プロジェクト名を記載]

### 1.2 プロジェクトの目的
[プロジェクトの目的を記載]

### 1.3 プロジェクトの背景
[プロジェクトの背景を記載]

## 2. システム概要
### 2.1 システムの目的
[システムの目的を記載]

### 2.2 システムの範囲
[システムの範囲を記載]

### 2.3 システムの概要
[システムの概要を記載]

## 3. 機能要件
### 3.1 機能一覧
[機能一覧を記載]

### 3.2 機能詳細
[各機能の詳細を記載]

## 4. 非機能要件
### 4.1 性能要件
[性能要件を記載]

### 4.2 可用性要件
[可用性要件を記載]

### 4.3 セキュリティ要件
[セキュリティ要件を記載]

## 5. 制約事項
[制約事項を記載]

## 6. 前提条件
[前提条件を記載]`,
    tags: ['要件定義', 'システム設計', 'プロジェクト管理']
  },
  {
    id: 'basic-design',
    name: '基本設計書テンプレート',
    category: '基本設計',
    difficulty: 'intermediate',
    description: 'システムの基本設計を行うための設計書テンプレート',
    content: `# 基本設計書

## 1. システム概要
### 1.1 システム構成
[システム構成を記載]

### 1.2 システムアーキテクチャ
[システムアーキテクチャを記載]

## 2. データ設計
### 2.1 ER図
[ER図を記載]

### 2.2 データ辞書
[データ辞書を記載]

## 3. 機能設計
### 3.1 機能構成図
[機能構成図を記載]

### 3.2 画面遷移図
[画面遷移図を記載]

### 3.3 処理フロー
[処理フローを記載]

## 4. 外部設計
### 4.1 画面設計
[画面設計を記載]

### 4.2 帳票設計
[帳票設計を記載]

### 4.3 インターフェース設計
[インターフェース設計を記載]

## 5. セキュリティ設計
[セキュリティ設計を記載]

## 6. 運用設計
[運用設計を記載]`,
    tags: ['基本設計', 'システム設計', 'アーキテクチャ']
  },
  {
    id: 'external-design',
    name: '外部設計書テンプレート',
    category: '外部設計',
    difficulty: 'intermediate',
    description: 'システムの外部設計を行うための設計書テンプレート',
    content: `# 外部設計書

## 1. 画面設計
### 1.1 画面一覧
[画面一覧を記載]

### 1.2 画面詳細
[各画面の詳細を記載]

### 1.3 画面遷移
[画面遷移を記載]

## 2. 帳票設計
### 2.1 帳票一覧
[帳票一覧を記載]

### 2.2 帳票詳細
[各帳票の詳細を記載]

## 3. インターフェース設計
### 3.1 外部システム連携
[外部システム連携を記載]

### 3.2 API設計
[API設計を記載]

## 4. データ設計
### 4.1 データベース設計
[データベース設計を記載]

### 4.2 ファイル設計
[ファイル設計を記載]

## 5. セキュリティ設計
[セキュリティ設計を記載]

## 6. エラー設計
[エラー設計を記載]`,
    tags: ['外部設計', '画面設計', 'インターフェース']
  },
  {
    id: 'development-prep',
    name: '開発準備書テンプレート',
    category: '開発準備',
    difficulty: 'advanced',
    description: '開発環境の準備と開発計画を立てるためのテンプレート',
    content: `# 開発準備書

## 1. 開発環境
### 1.1 開発ツール
[開発ツールを記載]

### 1.2 開発環境の構築手順
[開発環境の構築手順を記載]

## 2. 開発計画
### 2.1 開発スケジュール
[開発スケジュールを記載]

### 2.2 マイルストーン
[マイルストーンを記載]

## 3. 品質管理
### 3.1 コーディング規約
[コーディング規約を記載]

### 3.2 テスト計画
[テスト計画を記載]

## 4. リスク管理
[リスク管理を記載]

## 5. コミュニケーション計画
[コミュニケーション計画を記載]

## 6. 成果物管理
[成果物管理を記載]`,
    tags: ['開発準備', 'プロジェクト管理', '品質管理']
  }
];

const categories = ['全て', '要件定義', '基本設計', '外部設計', '開発準備'];
const difficulties = ['全て', 'beginner', 'intermediate', 'advanced'];

const difficultyLabels = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級'
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

export function MobileTemplates({ onBack }: MobileTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全て');
  const [selectedDifficulty, setSelectedDifficulty] = useState('全て');
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  const handleDownload = (template: Template) => {
    try {
      const blob = new Blob([template.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification(`${template.name}をダウンロードしました`, 'success');
    } catch (error) {
      showNotification('ダウンロードに失敗しました', 'error');
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === '全て' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === '全て' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
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
        <h2 className="text-xl font-bold">テンプレート</h2>
      </div>

      {/* 検索・フィルター */}
      <div className="space-y-4">
        {/* 検索 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="テンプレートを検索..."
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
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty === '全て' ? '難易度' : difficultyLabels[difficulty as keyof typeof difficultyLabels]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* テンプレート一覧 */}
      <div className="space-y-4">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">テンプレートが見つかりません</h3>
            <p className="text-gray-500">検索条件を変更してください</p>
          </div>
        ) : (
          filteredTemplates.map(template => (
            <div key={template.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {template.category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${difficultyColors[template.difficulty]}`}>
                      {difficultyLabels[template.difficulty]}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => handleDownload(template)}
                  className="ml-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
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
    </div>
  );
} 