import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useProject } from './ProjectContext';

interface Phase {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  order_index: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

interface Task {
  id: string;
  phase_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface Deliverable {
  id: string;
  phase_id: string;
  name: string;
  description?: string;
  type: 'document' | 'design' | 'code' | 'other';
  status: 'pending' | 'in-progress' | 'completed';
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface ProjectDataContextType {
  phases: Phase[];
  tasks: Task[];
  deliverables: Deliverable[];
  loading: boolean;
  refreshData: () => Promise<void>;
  createInitialPhases: (projectId: string) => Promise<{ error: any }>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<{ error: any }>;
  updateDeliverable: (deliverableId: string, updates: Partial<Deliverable>) => Promise<{ error: any }>;
  createMissingTasksAndDeliverables: (projectId: string) => Promise<void>;
}

const ProjectDataContext = createContext<ProjectDataContextType | undefined>(undefined);

function useProjectData() {
  const context = useContext(ProjectDataContext);
  if (context === undefined) {
    throw new Error('useProjectData must be used within a ProjectDataProvider');
  }
  return context;
}

function ProjectDataProvider({ children }: { children: React.ReactNode }) {
  const { currentProject } = useProject();
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentProject) {
      setPhases([]);
      setTasks([]);
      setDeliverables([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchProjectData = async () => {
      try {
        // フェーズデータを取得
        const { data: phasesData, error: phasesError } = await supabase
          .from('phases')
          .select('*')
          .eq('project_id', currentProject.id)
          .order('order_index', { ascending: true });

        if (phasesError) throw phasesError;

        // フェーズが存在しない場合は初期フェーズを作成
        if (!phasesData || phasesData.length === 0) {
          const initialPhases = [
            { name: '要件定義', order_index: 1 },
            { name: '基本設計', order_index: 2 },
            { name: '外部設計', order_index: 3 },
            { name: '開発準備', order_index: 4 }
          ];

          const { data: newPhasesData, error: createPhasesError } = await supabase
            .from('phases')
            .insert(initialPhases.map(phase => ({ ...phase, project_id: currentProject.id })))
            .select();

          if (createPhasesError) throw createPhasesError;
          setPhases(newPhasesData || []);
        } else {
          setPhases(phasesData);
        }

        // タスクデータを取得
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('project_id', currentProject.id)
          .order('created_at', { ascending: true });

        if (tasksError) throw tasksError;

        console.log('🔍 タスクデータ取得結果:', {
          projectId: currentProject.id,
          tasksCount: tasksData?.length || 0,
          tasksData: tasksData,
          error: tasksError
        });

        // 重複タスクを除去
        const uniqueTasks = tasksData?.reduce((acc: Task[], task: Task) => {
          const existingTask = acc.find(t => t.id === task.id);
          if (!existingTask) {
            acc.push(task);
          }
          return acc;
        }, []) || [];

        setTasks(uniqueTasks);

        // 成果物データを取得
        const { data: deliverablesData, error: deliverablesError } = await supabase
          .from('deliverables')
          .select('*')
          .eq('project_id', currentProject.id)
          .order('created_at', { ascending: true });

        if (deliverablesError) throw deliverablesError;

        console.log('🔍 成果物データ取得結果:', {
          projectId: currentProject.id,
          deliverablesCount: deliverablesData?.length || 0,
          deliverablesData: deliverablesData,
          error: deliverablesError
        });

        // 重複成果物を除去
        const uniqueDeliverables = deliverablesData?.reduce((acc: Deliverable[], deliverable: Deliverable) => {
          const existingDeliverable = acc.find(d => d.id === deliverable.id);
          if (!existingDeliverable) {
            acc.push(deliverable);
          }
          return acc;
        }, []) || [];

        setDeliverables(uniqueDeliverables);

        // タスクと成果物が存在しない場合、手動で作成
        if ((!uniqueTasks || uniqueTasks.length === 0) && (!uniqueDeliverables || uniqueDeliverables.length === 0)) {
          console.log('⚠️ タスクと成果物が存在しません。手動で作成します...');
          await createMissingTasksAndDeliverables(currentProject.id);
        }

      } catch (error) {
        console.error('プロジェクトデータ取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [currentProject]);

  useEffect(() => {
    if (currentProject) {
      // リアルタイム同期の設定
      const tasksChannel = supabase
        .channel('tasks-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
            filter: `project_id=eq.${currentProject.id}`
          },
          (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT' || payload.eventType === 'DELETE') {
              // データを再取得
              refreshData();
            }
          }
        )
        .subscribe();

      const deliverablesChannel = supabase
        .channel('deliverables-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'deliverables',
            filter: `project_id=eq.${currentProject.id}`
          },
          (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT' || payload.eventType === 'DELETE') {
              // データを再取得
              refreshData();
            }
          }
        )
        .subscribe();

      // クリーンアップ関数
      return () => {
        supabase.removeChannel(tasksChannel);
        supabase.removeChannel(deliverablesChannel);
      };
    } else {
      // プロジェクトが選択されていない場合はデータをクリア
      setPhases([]);
      setTasks([]);
      setDeliverables([]);
    }
  }, [currentProject, phases.length]); // phases.lengthを依存配列に追加

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;

      // ローカル状態を即座に更新（UIの応答性向上）
      setTasks(prev => {
        const updatedTasks = prev.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        );
        // order_indexでソートして順番を固定
        return updatedTasks.sort((a, b) => a.order_index - b.order_index);
      });

      return { error: null };
    } catch (error) {
      console.error('タスク更新エラー:', error);
      return { error };
    }
  };

  const updateDeliverable = async (deliverableId: string, updates: Partial<Deliverable>) => {
    try {
      const { error } = await supabase
        .from('deliverables')
        .update(updates)
        .eq('id', deliverableId);

      if (error) throw error;

      // ローカル状態を更新
      setDeliverables(prev => {
        const updatedDeliverables = prev.map(deliverable => 
          deliverable.id === deliverableId ? { ...deliverable, ...updates } : deliverable
        );
        // order_indexでソートして順番を固定
        return updatedDeliverables.sort((a, b) => a.order_index - b.order_index);
      });

      return { error: null };
    } catch (error) {
      console.error('Error updating deliverable:', error);
      return { error };
    }
  };

  const createInitialPhases = async (projectId: string) => {
    try {
      const initialPhases = [
        {
          project_id: projectId,
          name: '要件定義',
          description: '「何を作るのか」を明確にし、システムに求められる機能や非機能要件を具体化する',
          order_index: 1,
        },
        {
          project_id: projectId,
          name: '基本設計',
          description: '要件定義で定義された内容を、システムとしてどう実現するかを具体化する',
          order_index: 2,
        },
        {
          project_id: projectId,
          name: '外部設計',
          description: '基本設計の内容を、ユーザーにとって使いやすい形に落とし込む（主にUI/UX）',
          order_index: 3,
        },
        {
          project_id: projectId,
          name: '開発準備',
          description: '開発をスムーズに開始するための最終準備',
          order_index: 4,
        },
      ];

      // フェーズを作成
      const { data: phasesData, error: phasesError } = await supabase
        .from('phases')
        .insert(initialPhases)
        .select();

      if (phasesError) throw phasesError;

      console.log('Created initial phases:', phasesData);

      // 各フェーズに対応するタスクと成果物を作成
      for (const phase of phasesData) {
        await createPhaseData(phase);
      }

      return { error: null };
    } catch (error) {
      console.error('Error creating initial phases:', error);
      return { error };
    }
  };

  const createPhaseData = async (phase: any) => {
    const phaseTasks = getPhaseTasks(phase.name);
    const phaseDeliverables = getPhaseDeliverables(phase.name);

    // タスクを作成
    if (phaseTasks.length > 0) {
      const tasksWithPhaseId = phaseTasks.map((task, index) => ({
        ...task,
        phase_id: phase.id,
        order_index: index + 1,
      }));

      const { error: tasksError } = await supabase
        .from('tasks')
        .insert(tasksWithPhaseId);

      if (tasksError) {
        console.error('Error creating tasks for phase:', phase.name, tasksError);
      }
    }

    // 成果物を作成
    if (phaseDeliverables.length > 0) {
      const deliverablesWithPhaseId = phaseDeliverables.map((deliverable, index) => ({
        ...deliverable,
        phase_id: phase.id,
        order_index: index + 1,
      }));

      const { error: deliverablesError } = await supabase
        .from('deliverables')
        .insert(deliverablesWithPhaseId);

      if (deliverablesError) {
        console.error('Error creating deliverables for phase:', phase.name, deliverablesError);
      }
    }
  };

  const getPhaseTasks = (phaseName: string) => {
    switch (phaseName) {
      case '要件定義':
        return [
          {
            title: 'プロジェクトの目的と目標の明確化',
            description: 'システム開発の目的、ターゲット、期待効果、ビジネスゴールを明確にする',
            status: 'todo' as const,
            priority: 'high' as const,
          },
          {
            title: '現状業務の分析と課題特定',
            description: '現在の業務プロセスを分析し、課題や改善点を特定する',
            status: 'todo' as const,
            priority: 'high' as const,
          },
          {
            title: 'ユーザーヒアリングと要求収集',
            description: 'ステークホルダーからのヒアリングを通じて要求を収集・整理する',
            status: 'todo' as const,
            priority: 'high' as const,
          },
          {
            title: '機能要件の洗い出しと詳細化',
            description: 'システムが備えるべき機能を具体的に定義し、詳細化する',
            status: 'todo' as const,
            priority: 'high' as const,
          },
          {
            title: '非機能要件の定義',
            description: '性能、セキュリティ、可用性、保守性などの非機能要件を定義する',
            status: 'todo' as const,
            priority: 'medium' as const,
          },
          {
            title: '要件の優先順位付け',
            description: 'MoSCoW法などを用いて要件の優先順位を決定する',
            status: 'todo' as const,
            priority: 'medium' as const,
          },
        ];
      case '基本設計':
        return [
          {
            title: 'システム全体構成設計',
            description: 'アーキテクチャ設計を行い、システムの基盤を設計する',
            status: 'todo' as const,
            priority: 'high' as const,
          },
          {
            title: 'データベース論理・物理設計',
            description: 'ER図の作成と正規化、インデックス設計を実施する',
            status: 'todo' as const,
            priority: 'high' as const,
          },
          {
            title: '機能概要設計',
            description: '各機能の入力、処理、出力の概要を設計する',
            status: 'todo' as const,
            priority: 'medium' as const,
          },
          {
            title: '外部インターフェース設計',
            description: '他システムとの連携仕様を設計する',
            status: 'todo' as const,
            priority: 'medium' as const,
          },
          {
            title: '画面遷移設計',
            description: '画面間の遷移フローを設計する',
            status: 'todo' as const,
            priority: 'medium' as const,
          },
          {
            title: '非機能要件の詳細化',
            description: '性能、セキュリティ、可用性などの要件を詳細化する',
            status: 'todo' as const,
            priority: 'high' as const,
          },
        ];
      case '外部設計':
        return [
          {
            title: 'ユーザーインターフェース設計',
            description: '画面レイアウト、操作フローを設計する',
            status: 'todo' as const,
            priority: 'high' as const,
          },
          {
            title: 'ユーザーエクスペリエンス設計',
            description: 'ユーザー体験の最適化を図る',
            status: 'todo' as const,
            priority: 'high' as const,
          },
          {
            title: '入力・出力情報の詳細設計',
            description: 'データの入出力仕様を詳細に設計する',
            status: 'todo' as const,
            priority: 'medium' as const,
          },
          {
            title: 'エラーハンドリングの検討',
            description: 'エラー処理とユーザーへの通知方法を設計する',
            status: 'todo' as const,
            priority: 'medium' as const,
          },
          {
            title: '帳票設計',
            description: '各種レポートの設計を行う',
            status: 'todo' as const,
            priority: 'low' as const,
          },
          {
            title: 'テスト計画の詳細作成',
            description: '単体テスト、結合テスト、総合テストの範囲を詳細化する',
            status: 'todo' as const,
            priority: 'medium' as const,
          },
        ];
      case '開発準備':
        return [
          {
            title: '開発環境の構築',
            description: '開発に必要な環境をセットアップする',
            status: 'todo' as const,
            priority: 'high' as const,
          },
          {
            title: '開発技術の最終決定',
            description: '開発言語、フレームワーク、ライブラリの最終決定とセットアップ',
            status: 'todo' as const,
            priority: 'high' as const,
          },
          {
            title: 'バージョン管理システムの導入',
            description: 'Git等のバージョン管理システム導入とルール策定',
            status: 'todo' as const,
            priority: 'high' as const,
          },
          {
            title: 'コーディング規約の策定',
            description: '開発チーム内のコーディング規約を策定する',
            status: 'todo' as const,
            priority: 'medium' as const,
          },
          {
            title: '開発スケジュールの詳細化',
            description: 'より詳細な開発スケジュールを作成する',
            status: 'todo' as const,
            priority: 'medium' as const,
          },
          {
            title: '課題管理・進捗管理ツールの準備',
            description: 'プロジェクト管理ツールのセットアップ',
            status: 'todo' as const,
            priority: 'medium' as const,
          },
        ];
      default:
        return [];
    }
  };

  const getPhaseDeliverables = (phaseName: string) => {
    switch (phaseName) {
      case '要件定義':
        return [
          {
            name: '企画書',
            description: 'システム開発の目的、ターゲット、期待効果、ビジネスゴールなどをまとめた文書',
            type: 'document' as const,
            status: 'pending' as const,
          },
          {
            name: '要件定義書',
            description: 'システムが備えるべき機能（機能要件）と非機能要件を詳細に記述した、すべての開発工程の基礎となる文書',
            type: 'document' as const,
            status: 'pending' as const,
          },
          {
            name: '業務フロー図（As-Is/To-Be）',
            description: '現状の業務とシステム導入後の業務の流れを図式化したもの',
            type: 'document' as const,
            status: 'pending' as const,
          },
        ];
      case '基本設計':
        return [
          {
            name: '基本設計書（外部設計書）',
            description: 'システムの全体像を記述した文書（システム構成図、データベース設計書、画面遷移図、機能一覧、他システム連携概要、非機能要件詳細を含む）',
            type: 'document' as const,
            status: 'pending' as const,
          },
          {
            name: 'テスト計画書（概要）',
            description: 'テストの全体方針、範囲、フェーズなどを記述',
            type: 'document' as const,
            status: 'pending' as const,
          },
        ];
      case '外部設計':
        return [
          {
            name: '画面設計書',
            description: '各画面のレイアウト、操作フロー、UI仕様を記述した文書',
            type: 'document' as const,
            status: 'pending' as const,
          },
          {
            name: 'ワイヤーフレーム・プロトタイプ',
            description: '画面のワイヤーフレームとプロトタイプ',
            type: 'design' as const,
            status: 'pending' as const,
          },
          {
            name: '入出力設計書',
            description: 'データの入出力仕様を詳細に記述した文書',
            type: 'document' as const,
            status: 'pending' as const,
          },
        ];
      case '開発準備':
        return [
          {
            name: '開発環境構築手順書',
            description: '開発環境のセットアップ方法を記述',
            type: 'document' as const,
            status: 'pending' as const,
          },
          {
            name: 'コーディング規約',
            description: '開発チーム内で統一されたコード記述ルール',
            type: 'document' as const,
            status: 'pending' as const,
          },
          {
            name: '開発スケジュール詳細',
            description: '各タスクの期間、担当、依存関係などを具体化したスケジュール',
            type: 'document' as const,
            status: 'pending' as const,
          },
        ];
      default:
        return [];
    }
  };

  const refreshData = async () => {
    if (!currentProject) return;

    try {
      setLoading(true);

      // フェーズデータを取得
      const { data: phasesData, error: phasesError } = await supabase
        .from('phases')
        .select('*')
        .eq('project_id', currentProject.id)
        .order('order_index', { ascending: true });

      if (phasesError) throw phasesError;
      setPhases(phasesData || []);

      // タスクデータを取得
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', currentProject.id)
        .order('created_at', { ascending: true });

      if (tasksError) throw tasksError;

      // 重複タスクを除去
      const uniqueTasks = tasksData?.reduce((acc: Task[], task: Task) => {
        const existingTask = acc.find(t => t.id === task.id);
        if (!existingTask) {
          acc.push(task);
        }
        return acc;
      }, []) || [];

      setTasks(uniqueTasks);

      // 成果物データを取得
      const { data: deliverablesData, error: deliverablesError } = await supabase
        .from('deliverables')
        .select('*')
        .eq('project_id', currentProject.id)
        .order('created_at', { ascending: true });

      if (deliverablesError) throw deliverablesError;

      // 重複成果物を除去
      const uniqueDeliverables = deliverablesData?.reduce((acc: Deliverable[], deliverable: Deliverable) => {
        const existingDeliverable = acc.find(d => d.id === deliverable.id);
        if (!existingDeliverable) {
          acc.push(deliverable);
        }
        return acc;
      }, []) || [];

      setDeliverables(uniqueDeliverables);

    } catch (error) {
      console.error('データ更新エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMissingTasksAndDeliverables = async (projectId: string) => {
    const phases = await supabase
      .from('phases')
      .select('id, name')
      .eq('project_id', projectId);

    if (phases.error) {
      console.error('プロジェクトのフェーズを取得できませんでした:', phases.error);
      return;
    }

    for (const phase of phases.data || []) {
      await createPhaseData(phase);
    }
  };

  const value = {
    phases,
    tasks,
    deliverables,
    loading,
    refreshData,
    createInitialPhases,
    updateTask,
    updateDeliverable,
    createMissingTasksAndDeliverables,
  };

  return <ProjectDataContext.Provider value={value}>{children}</ProjectDataContext.Provider>;
}

export { useProjectData, ProjectDataProvider }; 