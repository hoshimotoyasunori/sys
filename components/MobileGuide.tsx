import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Lightbulb,
  AlertTriangle,
  Layers,
  MessageCircle,
  RefreshCw,
  Shield
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';

interface MobileGuideProps {
  onBack: () => void;
}

interface Phase {
  id: number;
  title: string;
  description: string;
  duration: string;
  keyActivities: string[];
  deliverables: string[];
  tips: string[];
}

interface GeneralPrinciple {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface CommonPitfall {
  title: string;
  description: string;
  solution: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

// デスクトップ版と同じガイドデータ
const phases: Phase[] = [
  {
    id: 1,
    title: '要件定義',
    description: '「何を作るのか」を明確にし、システムに求められる機能や非機能要件を具体化する',
    duration: '2-6週間',
    keyActivities: [
      'プロジェクトの目的と目標の明確化',
      '現状業務の分析と課題特定',
      'ユーザーヒアリングと要求収集',
      '機能要件の洗い出しと詳細化',
      '非機能要件の定義',
      '要件の優先順位付け'
    ],
    deliverables: [
      '企画書',
      '要件定義書',
      '業務フロー図（As-Is/To-Be）',
      'ユーザーストーリー',
      '機能一覧'
    ],
    tips: [
      '要件ヒアリングでは「なぜ」を深く掘り下げる',
      'MoSCoW法で要件の優先順位を明確化',
      'ステークホルダー全員の合意を文書で確認'
    ]
  },
  {
    id: 2,
    title: '基本設計',
    description: '要件定義で定義された内容を、システムとしてどう実現するかを具体化する',
    duration: '2-4週間',
    keyActivities: [
      'システム全体構成設計',
      'データベース論理・物理設計',
      '機能概要設計',
      '外部インターフェース設計',
      '非機能要件の詳細化'
    ],
    deliverables: [
      '基本設計書',
      'システム構成図',
      'データベース設計書',
      'テスト計画書（概要）'
    ],
    tips: [
      'ステークホルダーとの定期的なレビューを実施',
      'アーキテクチャの選択理由を文書化',
      'パフォーマンス要件を数値で明確化'
    ]
  },
  {
    id: 3,
    title: '外部設計',
    description: '基本設計の内容を、ユーザーにとって使いやすい形に落とし込む',
    duration: '3-5週間',
    keyActivities: [
      'ユーザーインターフェース設計',
      'ユーザーエクスペリエンス設計',
      '入力・出力情報の詳細設計',
      'エラーハンドリングの検討',
      '帳票設計'
    ],
    deliverables: [
      '画面設計書',
      'ワイヤーフレーム・プロトタイプ',
      '入出力設計書',
      'UI/UX仕様書'
    ],
    tips: [
      'ユーザビリティテストを早期実施',
      'アクセシビリティを考慮した設計',
      'レスポンシブデザインの検討'
    ]
  },
  {
    id: 4,
    title: '開発準備',
    description: '開発をスムーズに開始するための最終準備',
    duration: '1-2週間',
    keyActivities: [
      '開発環境の構築',
      '開発技術の最終決定',
      'バージョン管理システムの導入',
      'コーディング規約の策定',
      'プロジェクト管理ツールの準備'
    ],
    deliverables: [
      '開発環境構築手順書',
      'コーディング規約',
      '開発スケジュール詳細',
      'チーム開発ガイドライン'
    ],
    tips: [
      'CI/CDパイプラインの早期構築',
      'コードレビュープロセスの確立',
      'チーム内のコミュニケーションルール策定'
    ]
  }
];

const generalPrinciples: GeneralPrinciple[] = [
  {
    title: '段階的な開発アプローチ',
    description: '各フェーズを順序立てて進め、前の段階の成果物を確実に固めてから次へ進む',
    icon: Layers
  },
  {
    title: 'ステークホルダー中心の開発',
    description: '関係者全員を巻き込み、合意形成を重視しながらプロジェクトを進める',
    icon: Users
  },
  {
    title: '継続的な改善とレビュー',
    description: '定期的な振り返りと改善を通じて、品質向上とリスク軽減を図る',
    icon: RefreshCw
  },
  {
    title: '透明性のある情報共有',
    description: '進捗状況、課題、決定事項を関係者全員に適切に共有する',
    icon: MessageCircle
  },
  {
    title: '品質重視の開発',
    description: 'テストやレビューを通じて品質を確保し、保守性の高いシステムを構築する',
    icon: Shield
  },
  {
    title: '包括的なドキュメント化',
    description: '開発プロセスと成果物を適切に文書化し、ナレッジを蓄積する',
    icon: FileText
  }
];

const commonPitfalls: CommonPitfall[] = [
  {
    title: '要件の曖昧さ',
    description: '要件が曖昧なまま設計を進めると、後で大幅な修正が必要になる',
    solution: '具体的で測定可能な要件を定義し、不明点は必ず確認する'
  },
  {
    title: 'ステークホルダーとの認識齟齬',
    description: '関係者間で認識が異なると、プロジェクトが迷走する',
    solution: '定期的なミーティングと文書による確認を徹底する'
  },
  {
    title: '技術選定の遅れ',
    description: '技術選定が遅れると、設計や開発に影響する',
    solution: '早期に技術調査を行い、PoC（概念実証）で検証する'
  },
  {
    title: 'ドキュメントの不備',
    description: '不十分なドキュメントは、後の開発や保守で問題となる',
    solution: 'テンプレートを活用し、レビューを通じて品質を確保する'
  }
];

export function MobileGuide({ onBack }: MobileGuideProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<Notification | null>(null);

  // コンテキストからプロジェクト情報を取得
  const { currentProject } = useProject();

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const isExpanded = (sectionId: string) => expandedSections.has(sectionId);

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
          <h1 className="text-lg font-bold text-gray-900">基本ガイド</h1>
        </div>
      </div>

      {/* 現在のプロジェクト情報 */}
      {currentProject && (
        <div className="p-4">
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-blue-900 mb-2">現在のプロジェクト</h3>
            <p className="text-blue-800">{currentProject.name}</p>
            <p className="text-sm text-blue-600 mt-1">このガイドを参考にプロジェクトを進めてください</p>
          </div>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* システム開発の基本原則 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            システム開発の基本原則
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            成功するシステム開発プロジェクトのための基本的な考え方と原則
          </p>
          
          <div className="space-y-3">
            {generalPrinciples.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                <div key={index} className="p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-start gap-3">
                    <IconComponent className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">{principle.title}</h4>
                      <p className="text-xs text-gray-600">{principle.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 開発フェーズ */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">開発フェーズ</h2>
          
          <div className="space-y-3">
            {phases.map((phase) => (
              <div key={phase.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(`phase-${phase.id}`)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {phase.id}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{phase.title}</h3>
                        <p className="text-sm text-gray-600">{phase.description}</p>
                      </div>
                    </div>
                    {isExpanded(`phase-${phase.id}`) ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {isExpanded(`phase-${phase.id}`) && (
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>期間: {phase.duration}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        主要活動
                      </h4>
                      <ul className="space-y-1">
                        {phase.keyActivities.map((activity, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        成果物
                      </h4>
                      <ul className="space-y-1">
                        {phase.deliverables.map((deliverable, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        ポイント
                      </h4>
                      <ul className="space-y-1">
                        {phase.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* よくある失敗と対策 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            よくある失敗と対策
          </h2>
          
          <div className="space-y-3">
            {commonPitfalls.map((pitfall, index) => (
              <div key={index} className="p-3 border border-red-100 rounded-lg bg-red-50">
                <h4 className="font-medium text-red-900 mb-2">{pitfall.title}</h4>
                <p className="text-sm text-red-700 mb-2">{pitfall.description}</p>
                <div className="bg-white p-2 rounded border border-red-200">
                  <p className="text-xs text-red-800">
                    <strong>対策:</strong> {pitfall.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
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