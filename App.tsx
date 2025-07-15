import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { 
  LayoutDashboard, 
  FileText, 
  Palette, 
  Code, 
  Menu,
  Settings,
  HelpCircle,
  Bell,
  BookOpen,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Target,
  Calendar,
  CheckCircle,
  TrendingUp,
  Download,
  Files,
  ClipboardList,
  Search
} from 'lucide-react';
import { Header } from './components/Header';
import { PhaseOverview } from './components/PhaseOverview';
import { TaskManager } from './components/TaskManager';
import { DeliverableTracker } from './components/DeliverableTracker';
import { DocumentManager } from './components/DocumentManager';
import { BasicGuide } from './components/BasicGuide';
import { DeliverablesChecklist } from './components/DeliverablesChecklist';
import { Templates } from './components/Templates';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  content?: string;
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  objective: string;
  tasks: Task[];
  deliverables: Deliverable[];
  questions: string[];
  advice: string[];
}

const initialPhases: Phase[] = [
  {
    id: 'requirements-definition',
    title: '要件定義',
    description: '「何を作るのか」を明確にし、システムに求められる機能や非機能要件を具体化する',
    objective: 'プロジェクトの目的と目標を明確化し、システムが備えるべき機能と非機能要件を詳細に定義する',
    tasks: [
      {
        id: 'project-goals',
        title: 'プロジェクトの目的と目標の明確化',
        description: 'システム開発の目的、ターゲット、期待効果、ビジネスゴールを明確にする',
        completed: false,
        priority: 'high'
      },
      {
        id: 'current-analysis',
        title: '現状業務の分析と課題特定',
        description: '現在の業務プロセスを分析し、課題や改善点を特定する',
        completed: false,
        priority: 'high'
      },
      {
        id: 'user-interviews',
        title: 'ユーザーヒアリングと要求収集',
        description: 'ステークホルダーからのヒアリングを通じて要求を収集・整理する',
        completed: false,
        priority: 'high'
      },
      {
        id: 'functional-requirements',
        title: '機能要件の洗い出しと詳細化',
        description: 'システムが備えるべき機能を具体的に定義し、詳細化する',
        completed: false,
        priority: 'high'
      },
      {
        id: 'non-functional-requirements',
        title: '非機能要件の定義',
        description: '性能、セキュリティ、可用性、保守性などの非機能要件を定義する',
        completed: false,
        priority: 'medium'
      },
      {
        id: 'requirements-prioritization',
        title: '要件の優先順位付け',
        description: 'MoSCoW法などを用いて要件の優先順位を決定する',
        completed: false,
        priority: 'medium'
      }
    ],
    deliverables: [
      {
        id: 'project-proposal',
        title: '企画書',
        description: 'システム開発の目的、ターゲット、期待効果、ビジネスゴールなどをまとめた文書',
        status: 'not-started'
      },
      {
        id: 'requirements-definition-doc',
        title: '要件定義書',
        description: 'システムが備えるべき機能（機能要件）と非機能要件を詳細に記述した、すべての開発工程の基礎となる文書',
        status: 'not-started'
      },
      {
        id: 'business-flow-diagram',
        title: '業務フロー図（As-Is/To-Be）',
        description: '現状の業務とシステム導入後の業務の流れを図式化したもの',
        status: 'not-started'
      }
    ],
    questions: [
      '現在、要件定義のどのタスクに取り組んでいますか？',
      '要件定義書はどの程度まで進んでいますか？特にどの要件の定義に課題がありますか？',
      'このシステムで解決したい最も重要な課題は何ですか？'
    ],
    advice: [
      '要件ヒアリングでは「なぜそれが必要なのか」を深く掘り下げて真の要求を理解してください',
      '機能要件と非機能要件を明確に分類し、それぞれを具体的に記述してください',
      'MoSCoW法（Must/Should/Could/Won\'t）を活用して要件の優先順位を明確にしてください'
    ]
  },
  {
    id: 'basic-design',
    title: '基本設計',
    description: '要件定義で定義された内容を、システムとしてどう実現するかを具体化する',
    objective: 'システム全体構成設計とデータベース設計を完了し、基本設計書を作成する',
    tasks: [
      {
        id: 'system-architecture',
        title: 'システム全体構成設計',
        description: 'アーキテクチャ設計を行い、システムの基盤を設計する',
        completed: false,
        priority: 'high'
      },
      {
        id: 'database-design',
        title: 'データベース論理・物理設計',
        description: 'ER図の作成と正規化、インデックス設計を実施する',
        completed: false,
        priority: 'high'
      },
      {
        id: 'function-overview',
        title: '機能概要設計',
        description: '各機能の入力、処理、出力の概要を設計する',
        completed: false,
        priority: 'medium'
      },
      {
        id: 'external-interface',
        title: '外部インターフェース設計',
        description: '他システムとの連携仕様を設計する',
        completed: false,
        priority: 'medium'
      },
      {
        id: 'screen-transition',
        title: '画面遷移設計',
        description: '画面間の遷移フローを設計する',
        completed: false,
        priority: 'medium'
      },
      {
        id: 'non-functional',
        title: '非機能要件の詳細化',
        description: '性能、セキュリティ、可用性などの要件を詳細化する',
        completed: false,
        priority: 'high'
      }
    ],
    deliverables: [
      {
        id: 'basic-design-doc',
        title: '基本設計書（外部設計書）',
        description: 'システムの全体像を記述した文書（システム構成図、データベース設計書、画面遷移図、機能一覧、他システム連携概要、非機能要件詳細を含む）',
        status: 'not-started'
      },
      {
        id: 'test-plan-overview',
        title: 'テスト計画書（概要）',
        description: 'テストの全体方針、範囲、フェーズなどを記述',
        status: 'not-started'
      }
    ],
    questions: [
      '現在、基本設計のどのタスクに取り組んでいますか？',
      '基本設計書はどの程度まで進んでいますか？特にどのセクションに課題がありますか？',
      'システム全体構成はどのように考えていますか？'
    ],
    advice: [
      'データベース設計では正規化を適切に行い、パフォーマンスとの兼ね合いを考慮してください',
      '三層アーキテクチャ（プレゼンテーション層、ビジネスロジック層、データアクセス層）の採用を検討してください',
      '設計レビューを定期的に実施し、早期に問題を発見できる体制を整えてください'
    ]
  },
  {
    id: 'external-design',
    title: '外部設計',
    description: '基本設計の内容を、ユーザーにとって使いやすい形に落とし込む（主にUI/UX）',
    objective: 'ユーザーインターフェースとユーザーエクスペリエンスを設計し、画面設計書を完成させる',
    tasks: [
      {
        id: 'ui-design',
        title: 'ユーザーインターフェース設計',
        description: '画面レイアウト、操作フローを設計する',
        completed: false,
        priority: 'high'
      },
      {
        id: 'ux-design',
        title: 'ユーザーエクスペリエンス設計',
        description: 'ユーザー体験の最適化を図る',
        completed: false,
        priority: 'high'
      },
      {
        id: 'input-output-design',
        title: '入力・出力情報の詳細設計',
        description: 'データの入出力仕様を詳細に設計する',
        completed: false,
        priority: 'medium'
      },
      {
        id: 'error-handling',
        title: 'エラーハンドリングの検討',
        description: 'エラー処理とユーザーへの通知方法を設計する',
        completed: false,
        priority: 'medium'
      },
      {
        id: 'report-design',
        title: '帳票設計',
        description: '各種レポートの設計を行う',
        completed: false,
        priority: 'low'
      },
      {
        id: 'test-plan-detail',
        title: 'テスト計画の詳細作成',
        description: '単体テスト、結合テスト、総合テストの範囲を詳細化する',
        completed: false,
        priority: 'medium'
      }
    ],
    deliverables: [
      {
        id: 'screen-design-doc',
        title: '画面設計書',
        description: '各画面のレイアウト、要素、入力規則、メッセージを詳細に記述',
        status: 'not-started'
      },
      {
        id: 'prototype',
        title: '画面プロトタイプ/ワイヤーフレーム',
        description: '実際の画面に近い視覚的表現',
        status: 'not-started'
      },
      {
        id: 'input-output-spec',
        title: '入出力設計書',
        description: '入力データ、出力データの形式、内容を詳細に記述',
        status: 'not-started'
      },
      {
        id: 'report-spec',
        title: '帳票設計書',
        description: '各種帳票のデザインとレイアウトを記述',
        status: 'not-started'
      },
      {
        id: 'ui-spec',
        title: 'ユーザーインターフェース仕様書',
        description: 'UIの具体的な振る舞いを定義',
        status: 'not-started'
      }
    ],
    questions: [
      '外部設計で特に注力したい点は何ですか？',
      '画面設計書はどこまで作成できましたか？特にユーザーフローで懸念点はありますか？',
      'ユーザーがシステムをどのように操作することを想定していますか？'
    ],
    advice: [
      'ユーザビリティテストを早期に実施し、ユーザーの声を設計に反映してください',
      'アクセシビリティガイドライン（WCAG）を参考に、誰でも使いやすい設計を心がけてください',
      'ワイヤーフレーム作成にはFigma、Adobe XD、Sketchなどのツールを活用してください'
    ]
  },
  {
    id: 'development-prep',
    title: '開発準備',
    description: '開発をスムーズに開始するための最終準備',
    objective: '開発環境の構築とコーディング規約の策定を完了し、開発開始準備を整える',
    tasks: [
      {
        id: 'dev-environment',
        title: '開発環境の構築',
        description: '開発に必要な環境をセットアップする',
        completed: false,
        priority: 'high'
      },
      {
        id: 'tech-stack',
        title: '開発技術の最終決定',
        description: '開発言語、フレームワーク、ライブラリの最終決定とセットアップ',
        completed: false,
        priority: 'high'
      },
      {
        id: 'version-control',
        title: 'バージョン管理システムの導入',
        description: 'Git等のバージョン管理システム導入とルール策定',
        completed: false,
        priority: 'high'
      },
      {
        id: 'coding-standards',
        title: 'コーディング規約の策定',
        description: '開発チーム内のコーディング規約を策定する',
        completed: false,
        priority: 'medium'
      },
      {
        id: 'schedule-detail',
        title: '開発スケジュールの詳細化',
        description: 'より詳細な開発スケジュールを作成する',
        completed: false,
        priority: 'medium'
      },
      {
        id: 'project-management',
        title: '課題管理・進捗管理ツールの準備',
        description: 'プロジェクト管理ツールのセットアップ',
        completed: false,
        priority: 'medium'
      }
    ],
    deliverables: [
      {
        id: 'dev-setup-guide',
        title: '開発環境構築手順書',
        description: '開発環境のセットアップ方法を記述',
        status: 'not-started'
      },
      {
        id: 'coding-guidelines',
        title: 'コーディング規約',
        description: '開発チーム内で統一されたコード記述ルール',
        status: 'not-started'
      },
      {
        id: 'detailed-schedule',
        title: '開発スケジュール詳細',
        description: '各タスクの期間、担当、依存関係などを具体化したスケジュール',
        status: 'not-started'
      }
    ],
    questions: [
      '開発環境の構築で何か困っていることはありますか？',
      'コーディング規約の策定は順調に進んでいますか？特に含めておきたいルールはありますか？',
      '開発スケジュールの策定で考慮すべき点は何だと思いますか？'
    ],
    advice: [
      'CI/CD（継続的インテグレーション/継続的デリバリー）の導入を検討してください',
      'ESLintやPrettierなどのツールを活用してコード品質を維持してください',
      'アジャイル開発手法の採用により、変化に柔軟に対応できる体制を整えてください'
    ]
  }
];

const phaseIcons = {
  'requirements-definition': Search,
  'basic-design': FileText,
  'external-design': Palette,
  'development-prep': Code
};

export default function App() {
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  const [activePhase, setActivePhase] = useState('requirements-definition');
  const [currentView, setCurrentView] = useState<'phases' | 'guide' | 'checklist' | 'templates'>('phases');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  const updateTaskCompletion = (phaseId: string, taskId: string, completed: boolean) => {
    setPhases(prev => prev.map(phase => 
      phase.id === phaseId 
        ? {
            ...phase,
            tasks: phase.tasks.map(task => 
              task.id === taskId ? { ...task, completed } : task
            )
          }
        : phase
    ));
  };

  const updateDeliverableStatus = (phaseId: string, deliverableId: string, status: Deliverable['status']) => {
    setPhases(prev => prev.map(phase => 
      phase.id === phaseId 
        ? {
            ...phase,
            deliverables: phase.deliverables.map(deliverable => 
              deliverable.id === deliverableId ? { ...deliverable, status } : deliverable
            )
          }
        : phase
    ));
  };

  const currentPhase = phases.find(phase => phase.id === activePhase);
  const totalTasks = phases.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const completedTasks = phases.reduce((acc, phase) => 
    acc + phase.tasks.filter(task => task.completed).length, 0
  );
  const totalDeliverables = phases.reduce((acc, phase) => acc + phase.deliverables.length, 0);
  const completedDeliverables = phases.reduce((acc, phase) => 
    acc + phase.deliverables.filter(deliverable => deliverable.status === 'completed').length, 0
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー - 画面幅いっぱい */}
      <Header
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        totalDeliverables={totalDeliverables}
        completedDeliverables={completedDeliverables}
      />

      {/* メイン部分 - 左サイドバー + コンテンツ + 右サイドバー */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左サイドバー */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col relative shadow-sm`}>
          {/* 左サイドバー開閉ボタン */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 z-10"
          >
            {sidebarOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
          
          <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
            {/* ガイド・チェックリスト・テンプレート */}
            <div>
              {sidebarOpen && <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-3">ツール</h3>}
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentView('guide')}
                  className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} gap-3 px-3 py-3 text-left rounded-2xl transition-all duration-200 ${
                    currentView === 'guide' 
                      ? 'bg-blue-100 text-blue-700 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={!sidebarOpen ? '基本手順' : ''}
                >
                  <BookOpen className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">基本手順</span>}
                </button>

                <button
                  onClick={() => setCurrentView('checklist')}
                  className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} gap-3 px-3 py-3 text-left rounded-2xl transition-all duration-200 ${
                    currentView === 'checklist' 
                      ? 'bg-blue-100 text-blue-700 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={!sidebarOpen ? '成果物チェック' : ''}
                >
                  <CheckSquare className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">成果物チェック</span>}
                </button>

                <button
                  onClick={() => setCurrentView('templates')}
                  className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} gap-3 px-3 py-3 text-left rounded-2xl transition-all duration-200 ${
                    currentView === 'templates' 
                      ? 'bg-blue-100 text-blue-700 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={!sidebarOpen ? 'テンプレート' : ''}
                >
                  <Files className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">テンプレート</span>}
                </button>
              </div>
            </div>

            {/* フェーズ */}
            <div>
              {sidebarOpen && <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-3">フェーズ</h3>}
              <div className="space-y-2">
                {phases.map(phase => {
                  const IconComponent = phaseIcons[phase.id as keyof typeof phaseIcons];
                  const phaseProgress = (phase.tasks.filter(task => task.completed).length / phase.tasks.length) * 100;
                  const isActive = currentView === 'phases' && activePhase === phase.id;
                  
                  return (
                    <button
                      key={phase.id}
                      onClick={() => {
                        setCurrentView('phases');
                        setActivePhase(phase.id);
                      }}
                      className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} gap-3 px-3 py-3 text-left rounded-2xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-blue-100 text-blue-700 shadow-sm' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      title={!sidebarOpen ? phase.title : ''}
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <div className="flex-1 min-w-0">
                          <span className="block text-sm font-medium truncate">{phase.title}</span>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                                style={{ width: `${phaseProgress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">{Math.round(phaseProgress)}%</span>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
          
          {sidebarOpen && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <HelpCircle className="h-4 w-4" />
                <span>サポートが必要ですか？</span>
              </div>
            </div>
          )}
        </div>

        {/* メインコンテンツエリア */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {currentView === 'guide' ? (
              <BasicGuide />
            ) : currentView === 'checklist' ? (
              <DeliverablesChecklist phases={phases} />
            ) : currentView === 'templates' ? (
              <Templates />
            ) : (
              currentPhase && (
                <div className="space-y-6">
                  <PhaseOverview phase={currentPhase} />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TaskManager
                      phase={currentPhase}
                      onTaskUpdate={(taskId, completed) => 
                        updateTaskCompletion(currentPhase.id, taskId, completed)
                      }
                    />
                    
                    <DeliverableTracker
                      phase={currentPhase}
                      onStatusUpdate={(deliverableId, status) => 
                        updateDeliverableStatus(currentPhase.id, deliverableId, status)
                      }
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* 右サイドバー - ドキュメント管理 */}
        <div className={`${rightSidebarOpen ? 'w-96' : 'w-16'} bg-white border-l border-gray-200 transition-all duration-300 flex flex-col relative shadow-sm`}>
          {/* 右サイドバー開閉ボタン */}
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="absolute -left-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 z-10"
          >
            {rightSidebarOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>

          {rightSidebarOpen ? (
            <DocumentManager phaseId={currentPhase?.id || 'requirements-definition'} />
          ) : (
            <div className="flex flex-col items-center py-6">
              <div className="p-3 bg-gray-100 rounded-lg">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}