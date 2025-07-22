import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
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
import { Header } from './Header';
import { PhaseOverview } from './PhaseOverview';
import { TaskManager } from './TaskManager';
import { DeliverableTracker } from './DeliverableTracker';
import { DocumentManager } from './DocumentManager';
import { BasicGuide } from './BasicGuide';
import { DeliverablesChecklist } from './DeliverablesChecklist';
import { Templates } from './Templates';
import { useIsMobile } from './ui/use-mobile';
import MobileApp from './MobileApp';
import { useProject } from '../contexts/ProjectContext';
import { useProjectData } from '../contexts/ProjectDataContext';
import { ResizableSidebar, ResizableContainer } from './ui/resizable';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  content?: string;
}

export interface Phase {
  id: string;
  name: string; // データベースのnameフィールド
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
    name: '要件定義',
    description: '「何を作るのか」を明確にし、システムに求められる機能や非機能要件を具体化する',
    objective: 'プロジェクトの目的と目標を明確化し、システムが備えるべき機能と非機能要件を詳細に定義する',
    tasks: [
      {
        id: 'project-goals',
        title: 'プロジェクトの目的と目標の明確化',
        description: 'システム開発の目的、ターゲット、期待効果、ビジネスゴールを明確にする',
        status: 'todo',
        priority: 'high'
      },
      {
        id: 'current-analysis',
        title: '現状業務の分析と課題特定',
        description: '現在の業務プロセスを分析し、課題や改善点を特定する',
        status: 'todo',
        priority: 'high'
      },
      {
        id: 'user-interviews',
        title: 'ユーザーヒアリングと要求収集',
        description: 'ステークホルダーからのヒアリングを通じて要求を収集・整理する',
        status: 'todo',
        priority: 'high'
      },
      {
        id: 'functional-requirements',
        title: '機能要件の洗い出しと詳細化',
        description: 'システムが備えるべき機能を具体的に定義し、詳細化する',
        status: 'todo',
        priority: 'high'
      },
      {
        id: 'non-functional-requirements',
        title: '非機能要件の定義',
        description: '性能、セキュリティ、可用性、保守性などの非機能要件を定義する',
        status: 'todo',
        priority: 'medium'
      },
      {
        id: 'requirements-prioritization',
        title: '要件の優先順位付け',
        description: 'MoSCoW法などを用いて要件の優先順位を決定する',
        status: 'todo',
        priority: 'medium'
      }
    ],
    deliverables: [
      {
        id: 'project-proposal',
        title: '企画書',
        description: 'システム開発の目的、ターゲット、期待効果、ビジネスゴールなどをまとめた文書',
        status: 'pending'
      },
      {
        id: 'requirements-definition-doc',
        title: '要件定義書',
        description: 'システムが備えるべき機能（機能要件）と非機能要件を詳細に記述した、すべての開発工程の基礎となる文書',
        status: 'pending'
      },
      {
        id: 'business-flow-diagram',
        title: '業務フロー図（As-Is/To-Be）',
        description: '現状の業務とシステム導入後の業務の流れを図式化したもの',
        status: 'pending'
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
    name: '基本設計',
    description: '要件定義で定義された内容を、システムとしてどう実現するかを具体化する',
    objective: 'システム全体構成設計とデータベース設計を完了し、基本設計書を作成する',
    tasks: [
      {
        id: 'system-architecture',
        title: 'システム全体構成設計',
        description: 'アーキテクチャ設計を行い、システムの基盤を設計する',
        status: 'todo',
        priority: 'high'
      },
      {
        id: 'database-design',
        title: 'データベース論理・物理設計',
        description: 'ER図の作成と正規化、インデックス設計を実施する',
        status: 'todo',
        priority: 'high'
      },
      {
        id: 'function-overview',
        title: '機能概要設計',
        description: '各機能の入力、処理、出力の概要を設計する',
        status: 'todo',
        priority: 'medium'
      },
      {
        id: 'external-interface',
        title: '外部インターフェース設計',
        description: '他システムとの連携仕様を設計する',
        status: 'todo',
        priority: 'medium'
      },
      {
        id: 'screen-transition',
        title: '画面遷移設計',
        description: '画面間の遷移フローを設計する',
        status: 'todo',
        priority: 'medium'
      },
      {
        id: 'non-functional',
        title: '非機能要件の詳細化',
        description: '性能、セキュリティ、可用性などの要件を詳細化する',
        status: 'todo',
        priority: 'high'
      }
    ],
    deliverables: [
      {
        id: 'basic-design-doc',
        title: '基本設計書（外部設計書）',
        description: 'システムの全体像を記述した文書（システム構成図、データベース設計書、画面遷移図、機能一覧、他システム連携概要、非機能要件詳細を含む）',
        status: 'pending'
      },
      {
        id: 'test-plan-overview',
        title: 'テスト計画書（概要）',
        description: 'テストの全体方針、範囲、フェーズなどを記述',
        status: 'pending'
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
    name: '外部設計',
    description: '基本設計の内容を、ユーザーにとって使いやすい形に落とし込む（主にUI/UX）',
    objective: 'ユーザーインターフェースとユーザーエクスペリエンスを設計し、画面設計書を完成させる',
    tasks: [
      {
        id: 'ui-design',
        title: 'ユーザーインターフェース設計',
        description: '画面レイアウト、操作フローを設計する',
        status: 'todo',
        priority: 'high'
      },
      {
        id: 'ux-design',
        title: 'ユーザーエクスペリエンス設計',
        description: 'ユーザー体験の最適化を図る',
        status: 'todo',
        priority: 'high'
      },
      {
        id: 'input-output-design',
        title: '入力・出力情報の詳細設計',
        description: 'データの入出力仕様を詳細に設計する',
        status: 'todo',
        priority: 'medium'
      },
      {
        id: 'error-handling',
        title: 'エラーハンドリングの検討',
        description: 'エラー処理とユーザーへの通知方法を設計する',
        status: 'todo',
        priority: 'medium'
      },
      {
        id: 'report-design',
        title: '帳票設計',
        description: '各種レポートの設計を行う',
        status: 'todo',
        priority: 'low'
      },
      {
        id: 'test-plan-detail',
        title: 'テスト計画の詳細作成',
        description: '単体テスト、結合テスト、総合テストの範囲を詳細化する',
        status: 'todo',
        priority: 'medium'
      }
    ],
    deliverables: [
      {
        id: 'screen-design-doc',
        title: '画面設計書',
        description: '各画面のレイアウト、要素、入力規則、メッセージを詳細に記述',
        status: 'pending'
      },
      {
        id: 'prototype',
        title: '画面プロトタイプ/ワイヤーフレーム',
        description: '実際の画面に近い視覚的表現',
        status: 'pending'
      },
      {
        id: 'input-output-spec',
        title: '入出力設計書',
        description: '入力データ、出力データの形式、内容を詳細に記述',
        status: 'pending'
      },
      {
        id: 'report-spec',
        title: '帳票設計書',
        description: '各種帳票のデザインとレイアウトを記述',
        status: 'pending'
      },
      {
        id: 'ui-spec',
        title: 'ユーザーインターフェース仕様書',
        description: 'UIの具体的な振る舞いを定義',
        status: 'pending'
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
    name: '開発準備',
    description: '開発をスムーズに開始するための最終準備',
    objective: '開発環境の構築とコーディング規約の策定を完了し、開発開始準備を整える',
    tasks: [
      {
        id: 'dev-environment',
        title: '開発環境の構築',
        description: '開発に必要な環境をセットアップする',
        status: 'todo',
        priority: 'high'
      },
      {
        id: 'tech-stack',
        title: '開発技術の最終決定',
        description: '開発言語、フレームワーク、ライブラリの最終決定とセットアップ',
        status: 'todo',
        priority: 'high'
      },
      {
        id: 'version-control',
        title: 'バージョン管理システムの導入',
        description: 'Git等のバージョン管理システム導入とルール策定',
        status: 'todo',
        priority: 'high'
      },
      {
        id: 'coding-standards',
        title: 'コーディング規約の策定',
        description: '開発チーム内のコーディング規約を策定する',
        status: 'todo',
        priority: 'medium'
      },
      {
        id: 'schedule-detail',
        title: '開発スケジュールの詳細化',
        description: 'より詳細な開発スケジュールを作成する',
        status: 'todo',
        priority: 'medium'
      },
      {
        id: 'project-management',
        title: '課題管理・進捗管理ツールの準備',
        description: 'プロジェクト管理ツールのセットアップ',
        status: 'todo',
        priority: 'medium'
      }
    ],
    deliverables: [
      {
        id: 'dev-setup-guide',
        title: '開発環境構築手順書',
        description: '開発環境のセットアップ方法を記述',
        status: 'pending'
      },
      {
        id: 'coding-guidelines',
        title: 'コーディング規約',
        description: '開発チーム内で統一されたコード記述ルール',
        status: 'pending'
      },
      {
        id: 'detailed-schedule',
        title: '開発スケジュール詳細',
        description: '各タスクの期間、担当、依存関係などを具体化したスケジュール',
        status: 'pending'
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
  '要件定義': Target,
  '基本設計': FileText,
  '外部設計': Palette,
  '開発準備': Code
};

export const MainApp: React.FC = () => {
  const { currentProject } = useProject();
  const { phases, tasks, deliverables, loading, updateTask, updateDeliverable, refreshData, createMissingTasksAndDeliverables } = useProjectData();
  const isMobile = useIsMobile();
  const [currentView, setCurrentView] = useState<'phases' | 'guide' | 'checklist' | 'templates'>('phases');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(384);
  const [maxRightWidth, setMaxRightWidth] = useState(800);

  // 画面幅に応じて最大幅を調整
  useEffect(() => {
    const updateMaxWidth = () => {
      const screenWidth = window.innerWidth;
      const newMaxWidth = Math.min(screenWidth * 0.8, 1200); // 最大1200px、画面幅の80%
      setMaxRightWidth(newMaxWidth);
    };

    updateMaxWidth();
    window.addEventListener('resize', updateMaxWidth);
    return () => window.removeEventListener('resize', updateMaxWidth);
  }, []);

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

  const totalTasks = phasesWithData.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const completedTasks = phasesWithData.reduce((acc, phase) => 
    acc + phase.tasks.filter(task => task.status === 'completed').length, 0
  );
  const totalDeliverables = phasesWithData.reduce((acc, phase) => acc + phase.deliverables.length, 0);
  const completedDeliverables = phasesWithData.reduce((acc, phase) => 
    acc + phase.deliverables.filter(deliverable => deliverable.status === 'completed').length, 0
  );

  // タスク更新関数
  const updateTaskCompletion = async (phaseId: string, taskId: string, completed: boolean) => {
    await updateTask(taskId, { status: completed ? 'completed' : 'todo' });
  };

  // 成果物更新関数
  const updateDeliverableStatus = async (phaseId: string, deliverableId: string, status: 'pending' | 'in-progress' | 'completed') => {
    await updateDeliverable(deliverableId, { status });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (isMobile) {
    return <MobileApp />;
  }

  // フェーズデータが空の場合
  if (phasesWithData.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-lg mb-2">フェーズデータが見つかりません</div>
          <div className="text-sm text-gray-500">プロジェクトにフェーズが設定されていない可能性があります</div>
        </div>
      </div>
    );
  }

  const handlePhaseClick = (phase: any) => {
    setActivePhase(phase.id);
  };

  // サイドバー幅の更新関数
  const handleLeftSidebarResize = (width: number) => {
    setLeftSidebarWidth(width);
  };

  const handleRightSidebarResize = (width: number) => {
    setRightSidebarWidth(width);
  };

  const handleCreateTasksAndDeliverables = async () => {
    if (!currentProject || !currentPhase) {
      console.error('❌ プロジェクトまたはフェーズが選択されていません');
      return;
    }
    
    try {
      console.log('🔄 タスクと成果物を作成中...');
      console.log('📊 現在のプロジェクト:', currentProject.id);
      console.log('📊 現在のフェーズ:', currentPhase.id);
      
      // ProjectDataContextのcreateMissingTasksAndDeliverables関数を呼び出し
      await createMissingTasksAndDeliverables(currentProject.id);
      
      // データを再取得
      await refreshData();
      
      console.log('✅ タスクと成果物の作成が完了しました');
      
      // ユーザーに成功メッセージを表示（将来的にトースト通知を追加可能）
      alert('タスクと成果物の作成が完了しました。ページを更新してください。');
      
    } catch (error) {
      console.error('❌ タスクと成果物の作成に失敗しました:', error);
      alert('タスクと成果物の作成に失敗しました。コンソールを確認してください。');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー - 画面幅いっぱい */}
      <Header
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        totalDeliverables={totalDeliverables}
        completedDeliverables={completedDeliverables}
        currentProject={currentProject}
      />

      {/* メイン部分 - リサイズ可能なサイドバー + コンテンツ */}
      <ResizableContainer
        leftSidebar={
          <ResizableSidebar
            position="left"
            defaultWidth={leftSidebarWidth}
            minWidth={200}
            maxWidth={500}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            onResize={handleLeftSidebarResize}
          >
          
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
                {phasesWithData.map(phase => {
                  const IconComponent = phaseIcons[phase.title as keyof typeof phaseIcons] || phaseIcons['要件定義'];
                  
                  // タスクと成果物の両方を考慮した進捗計算
                  const completedTasks = phase.tasks.filter(task => task.status === 'completed').length;
                  const totalTasks = phase.tasks.length;
                  const completedDeliverables = phase.deliverables.filter(deliverable => deliverable.status === 'completed').length;
                  const totalDeliverables = phase.deliverables.length;
                  
                  // タスクと成果物の合計数が0でない場合のみ進捗を計算
                  const totalItems = totalTasks + totalDeliverables;
                  const completedItems = completedTasks + completedDeliverables;
                  const phaseProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
                  
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
          
          {/* 折りたたみ時のサポートリンク */}
          {!sidebarOpen && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex justify-center">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="サポートが必要ですか？"
                >
                  <HelpCircle className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          )}
          </ResizableSidebar>
        }
        rightSidebar={
                      <ResizableSidebar 
              position="right" 
              defaultWidth={rightSidebarWidth} 
              minWidth={200} 
              maxWidth={maxRightWidth}
              isOpen={rightSidebarOpen} 
              onToggle={() => setRightSidebarOpen(!rightSidebarOpen)} 
              onResize={handleRightSidebarResize}
            >
            {rightSidebarOpen ? (
              <DocumentManager phaseId={currentPhase?.id || 'requirements-definition'} />
            ) : (
              <div className="flex flex-col items-center py-6">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            )}
          </ResizableSidebar>
        }
      >
        {/* メインコンテンツエリア */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {currentView === 'guide' ? (
              <BasicGuide />
            ) : currentView === 'checklist' ? (
              <DeliverablesChecklist phases={phasesWithData} />
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
                      onCreateTasks={handleCreateTasksAndDeliverables}
                    />
                    
                    <DeliverableTracker
                      phase={currentPhase}
                      onStatusUpdate={(deliverableId, status) => 
                        updateDeliverableStatus(currentPhase.id, deliverableId, status)
                      }
                      onCreateDeliverables={handleCreateTasksAndDeliverables}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </ResizableContainer>
    </div>
  );
}; 