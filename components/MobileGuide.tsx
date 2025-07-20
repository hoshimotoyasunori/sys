import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface MobileGuideProps {
  onBack: () => void;
}

interface GuideSection {
  id: string;
  title: string;
  description: string;
  steps: GuideStep[];
}

interface GuideStep {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  content: string;
  tips: string[];
  checklist: string[];
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

const guideData: GuideSection[] = [
  {
    id: 'requirements',
    title: '要件定義フェーズ',
    description: 'システムの要件を明確にし、プロジェクトの方向性を決定する重要なフェーズです。',
    steps: [
      {
        id: 'req-1',
        title: 'プロジェクト概要の整理',
        description: 'プロジェクトの目的、背景、範囲を明確にする',
        difficulty: 'beginner',
        estimatedTime: '2-3日',
        content: `## プロジェクト概要の整理

### 1. プロジェクトの目的
- なぜこのシステムが必要なのか
- どのような問題を解決するのか
- どのような価値を提供するのか

### 2. プロジェクトの背景
- 現状の課題
- システム化の必要性
- ビジネスドライバー

### 3. プロジェクトの範囲
- 対象業務の範囲
- 対象ユーザーの範囲
- システムの境界

### 4. ステークホルダーの特定
- プロジェクトスポンサー
- エンドユーザー
- システム管理者
- 外部システム担当者`,
        tips: [
          'ステークホルダー全員の合意を得ることが重要',
          '曖昧な表現は避け、具体的に記載する',
          '範囲外の項目も明示的に記載する'
        ],
        checklist: [
          'プロジェクトの目的が明確',
          '背景と必要性が理解できる',
          '範囲が具体的に定義されている',
          'ステークホルダーが特定されている'
        ]
      },
      {
        id: 'req-2',
        title: '機能要件の定義',
        description: 'システムが提供する機能を詳細に定義する',
        difficulty: 'intermediate',
        estimatedTime: '1-2週間',
        content: `## 機能要件の定義

### 1. 機能一覧の作成
- 主要機能の洗い出し
- 機能の階層化
- 機能間の関係性

### 2. 機能詳細の定義
- 入力データ
- 処理内容
- 出力データ
- エラー処理

### 3. ユースケースの作成
- アクターの特定
- シナリオの作成
- 例外処理の考慮

### 4. 画面・帳票の要件
- 画面レイアウト
- 入力項目
- 表示項目
- 操作フロー`,
        tips: [
          'ユーザーの視点で機能を考える',
          'エラーケースも含めて考える',
          '非機能要件との整合性を確認する'
        ],
        checklist: [
          '機能一覧が網羅的',
          '各機能の詳細が明確',
          'ユースケースが作成されている',
          '画面・帳票の要件が定義されている'
        ]
      }
    ]
  },
  {
    id: 'basic-design',
    title: '基本設計フェーズ',
    description: 'システムの全体構造を設計し、実装方針を決定するフェーズです。',
    steps: [
      {
        id: 'basic-1',
        title: 'システムアーキテクチャの設計',
        description: 'システム全体の構造と構成要素を設計する',
        difficulty: 'intermediate',
        estimatedTime: '1週間',
        content: `## システムアーキテクチャの設計

### 1. システム構成図の作成
- システム全体の構成
- サブシステムの分割
- システム間の関係

### 2. 技術スタックの選定
- 開発言語
- フレームワーク
- データベース
- ミドルウェア

### 3. セキュリティアーキテクチャ
- 認証・認可
- 暗号化
- アクセス制御

### 4. パフォーマンス要件の検討
- レスポンス時間
- スループット
- 同時接続数`,
        tips: [
          '将来の拡張性を考慮する',
          '運用・保守性を重視する',
          'セキュリティは最初から考慮する'
        ],
        checklist: [
          'システム構成図が作成されている',
          '技術スタックが選定されている',
          'セキュリティ要件が定義されている',
          'パフォーマンス要件が明確'
        ]
      }
    ]
  },
  {
    id: 'external-design',
    title: '外部設計フェーズ',
    description: 'ユーザーインターフェースと外部システムとの連携を設計するフェーズです。',
    steps: [
      {
        id: 'ext-1',
        title: '画面設計',
        description: 'ユーザーが操作する画面の詳細を設計する',
        difficulty: 'intermediate',
        estimatedTime: '1-2週間',
        content: `## 画面設計

### 1. 画面一覧の作成
- 全画面の洗い出し
- 画面間の遷移関係
- 画面の階層構造

### 2. 画面レイアウトの設計
- ヘッダー・フッター
- メニュー構成
- コンテンツエリア

### 3. 入力項目の設計
- 入力項目の定義
- 入力値の検証ルール
- エラーメッセージ

### 4. 表示項目の設計
- 表示データの定義
- 表示形式の指定
- 更新タイミング`,
        tips: [
          'ユーザビリティを重視する',
          '一貫性のあるデザインにする',
          'アクセシビリティを考慮する'
        ],
        checklist: [
          '画面一覧が作成されている',
          '各画面のレイアウトが設計されている',
          '入力・表示項目が定義されている',
          '画面遷移が明確'
        ]
      }
    ]
  }
];

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

export function MobileGuide({ onBack }: MobileGuideProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const selectedStepData = selectedStep 
    ? guideData
        .flatMap(section => section.steps)
        .find(step => step.id === selectedStep)
    : null;

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
        <h2 className="text-xl font-bold">基本ガイド</h2>
      </div>

      {/* ガイド説明 */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-bold text-blue-900 mb-2">システム設計の基本手順</h3>
        <p className="text-blue-800 text-sm">
          システム設計は段階的に進めることで、効率的かつ確実にシステムを構築できます。
          各フェーズの手順を確認し、プロジェクトの進行に活用してください。
        </p>
      </div>

      {/* ガイドセクション */}
      <div className="space-y-4">
        {guideData.map(section => (
          <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{section.description}</p>
              </div>
              {expandedSections.includes(section.id) ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.includes(section.id) && (
              <div className="border-t border-gray-200 p-4 space-y-3">
                {section.steps.map(step => (
                  <div key={step.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      </div>
                      <button
                        onClick={() => setSelectedStep(step.id)}
                        className="ml-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        詳細
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${difficultyColors[step.difficulty]}`}>
                        {difficultyLabels[step.difficulty]}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{step.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ステップ詳細モーダル */}
      {selectedStepData && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedStepData.title}</h2>
                <button
                  onClick={() => setSelectedStep(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${difficultyColors[selectedStepData.difficulty]}`}>
                  {difficultyLabels[selectedStepData.difficulty]}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{selectedStepData.estimatedTime}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm">{selectedStepData.description}</p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedStepData.content.replace(/\n/g, '<br>') }} />
              </div>
              
              {/* ヒント */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">💡 ヒント</h4>
                <ul className="space-y-2">
                  {selectedStepData.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* チェックリスト */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">✅ チェックリスト</h4>
                <ul className="space-y-2">
                  {selectedStepData.checklist.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
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