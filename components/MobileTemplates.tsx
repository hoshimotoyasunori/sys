import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Target,
  FileCheck,
  Palette,
  Code,
  Clock,
  User,
  Database,
  Layout,
  Settings,
  TestTube,
  GitBranch,
  FileCode,
  Monitor,
  Layers,
  Shield,
  BarChart3,
  Workflow,
  Users,
  MessageCircle,
  ClipboardList,
  TrendingUp
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';

interface MobileTemplatesProps {
  onBack: () => void;
}

interface Template {
  id: string;
  title: string;
  description: string;
  category: 'requirements-definition' | 'basic-design' | 'external-design' | 'development-prep' | 'common';
  type: 'document' | 'checklist' | 'template';
  icon: React.ComponentType<any>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

// デスクトップ版と同じテンプレートデータ
const templates: Template[] = [
  // 要件定義テンプレート
  {
    id: 'project-proposal-template',
    title: '企画書テンプレート',
    description: 'システム開発の目的、ターゲット、期待効果、ビジネスゴールを整理するための企画書テンプレート。',
    category: 'requirements-definition',
    type: 'document',
    icon: Target,
    difficulty: 'intermediate',
    content: `# システム開発企画書

## 1. プロジェクト概要
### 1.1 プロジェクト名
[プロジェクト名を記載]

### 1.2 開発期間
- 開始予定日: [YYYY/MM/DD]
- 完了予定日: [YYYY/MM/DD]
- 開発期間: [X]ヶ月

### 1.3 プロジェクト担当者
- プロジェクトマネージャー: [氏名]
- システムアーキテクト: [氏名]
- 開発リーダー: [氏名]

## 2. 背景・目的
### 2.1 現状の課題
[現在の業務や既存システムの課題を具体的に記載]
- 課題1: [詳細]
- 課題2: [詳細]
- 課題3: [詳細]

### 2.2 プロジェクトの目的
[このシステム開発によって解決したい課題と目標を記載]
1. [目的1]
2. [目的2]
3. [目的3]

### 2.3 期待される効果
[システム導入後に期待される効果を定量的・定性的に記載]
- 定量的効果:
  - 処理時間短縮: [XX]%削減
  - コスト削減: [XX]万円/年
  - 生産性向上: [XX]%向上
- 定性的効果:
  - [効果1]
  - [効果2]

## 3. 対象範囲・ターゲット
### 3.1 対象業務
[システム化する業務の範囲を明確に定義]

### 3.2 対象ユーザー
- 主要ユーザー: [部署名・役職]（約[XX]名）
- 副次ユーザー: [部署名・役職]（約[XX]名）

### 3.3 対象データ
[取り扱うデータの種類と規模]

## 4. システム要件概要
### 4.1 主要機能
[システムの主要機能を簡潔に列挙]
1. [機能1]: [概要]
2. [機能2]: [概要]
3. [機能3]: [概要]

### 4.2 非機能要件
- 性能要件: [応答時間、処理能力等]
- 可用性要件: [稼働率、保守時間等]
- セキュリティ要件: [認証、暗号化等]

## 5. 技術方針
### 5.1 システム構成
[システムアーキテクチャの概要]

### 5.2 開発技術
- フロントエンド: [技術スタック]
- バックエンド: [技術スタック]
- データベース: [DBMS名]
- インフラ: [クラウド/オンプレミス]

## 6. スケジュール・マイルストーン
### 6.1 フェーズ構成
| フェーズ | 期間 | 主要成果物 |
|---------|------|-----------|
| 要件定義 | [期間] | 要件定義書 |
| 基本設計 | [期間] | 基本設計書 |
| 詳細設計 | [期間] | 詳細設計書 |
| 開発・テスト | [期間] | システム |
| 本稼働 | [期間] | - |

### 6.2 主要マイルストーン
- [YYYY/MM/DD]: 要件定義完了
- [YYYY/MM/DD]: 基本設計完了
- [YYYY/MM/DD]: 開発完了
- [YYYY/MM/DD]: システムテスト完了
- [YYYY/MM/DD]: 本稼働開始

## 7. リスク・課題
### 7.1 想定リスク
| リスク | 影響度 | 発生確率 | 対策 |
|--------|--------|----------|------|
| [リスク1] | [高/中/低] | [高/中/低] | [対策内容] |
| [リスク2] | [高/中/低] | [高/中/低] | [対策内容] |

### 7.2 前提条件・制約事項
- [前提条件1]
- [制約事項1]

## 8. 体制・役割分担
### 8.1 プロジェクト体制図
[体制図を挿入]

### 8.2 役割分担
| 役割 | 担当者 | 責任範囲 |
|------|--------|----------|
| [役割1] | [氏名] | [責任内容] |
| [役割2] | [氏名] | [責任内容] |

## 9. 予算
### 9.1 開発費用
- 人件費: [XX]万円
- 外部委託費: [XX]万円
- ソフトウェアライセンス費: [XX]万円
- ハードウェア費: [XX]万円
- その他: [XX]万円
- **合計**: [XX]万円

### 9.2 運用費用（年間）
- 保守費: [XX]万円
- ライセンス費: [XX]万円
- インフラ費: [XX]万円
- **合計**: [XX]万円

## 10. 承認
| 承認者 | 役職 | 署名 | 日付 |
|--------|------|------|------|
| [氏名] | [役職] | | [YYYY/MM/DD] |
| [氏名] | [役職] | | [YYYY/MM/DD] |

---
作成日: [YYYY/MM/DD]
作成者: [氏名]
版数: 1.0`
  },
  {
    id: 'requirements-definition-template',
    title: '要件定義書テンプレート',
    description: '機能要件・非機能要件を体系的に整理し、開発の基盤となる要件定義書を作成するためのテンプレート。',
    category: 'requirements-definition',
    type: 'document',
    icon: FileCheck,
    difficulty: 'advanced',
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
[前提条件を記載]`
  },
  {
    id: 'basic-design-template',
    title: '基本設計書テンプレート',
    description: 'システムの基本設計を行うための設計書テンプレート',
    category: 'basic-design',
    type: 'document',
    icon: Layout,
    difficulty: 'intermediate',
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
[運用設計を記載]`
  },
  {
    id: 'external-design-template',
    title: '外部設計書テンプレート',
    description: 'システムの外部設計を行うための設計書テンプレート',
    category: 'external-design',
    type: 'document',
    icon: Palette,
    difficulty: 'intermediate',
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
[エラー設計を記載]`
  },
  {
    id: 'development-prep-template',
    title: '開発準備書テンプレート',
    description: '開発環境の準備と開発計画を立てるためのテンプレート',
    category: 'development-prep',
    type: 'document',
    icon: Code,
    difficulty: 'advanced',
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

## 3. コーディング規約
### 3.1 命名規則
[命名規則を記載]

### 3.2 コメント規約
[コメント規約を記載]

## 4. テスト計画
### 4.1 テスト方針
[テスト方針を記載]

### 4.2 テスト環境
[テスト環境を記載]

## 5. バージョン管理
### 5.1 Git運用ルール
[Git運用ルールを記載]

### 5.2 ブランチ戦略
[ブランチ戦略を記載]

## 6. デプロイメント
### 6.1 デプロイ手順
[デプロイ手順を記載]

### 6.2 環境管理
[環境管理を記載]`
  }
];

export function MobileTemplates({ onBack }: MobileTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [notification, setNotification] = useState<Notification | null>(null);

  // コンテキストからプロジェクト情報を取得
  const { currentProject } = useProject();

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownload = (template: Template) => {
    try {
      // プロジェクト名をテンプレートに挿入
      let content = template.content;
      if (currentProject) {
        content = content.replace(/\[プロジェクト名を記載\]/g, currentProject.name);
      }

      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.title}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification(`${template.title}をダウンロードしました`, 'success');
    } catch (error) {
      showNotification('ダウンロードに失敗しました', 'error');
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初級';
      case 'intermediate': return '中級';
      case 'advanced': return '上級';
      default: return difficulty;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'requirements-definition': return '要件定義';
      case 'basic-design': return '基本設計';
      case 'external-design': return '外部設計';
      case 'development-prep': return '開発準備';
      case 'common': return '共通';
      default: return category;
    }
  };

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
          <h1 className="text-lg font-bold text-gray-900">テンプレート</h1>
        </div>
      </div>

      {/* 現在のプロジェクト情報 */}
      {currentProject && (
        <div className="p-4">
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-blue-900 mb-2">現在のプロジェクト</h3>
            <p className="text-blue-800">{currentProject.name}</p>
            <p className="text-sm text-blue-600 mt-1">テンプレートはこのプロジェクト名で自動入力されます</p>
          </div>
        </div>
      )}

      {/* 検索・フィルター */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="テンプレートを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedCategory === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全て
          </button>
          <button
            onClick={() => setSelectedCategory('requirements-definition')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedCategory === 'requirements-definition' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            要件定義
          </button>
          <button
            onClick={() => setSelectedCategory('basic-design')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedCategory === 'basic-design' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            基本設計
          </button>
          <button
            onClick={() => setSelectedCategory('external-design')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedCategory === 'external-design' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            外部設計
          </button>
          <button
            onClick={() => setSelectedCategory('development-prep')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedCategory === 'development-prep' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            開発準備
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedDifficulty('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedDifficulty === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全ての難易度
          </button>
          <button
            onClick={() => setSelectedDifficulty('beginner')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedDifficulty === 'beginner' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            初級
          </button>
          <button
            onClick={() => setSelectedDifficulty('intermediate')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedDifficulty === 'intermediate' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            中級
          </button>
          <button
            onClick={() => setSelectedDifficulty('advanced')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedDifficulty === 'advanced' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            上級
          </button>
        </div>
      </div>

      {/* テンプレート一覧 */}
      <div className="p-4 space-y-4">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">該当するテンプレートが見つかりません</p>
          </div>
        ) : (
          filteredTemplates.map((template) => {
            const IconComponent = template.icon;
            return (
              <div key={template.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1">{template.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                        {getDifficultyLabel(template.difficulty)}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {getCategoryLabel(template.category)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDownload(template)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  ダウンロード
                </button>
              </div>
            );
          })
        )}
      </div>

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