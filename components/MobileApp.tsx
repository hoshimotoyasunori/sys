import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Download, FileText, Target, Layout, Settings, Code, Search, MessageCircle, Layers, Users, Plus, Trash2, LogOut, User, AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext';
import { useProjectData } from '../contexts/ProjectDataContext';
import { ProjectMembersDialog } from './ProjectMembersDialog';
import { CreateProjectDialog } from './CreateProjectDialog';
import { DeleteProjectDialog } from './DeleteProjectDialog';
import { ProjectSwitchDialog } from './ProjectSwitchDialog';

// 通知の型定義
interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface MobileNotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const phases = [
  { id: 'requirements-definition', label: '要件定義', icon: <span>🔍</span> },
  { id: 'basic-design', label: '基本設計', icon: <span>📝</span> },
  { id: 'external-design', label: '外部設計', icon: <span>📐</span> },
  { id: 'development-prep', label: '開発準備', icon: <span>⚙️</span> },
];

// 進捗表示コンポーネント（改善版）
function MobilePhaseOverview({ phase }) {
  const totalTasks = phase.tasks.length;
  const completedTasks = phase.tasks.filter(task => task.status === 'completed').length;
  const totalDeliverables = phase.deliverables.length;
  const completedDeliverables = phase.deliverables.filter(deliverable => deliverable.status === 'completed').length;
  
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const deliverableProgress = totalDeliverables > 0 ? (completedDeliverables / totalDeliverables) * 100 : 0;
  const overallProgress = totalTasks + totalDeliverables > 0 ? 
    ((completedTasks + completedDeliverables) / (totalTasks + totalDeliverables)) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-4">{phase.title}</h2>
        
        {/* 全体進捗 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">全体進捗</span>
            <span className="text-sm font-bold text-blue-600">{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* 詳細進捗 */}
        <div className="grid grid-cols-2 gap-4">
          {/* タスク進捗 */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-blue-700">タスク</span>
              <span className="text-xs font-bold text-blue-600">{completedTasks}/{totalTasks}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${taskProgress}%` }}
              ></div>
            </div>
          </div>

          {/* 成果物進捗 */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-green-700">成果物</span>
              <span className="text-xs font-bold text-green-600">{completedDeliverables}/{totalDeliverables}</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${deliverableProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <div className="font-bold text-gray-900">{totalTasks}</div>
              <div className="text-gray-500">タスク</div>
            </div>
            <div>
              <div className="font-bold text-gray-900">{totalDeliverables}</div>
              <div className="text-gray-500">成果物</div>
            </div>
            <div>
              <div className="font-bold text-gray-900">{Math.round(overallProgress)}%</div>
              <div className="text-gray-500">完了率</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 検索・フィルタリング機能なしのタスク一覧
function MobileTaskManager({ phase, onTaskUpdate }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '低';
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-base font-bold mb-3">主要タスク</h2>
      
      {/* タスク一覧 */}
      <div className="space-y-3">
        {phase.tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>タスクがありません</p>
          </div>
        ) : (
          phase.tasks.map(task => (
            <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={() => onTaskUpdate(task.id, task.status === 'completed' ? false : true)}
                className="mt-1 accent-blue-500"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>{task.title}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityColor(task.priority)}`}>{getPriorityLabel(task.priority)}</span>
                </div>
                <p className={`text-xs text-gray-600 ${task.status === 'completed' ? 'line-through' : ''}`}>{task.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 検索・フィルタリング機能なしの成果物一覧
function MobileDeliverableTracker({ phase, onStatusUpdate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-gray-100 text-gray-600';
      case 'not-started': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return '完了';
      case 'in-progress': return '進行中';
      case 'pending': return '未着手';
      case 'not-started': return '未着手';
      default: return '未着手';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'document': return 'ドキュメント';
      case 'design': return '設計';
      case 'code': return 'コード';
      case 'other': return 'その他';
      default: return 'その他';
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-base font-bold mb-3">主要成果物</h2>
      
      {/* 成果物一覧 */}
      <div className="space-y-3">
        {phase.deliverables.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>成果物がありません</p>
          </div>
        ) : (
          phase.deliverables.map(deliverable => (
            <div key={deliverable.id} className="p-3 border rounded-lg bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{deliverable.name || deliverable.title}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(deliverable.status)}`}>
                    {getStatusLabel(deliverable.status)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                    {getTypeLabel(deliverable.type)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600">{deliverable.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">ステータス:</span>
                <select
                  value={deliverable.status}
                  onChange={e => onStatusUpdate(deliverable.id, e.target.value)}
                  className="border rounded px-2 py-1 text-xs"
                >
                  <option value="pending">未着手</option>
                  <option value="in-progress">進行中</option>
                  <option value="completed">完了</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 成果物チェックリスト（モバイル用）
function MobileDeliverablesChecklist({ phaseData, onCheck }) {
  // 各フェーズの進捗計算
  const getProgress = (deliverables) => {
    const total = deliverables.length;
    const completed = deliverables.filter(d => d.status === 'completed').length;
    return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
  };
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold mb-2">成果物チェックリスト</h2>
      {Object.entries(phaseData).map(([phaseId, phase]) => {
        const p = phase as any;
        const progress = getProgress(p.deliverables);
        return (
          <details key={phaseId} className="bg-white rounded-xl shadow p-4">
            <summary className="flex items-center gap-2 cursor-pointer font-semibold text-base">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{p.title[0]}</span>
              <span>{p.title}</span>
              <span className="ml-auto text-xs bg-gray-100 rounded px-2 py-0.5">{progress.completed}/{progress.total} 完了</span>
              <span className="ml-2 text-xs bg-green-100 text-green-800 rounded px-2">{progress.percent}%</span>
            </summary>
            <ul className="mt-3 space-y-2">
              {p.deliverables.map((d, i) => (
                <li key={d.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={d.status === 'completed'} onChange={() => onCheck(phaseId, d.id, d.status === 'completed' ? 'not-started' : 'completed')} className="accent-blue-500" />
                  <span className={d.status === 'completed' ? 'line-through text-gray-400' : ''}>{d.title}</span>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </div>
  );
}

// テンプレートデータ（PC版Templates.tsxから抜粋・簡略化）
const mobileTemplates = [
  {
    id: 'project-proposal-template',
    title: '企画書テンプレート',
    description: 'システム開発の目的、ターゲット、期待効果、ビジネスゴールを整理するための企画書テンプレート。',
    category: 'requirements-definition',
    type: 'document',
    icon: Target,
    difficulty: 'intermediate',
    content: '# システム開発企画書\n...（省略）',
  },
  {
    id: 'requirements-definition-template',
    title: '要件定義書テンプレート',
    description: '機能要件・非機能要件を体系的に整理し、開発の基盤となる要件定義書を作成するためのテンプレート。',
    category: 'requirements-definition',
    type: 'document',
    icon: FileText,
    difficulty: 'advanced',
    content: '# 要件定義書\n...（省略）',
  },
  {
    id: 'business-flow-template',
    title: '業務フロー図テンプレート',
    description: '現状（As-Is）と将来（To-Be）の業務フローを可視化するためのテンプレート。',
    category: 'requirements-definition',
    type: 'template',
    icon: Layout,
    difficulty: 'intermediate',
    content: '# 業務フロー分析書\n...（省略）',
  },
  {
    id: 'coding-standards',
    title: 'コーディング規約テンプレート',
    description: 'JavaScript/TypeScript、Python、Java等の言語別コーディング規約テンプレート。',
    category: 'development-prep',
    type: 'document',
    icon: Code,
    difficulty: 'beginner',
    content: '# コーディング規約\n...（省略）',
  },
  {
    id: 'meeting-minutes',
    title: '会議議事録テンプレート',
    description: '設計レビュー、進捗報告、課題管理等の会議で使用する議事録テンプレート。',
    category: 'common',
    type: 'template',
    icon: FileText,
    difficulty: 'beginner',
    content: '# 会議議事録\n...（省略）',
  },
];
const categoryLabels = {
  'requirements-definition': '要件定義',
  'basic-design': '基本設計',
  'external-design': '外部設計',
  'development-prep': '開発準備',
  'common': '共通',
};
const difficultyLabels = {
  'beginner': '初級',
  'intermediate': '中級',
  'advanced': '上級',
};

function MobileTemplates() {
  const handleDownload = (template) => {
    const blob = new Blob([template.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900 mb-2">テンプレート一覧</h1>
      <p className="text-gray-600 mb-4 text-sm">システム開発で使える各種テンプレートをダウンロードできます。</p>
      <div className="space-y-4">
        {mobileTemplates.map((template) => {
          const IconComponent = template.icon;
          return (
            <div key={template.id} className="border rounded-xl p-4 bg-white flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500">{categoryLabels[template.category]}</span>
                <span className={`ml-auto px-2 py-0.5 rounded text-xs font-bold ${template.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{difficultyLabels[template.difficulty]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base truncate flex-1">{template.title}</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{template.description}</p>
              <button
                onClick={() => handleDownload(template)}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-2 flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                ダウンロード
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function MobileGuide() {
  // 基本原則
  const generalPrinciples = [
    { title: '段階的な開発アプローチ', description: '各フェーズを順序立てて進め、前の段階の成果物を確実に固めてから次へ進む', icon: '📚' },
    { title: 'ステークホルダー中心の開発', description: '関係者全員を巻き込み、合意形成を重視しながらプロジェクトを進める', icon: '👥' },
    { title: '継続的な改善とレビュー', description: '定期的な振り返りと改善を通じて、品質向上とリスク軽減を図る', icon: '🔄' },
    { title: '透明性のある情報共有', description: '進捗状況、課題、決定事項を関係者全員に適切に共有する', icon: '💬' },
    { title: '品質重視の開発', description: 'テストやレビューを通じて品質を確保し、保守性の高いシステムを構築する', icon: '🛡️' },
    { title: '包括的なドキュメント化', description: '開発プロセスと成果物を適切に文書化し、ナレッジを蓄積する', icon: '📄' },
  ];
  // フェーズ別ガイド
  const phases = [
    {
      id: 1,
      title: '要件定義',
      duration: '2-6週間',
      description: '「何を作るのか」を明確にし、システムに求められる機能や非機能要件を具体化する',
      keyActivities: ['プロジェクトの目的と目標の明確化', '現状業務の分析と課題特定', 'ユーザーヒアリングと要求収集', '機能要件の洗い出しと詳細化', '非機能要件の定義', '要件の優先順位付け'],
      deliverables: ['企画書', '要件定義書', '業務フロー図（As-Is/To-Be）', 'ユーザーストーリー', '機能一覧'],
      tips: ['要件ヒアリングでは「なぜ」を深く掘り下げる', 'MoSCoW法で要件の優先順位を明確化', 'ステークホルダー全員の合意を文書で確認']
    },
    {
      id: 2,
      title: '基本設計',
      duration: '2-4週間',
      description: '要件定義で定義された内容を、システムとしてどう実現するかを具体化する',
      keyActivities: ['システム全体構成設計', 'データベース論理・物理設計', '機能概要設計', '外部インターフェース設計', '非機能要件の詳細化'],
      deliverables: ['基本設計書', 'システム構成図', 'データベース設計書', 'テスト計画書（概要）'],
      tips: ['ステークホルダーとの定期的なレビューを実施', 'アーキテクチャの選定理由を文書化', 'パフォーマンス要件を数値で明確化']
    },
    {
      id: 3,
      title: '外部設計',
      duration: '3-5週間',
      description: '基本設計の内容を、ユーザーにとって使いやすい形に落とし込む',
      keyActivities: ['UI設計', 'UX設計', '入力・出力情報の詳細設計', 'エラーハンドリングの検討', '帳票設計'],
      deliverables: ['画面設計書', 'ワイヤーフレーム・プロトタイプ', '入出力設計書', 'UI/UX仕様書'],
      tips: ['ユーザビリティテストを早期実施', 'アクセシビリティを考慮した設計', 'レスポンシブデザインの検討']
    },
    {
      id: 4,
      title: '開発準備',
      duration: '1-2週間',
      description: '開発をスムーズに開始するための最終準備',
      keyActivities: ['開発環境の構築', '開発技術の最終決定', 'バージョン管理システムの導入', 'コーディング規約の策定', 'プロジェクト管理ツールの準備'],
      deliverables: ['開発環境構築手順書', 'コーディング規約', '開発スケジュール詳細', 'チーム開発ガイドライン'],
      tips: ['CI/CDパイプラインの早期構築', 'コードレビュープロセスの確立', 'チーム内のコミュニケーションルール策定']
    }
  ];
  // よくある落とし穴
  const pitfalls = [
    { title: '要件の曖昧さ', description: '要件が曖昧なまま設計を進めると、後で大幅な修正が必要になる', solution: '具体的で測定可能な要件を定義し、不明点は必ず確認する' },
    { title: 'ステークホルダーとの認識齟齬', description: '関係者間で認識が異なると、プロジェクトが迷走する', solution: '定期的なミーティングと文書による確認を徹底する' },
    { title: '技術選定の遅れ', description: '技術選定が遅れると、設計や開発に影響する', solution: '早期に技術調査を行い、PoC（概念実証）で検証する' },
    { title: 'ドキュメントの不備', description: '不十分なドキュメントは、後の開発や保守で問題となる', solution: 'テンプレートを活用し、レビューを通じて品質を確保する' },
  ];

  return (
    <div className="space-y-8">
      {/* 基本原則 */}
      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-lg font-bold mb-2">システム開発の基本原則</h2>
        <ul className="space-y-2">
          {generalPrinciples.map((p, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-2xl mt-1">{p.icon}</span>
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-600">{p.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* フェーズ別ガイド */}
      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-lg font-bold mb-2">フェーズ別実行ガイド</h2>
        <div className="divide-y">
          {phases.map(phase => (
            <details key={phase.id} className="py-4">
              <summary className="font-semibold text-base cursor-pointer flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{phase.id}</span>
                <span>{phase.title}</span>
                <span className="ml-2 text-xs bg-gray-100 rounded px-2 py-0.5">{phase.duration}</span>
              </summary>
              <div className="mt-3 ml-8 space-y-2">
                <div className="text-sm text-gray-700 mb-1">{phase.description}</div>
                <div>
                  <div className="font-semibold text-sm">主要活動</div>
                  <ul className="list-disc ml-5 text-sm text-gray-600">
                    {phase.keyActivities.map((a, i) => <li key={i}>{a}</li>)} 
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-sm mt-2">成果物</div>
                  <ul className="list-disc ml-5 text-sm text-gray-600">
                    {phase.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-sm mt-2">重要ポイント</div>
                  <ul className="list-disc ml-5 text-sm text-gray-600">
                    {phase.tips.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
      {/* よくある落とし穴 */}
      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-lg font-bold mb-2">よくある落とし穴と対策</h2>
        <div className="divide-y">
          {pitfalls.map((pit, i) => (
            <details key={i} className="py-3">
              <summary className="font-semibold text-base cursor-pointer">{pit.title}</summary>
              <div className="mt-2 ml-6">
                <div className="text-sm text-gray-700 mb-1">{pit.description}</div>
                <div className="text-sm text-green-700 font-semibold">対策: {pit.solution}</div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
function MobileDocumentManager() {
  // ドキュメントの型
  const [documents, setDocuments] = React.useState([
    {
      id: '1',
      name: '要件定義書.md',
      type: 'requirements-definition',
      size: 2048,
      uploadDate: new Date('2024-07-01T10:00:00'),
      updateDate: new Date('2024-07-10T12:00:00'),
      author: '山田太郎',
      content: '# 要件定義書\n...（省略）',
      description: 'システムの要件をまとめたドキュメント',
      tags: ['最新版', 'Draft'],
      isLatest: true,
    },
    {
      id: '2',
      name: '基本設計書.md',
      type: 'basic-design',
      size: 4096,
      uploadDate: new Date('2024-07-05T09:00:00'),
      updateDate: new Date('2024-07-12T15:00:00'),
      author: '佐藤花子',
      content: '# 基本設計書\n...（省略）',
      description: 'システムの基本設計をまとめたドキュメント',
      tags: ['最新版'],
      isLatest: true,
    },
  ]);
  const [showUpload, setShowUpload] = React.useState(false);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [newDoc, setNewDoc] = React.useState<{
    name: string;
    type: string;
    description: string;
    content: string;
    tags: string[];
    isLatest: boolean;
  }>({
    name: '',
    type: 'requirements-definition',
    description: '',
    content: '',
    tags: [],
    isLatest: false,
  });

  // ファイルサイズ表示
  const formatFileSize = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
  // 日時表示
  const formatDateTime = (date) => date.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  // ドキュメントアップロード
  const handleUpload = () => {
    if (!newDoc.name.trim()) return;
    const now = new Date();
    setDocuments(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newDoc.name,
        type: newDoc.type,
        size: new Blob([newDoc.content]).size,
        uploadDate: now,
        updateDate: now,
        author: 'Current User',
        content: newDoc.content,
        description: newDoc.description,
        tags: newDoc.tags,
        isLatest: newDoc.isLatest,
      },
    ]);
    setShowUpload(false);
    setNewDoc({ name: '', type: 'requirements-definition', description: '', content: '', tags: [], isLatest: false });
  };

  // ダウンロード
  const handleDownload = (doc) => {
    const blob = new Blob([doc.content || ''], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 一括ダウンロード
  const handleDownloadLatest = () => {
    documents.filter(d => d.isLatest).forEach(doc => handleDownload(doc));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">ドキュメント管理</h2>
        <button className="bg-blue-600 text-white rounded px-3 py-1 text-sm" onClick={() => setShowUpload(true)}>アップロード</button>
      </div>
      <button className="w-full bg-green-100 text-green-800 rounded py-2 font-semibold mb-2" onClick={handleDownloadLatest}>最新版一括ダウンロード</button>
      <div className="space-y-3">
        {documents.map(doc => (
          <div key={doc.id} className="border rounded-xl bg-white">
            <button className="w-full flex justify-between items-center p-3" onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-base">{doc.name}</span>
                <span className="text-xs text-gray-500">{doc.description}</span>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-700 rounded px-2">{doc.type === 'requirements-definition' ? '要件定義' : doc.type === 'basic-design' ? '基本設計' : doc.type === 'external-design' ? '外部設計' : doc.type === 'development-prep' ? '開発準備' : 'その他'}</span>
                  {doc.isLatest && <span className="text-xs bg-green-200 text-green-800 rounded px-2">最新版</span>}
                  {doc.tags.map((tag, i) => <span key={i} className="text-xs bg-gray-100 text-gray-600 rounded px-2">{tag}</span>)}
                </div>
              </div>
              <span className="text-xs text-gray-400">{formatDateTime(doc.updateDate)}</span>
            </button>
            {expandedId === doc.id && (
              <div className="p-4 border-t space-y-2">
                <div className="text-xs text-gray-500">サイズ: {formatFileSize(doc.size)} / 作成者: {doc.author}</div>
                <div className="text-xs text-gray-500">アップロード: {formatDateTime(doc.uploadDate)} / 更新: {formatDateTime(doc.updateDate)}</div>
                <div className="bg-gray-50 rounded p-2 text-xs font-mono overflow-x-auto max-h-32">{doc.content}</div>
                <div className="flex gap-2 mt-2">
                  <button className="bg-blue-600 text-white rounded px-3 py-1 text-xs" onClick={() => handleDownload(doc)}>ダウンロード</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* アップロードモーダル */}
      {showUpload && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-xs space-y-4 shadow-lg">
            <h3 className="font-bold text-lg mb-2">新規ドキュメントアップロード</h3>
            <input className="w-full border rounded px-2 py-1" placeholder="ファイル名.md" value={newDoc.name} onChange={e => setNewDoc({ ...newDoc, name: e.target.value })} />
            <select className="w-full border rounded px-2 py-1 bg-white shadow-sm" value={newDoc.type} onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}>
              <option value="requirements-definition">要件定義</option>
              <option value="basic-design">基本設計</option>
              <option value="external-design">外部設計</option>
              <option value="development-prep">開発準備</option>
              <option value="other">その他</option>
            </select>
            <input className="w-full border rounded px-2 py-1" placeholder="説明" value={newDoc.description} onChange={e => setNewDoc({ ...newDoc, description: e.target.value })} />
            <textarea className="w-full border rounded px-2 py-1" rows={4} placeholder="内容 (Markdown)" value={newDoc.content} onChange={e => setNewDoc({ ...newDoc, content: e.target.value })} />
            <input className="w-full border rounded px-2 py-1" placeholder="タグ（カンマ区切り）" value={newDoc.tags.join(',')} onChange={e => setNewDoc({ ...newDoc, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={newDoc.isLatest} onChange={e => setNewDoc({ ...newDoc, isLatest: e.target.checked })} />最新版としてマーク
            </label>
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-600 text-white rounded px-3 py-1 text-xs" onClick={handleUpload}>アップロード</button>
              <button className="bg-gray-300 text-gray-700 rounded px-3 py-1 text-xs" onClick={() => setShowUpload(false)}>キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 通知コンポーネント
function MobileNotification({ message, type, onClose }: MobileNotificationProps) {
  const isSuccess = type === 'success';
  const isError = type === 'error';
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      isSuccess ? 'bg-green-50 border border-green-200' : 
      isError ? 'bg-red-50 border border-red-200' : 
      'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex items-center gap-3">
        {isSuccess && <CheckCircle2 className="h-5 w-5 text-green-600" />}
        {isError && <AlertCircle className="h-5 w-5 text-red-600" />}
        <span className={`text-sm font-medium ${
          isSuccess ? 'text-green-800' : 
          isError ? 'text-red-800' : 
          'text-blue-800'
        }`}>
          {message}
        </span>
        <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">
          ×
        </button>
      </div>
    </div>
  );
}

// プロジェクト管理モーダル
function MobileProjectManagement({ isOpen, onClose }) {
  const { projects, currentProject, selectProject, deleteProject, createProject } = useProject();
  const { signOut, user } = useAuth();
  const [showProjectMembers, setShowProjectMembers] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [showProjectSwitch, setShowProjectSwitch] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showNotification('ログアウトしました', 'success');
      onClose();
    } catch (error) {
      showNotification('ログアウトに失敗しました', 'error');
    }
  };

  const handleProjectSelect = (project) => {
    selectProject(project);
    showNotification(`${project.name}に切り替えました`, 'success');
    onClose();
  };

  const confirmDeleteProject = async () => {
    if (!currentProject) return;
    
    try {
      const { error } = await deleteProject(currentProject.id);
      if (!error) {
        showNotification('プロジェクトを削除しました', 'success');
        onClose();
      } else {
        showNotification('プロジェクトの削除に失敗しました', 'error');
      }
    } catch (error) {
      console.error('プロジェクト削除エラー:', error);
      showNotification('プロジェクトの削除に失敗しました', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">プロジェクト管理</h2>
            <button onClick={onClose} className="text-2xl">×</button>
          </div>

          {/* 現在のプロジェクト情報 */}
          {currentProject && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">現在のプロジェクト</h3>
              <div className="text-blue-800">
                <div className="font-medium">{currentProject.name}</div>
                {currentProject.description && (
                  <div className="text-sm mt-1">{currentProject.description}</div>
                )}
              </div>
            </div>
          )}

          {/* プロジェクト管理オプション */}
          <div className="space-y-4">
            <button
              onClick={() => setShowProjectMembers(true)}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-left">参加メンバー一覧</span>
            </button>

            <button
              onClick={() => setShowProjectSwitch(true)}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Layout className="h-5 w-5 text-gray-600" />
              <span className="text-left">プロジェクトを切り替え</span>
            </button>

            <button
              onClick={() => setShowCreateProject(true)}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Plus className="h-5 w-5 text-gray-600" />
              <span className="text-left">新規プロジェクト作成</span>
            </button>

            {currentProject && (
              <button
                onClick={() => setShowDeleteProject(true)}
                className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-red-700"
              >
                <Trash2 className="h-5 w-5" />
                <span className="text-left">プロジェクトを削除</span>
              </button>
            )}
          </div>

          {/* ユーザー情報 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-4">
              <User className="h-5 w-5 text-gray-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">{user?.email}</div>
                <div className="text-sm text-gray-500">システム設計アシスタント</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-5 w-5 text-gray-600" />
              <span className="text-left">ログアウト</span>
            </button>
          </div>
        </div>
      </div>

      {/* 通知 */}
      {notification && (
        <MobileNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* ダイアログ類 */}
      <ProjectMembersDialog
        isOpen={showProjectMembers}
        onClose={() => setShowProjectMembers(false)}
      />

      <ProjectSwitchDialog
        isOpen={showProjectSwitch}
        onClose={() => setShowProjectSwitch(false)}
        projects={projects}
        currentProject={currentProject}
        onProjectSelect={handleProjectSelect}
      />

      <DeleteProjectDialog
        isOpen={showDeleteProject}
        onClose={() => setShowDeleteProject(false)}
        projectName={currentProject?.name || 'プロジェクト'}
        onConfirm={confirmDeleteProject}
      />

      <CreateProjectDialog
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        onCreateProject={async (name: string, description: string) => {
          const { error } = await createProject(name, description);
          if (!error) {
            showNotification('プロジェクトを作成しました', 'success');
            onClose();
          } else {
            showNotification('プロジェクトの作成に失敗しました', 'error');
          }
          return { error };
        }}
      />
    </div>
  );
}

// 設定画面コンポーネント
function MobileSettings() {
  const { user, signOut } = useAuth();
  const { currentProject } = useProject();
  const { phases, tasks, deliverables } = useProjectData();
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showNotification('ログアウトしました', 'success');
    } catch (error) {
      showNotification('ログアウトに失敗しました', 'error');
    }
  };

  const handleExportData = () => {
    try {
      if (!currentProject) {
        showNotification('プロジェクトが選択されていません', 'error');
        return;
      }

      // プロジェクトデータを準備
      const exportData = {
        project: currentProject,
        phases: phases,
        tasks: tasks,
        deliverables: deliverables,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      // JSONファイルとしてダウンロード
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentProject.name}_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification('データをエクスポートしました', 'success');
    } catch (error) {
      console.error('エクスポートエラー:', error);
      showNotification('データのエクスポートに失敗しました', 'error');
    }
  };

  const handleBackupData = () => {
    try {
      if (!currentProject) {
        showNotification('プロジェクトが選択されていません', 'error');
        return;
      }

      // バックアップデータを準備（エクスポートと同様）
      const backupData = {
        project: currentProject,
        phases: phases,
        tasks: tasks,
        deliverables: deliverables,
        backupDate: new Date().toISOString(),
        version: '1.0.0',
        type: 'backup'
      };

      // JSONファイルとしてダウンロード
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentProject.name}_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification('データをバックアップしました', 'success');
    } catch (error) {
      console.error('バックアップエラー:', error);
      showNotification('データのバックアップに失敗しました', 'error');
    }
  };

  const handleImportData = () => {
    // 将来的にインポート機能を実装
    showNotification('データインポート機能は準備中です', 'info');
  };

  return (
    <div className="space-y-6">
      {/* 通知 */}
      {notification && (
        <MobileNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* ユーザー情報 */}
      <div className="bg-white rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">ユーザー情報</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">{user?.email}</div>
              <div className="text-sm text-gray-500">システム設計アシスタント</div>
            </div>
          </div>
        </div>
      </div>

      {/* プロジェクト情報 */}
      {currentProject && (
        <div className="bg-white rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">プロジェクト情報</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-900">{currentProject.name}</div>
              {currentProject.description && (
                <div className="text-sm text-blue-700 mt-1">{currentProject.description}</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-bold text-gray-900">{phases.length}</div>
                <div className="text-gray-500">フェーズ</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-bold text-gray-900">{tasks.length}</div>
                <div className="text-gray-500">タスク</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* データ管理 */}
      <div className="bg-white rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">データ管理</h3>
        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Download className="h-5 w-5 text-blue-600" />
            <span className="text-left text-blue-700">データをエクスポート</span>
          </button>

          <button
            onClick={handleBackupData}
            className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FileText className="h-5 w-5 text-green-600" />
            <span className="text-left text-green-700">データをバックアップ</span>
          </button>

          <button
            onClick={handleImportData}
            className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Upload className="h-5 w-5 text-gray-600" />
            <span className="text-left">データをインポート</span>
          </button>
        </div>
      </div>

      {/* アカウント管理 */}
      <div className="bg-white rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">アカウント管理</h3>
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-red-700"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-left">ログアウト</span>
          </button>
        </div>
      </div>

      {/* アプリ情報 */}
      <div className="bg-white rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">アプリ情報</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>バージョン</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>開発者</span>
            <span>システム設計アシスタント</span>
          </div>
          <div className="flex justify-between">
            <span>最終更新</span>
            <span>2024年12月</span>
          </div>
          <div className="flex justify-between">
            <span>データベース</span>
            <span>Supabase</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 統一されたモーダルコンポーネント（アニメーション付き）
function MobileUnifiedModal({ isOpen, onClose, onNavigateToView }) {
  const [activeSection, setActiveSection] = useState('main');
  const [notification, setNotification] = useState<Notification | null>(null);
  
  const { projects, currentProject, selectProject, deleteProject, createProject } = useProject();
  const { signOut, user } = useAuth();
  const { phases, tasks, deliverables } = useProjectData();

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showNotification('ログアウトしました', 'success');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      showNotification('ログアウトに失敗しました', 'error');
    }
  };

  const handleProjectSelect = (project) => {
    selectProject(project);
    showNotification(`プロジェクト「${project.name}」に切り替えました`, 'success');
    onClose();
  };

  const confirmDeleteProject = async () => {
    if (currentProject && window.confirm(`プロジェクト「${currentProject.name}」を削除しますか？\nこの操作は取り消せません。`)) {
      try {
        const result = await deleteProject(currentProject.id);
        if (result.error) {
          showNotification(result.error.message, 'error');
        } else {
          showNotification('プロジェクトを削除しました', 'success');
          onClose();
        }
      } catch (error) {
        console.error('プロジェクト削除エラー:', error);
        showNotification('プロジェクトの削除に失敗しました', 'error');
      }
    }
  };

  const handleExportData = () => {
    const data = {
      project: currentProject,
      phases,
      tasks,
      deliverables,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject?.name || 'project'}_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('データをエクスポートしました', 'success');
  };

  const handleBackupData = () => {
    const data = {
      project: currentProject,
      phases,
      tasks,
      deliverables,
      backupDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject?.name || 'project'}_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('バックアップを作成しました', 'success');
  };

  const handleImportData = () => {
    // プレースホルダー実装
    showNotification('インポート機能は今後実装予定です', 'info');
  };

  const handleNavigateToView = (view) => {
    onNavigateToView(view);
    onClose();
  };

  const menuItems = [
    { id: 'project', label: 'プロジェクト管理', icon: <Settings className="h-5 w-5" />, color: 'text-blue-600' },
    { id: 'templates', label: 'テンプレート', icon: <FileText className="h-5 w-5" />, color: 'text-green-600' },
    { id: 'guide', label: '基本ガイド', icon: <Target className="h-5 w-5" />, color: 'text-purple-600' },
    { id: 'documents', label: 'ドキュメント管理', icon: <Layers className="h-5 w-5" />, color: 'text-orange-600' },
    { id: 'deliverables', label: '成果物チェック', icon: <CheckCircle className="h-5 w-5" />, color: 'text-red-600' },
    { id: 'settings', label: '設定', icon: <User className="h-5 w-5" />, color: 'text-gray-600' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景オーバーレイ（アニメーション付き） */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* モーダル本体（アニメーション付き） */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-11/12 max-w-md max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
        {/* 通知 */}
        {notification && (
          <div className={`absolute top-4 left-4 right-4 z-10 p-3 rounded-lg shadow-lg transform transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' :
            notification.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{notification.message}</span>
              <button 
                onClick={() => setNotification(null)}
                className="ml-2 text-lg hover:opacity-70 transition-opacity"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {activeSection === 'main' ? 'メニュー' : 
             activeSection === 'project' ? 'プロジェクト管理' :
             activeSection === 'templates' ? 'テンプレート' :
             activeSection === 'guide' ? '基本ガイド' :
             activeSection === 'documents' ? 'ドキュメント管理' :
             activeSection === 'deliverables' ? '成果物チェック' :
             '設定'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <span className="text-2xl text-gray-500 hover:text-gray-700">×</span>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {activeSection === 'main' && (
            <div className="space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] bg-white"
                >
                  <div className={`p-2 rounded-lg bg-gray-50 ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-left font-medium text-gray-900">{item.label}</span>
                  <div className="ml-auto">
                    <span className="text-gray-400">›</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeSection === 'project' && (
            <div className="space-y-4">
              {/* 現在のプロジェクト情報 */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-bold text-blue-900 mb-2">現在のプロジェクト</h3>
                <p className="text-blue-800">{currentProject?.name || 'プロジェクトが選択されていません'}</p>
              </div>

              {/* プロジェクト管理ボタン */}
              <div className="space-y-3">
                <button 
                  onClick={() => handleNavigateToView('project-members')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">メンバー一覧</span>
                </button>
                
                <button 
                  onClick={() => handleNavigateToView('create-project')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <Plus className="h-5 w-5 text-green-600" />
                  <span className="font-medium">プロジェクト作成</span>
                </button>
                
                <button 
                  onClick={() => handleNavigateToView('switch-project')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200"
                >
                  <Settings className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">プロジェクト切り替え</span>
                </button>
                
                <button 
                  onClick={confirmDeleteProject}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200"
                >
                  <Trash2 className="h-5 w-5 text-red-600" />
                  <span className="font-medium">プロジェクト削除</span>
                </button>
              </div>
            </div>
          )}

          {activeSection === 'templates' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">テンプレート</h3>
                <p className="text-gray-600">システム設計に必要なテンプレートをダウンロードできます</p>
              </div>
              <button 
                onClick={() => handleNavigateToView('templates')}
                className="w-full p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200"
              >
                テンプレート一覧を表示
              </button>
            </div>
          )}

          {activeSection === 'guide' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">基本ガイド</h3>
                <p className="text-gray-600">システム設計の基本手順を確認できます</p>
              </div>
              <button 
                onClick={() => handleNavigateToView('guide')}
                className="w-full p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200"
              >
                ガイドを表示
              </button>
            </div>
          )}

          {activeSection === 'documents' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Layers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">ドキュメント管理</h3>
                <p className="text-gray-600">プロジェクトのドキュメントを管理できます</p>
              </div>
              <button 
                onClick={() => handleNavigateToView('documents')}
                className="w-full p-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors duration-200"
              >
                ドキュメント一覧を表示
              </button>
            </div>
          )}

          {activeSection === 'deliverables' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">成果物チェック</h3>
                <p className="text-gray-600">全フェーズの成果物を一覧で確認できます</p>
              </div>
              <button 
                onClick={() => handleNavigateToView('deliverables-checklist')}
                className="w-full p-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
              >
                成果物チェックリストを表示
              </button>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="space-y-4">
              {/* ユーザー情報 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">ユーザー情報</h3>
                <p className="text-gray-600">{user?.email || '未ログイン'}</p>
              </div>

              {/* プロジェクト情報 */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-bold text-blue-900 mb-2">プロジェクト情報</h3>
                <p className="text-blue-800">{currentProject?.name || 'プロジェクトが選択されていません'}</p>
              </div>

              {/* データ管理 */}
              <div className="space-y-3">
                <button 
                  onClick={handleExportData}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <Download className="h-5 w-5 text-green-600" />
                  <span className="font-medium">データエクスポート</span>
                </button>
                
                <button 
                  onClick={handleBackupData}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <Upload className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">バックアップ作成</span>
                </button>
                
                <button 
                  onClick={handleImportData}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                >
                  <Upload className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">データインポート</span>
                </button>
              </div>

              {/* アカウント管理 */}
              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="h-5 w-5 text-red-600" />
                  <span className="font-medium">ログアウト</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 戻るボタン（メイン以外の画面で表示） */}
        {activeSection !== 'main' && (
          <div className="p-6 border-t border-gray-200">
            <button 
              onClick={() => setActiveSection('main')}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <span className="text-lg">‹</span>
              <span className="font-medium">戻る</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MobileApp() {
  const [activePhase, setActivePhase] = useState<string>('');
  const [unifiedModalOpen, setUnifiedModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('phase'); // 'phase' | 'templates' | 'guide' | 'documents' | 'settings'
  const [notification, setNotification] = useState<Notification | null>(null);
  
  const { currentProject } = useProject();
  const { phases, tasks, deliverables, loading, updateTask, updateDeliverable } = useProjectData();

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
      // 現在のactivePhaseが有効でない場合、または空の場合
      const isValidPhase = activePhase && phasesWithData.find(phase => phase.id === activePhase);
      if (!isValidPhase) {
        setActivePhase(phasesWithData[0].id);
      }
    } else {
      // フェーズデータが空の場合はactivePhaseをリセット
      setActivePhase('');
    }
  }, [phasesWithData, activePhase]);

  // currentPhaseを安全に取得
  const currentPhase = activePhase ? phasesWithData.find(phase => phase.id === activePhase) : null;

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  // タスク・成果物の状態更新（実際のデータベースと連携）
  const handleTaskUpdate = async (taskId, isCompleted) => {
    try {
      await updateTask(taskId, { status: isCompleted ? 'completed' : 'todo' });
      showNotification(isCompleted ? 'タスクを完了しました' : 'タスクを未完了にしました', 'success');
    } catch (error) {
      console.error('タスク更新エラー:', error);
      showNotification('タスクの更新に失敗しました', 'error');
    }
  };

  const handleDeliverableUpdate = async (deliverableId, status) => {
    try {
      // フロントエンドのステータスをデータベースのステータスに変換
      const dbStatus = status === 'not-started' ? 'pending' : status;
      await updateDeliverable(deliverableId, { status: dbStatus });
      showNotification('成果物のステータスを更新しました', 'success');
    } catch (error) {
      console.error('成果物更新エラー:', error);
      showNotification('成果物の更新に失敗しました', 'error');
    }
  };

  // 成果物チェックリストの状態更新
  const handleDeliverableCheck = async (phaseId, deliverableId, isCompleted) => {
    try {
      const status = isCompleted ? 'completed' : 'pending';
      await updateDeliverable(deliverableId, { status });
      showNotification(isCompleted ? '成果物を完了しました' : '成果物を未完了にしました', 'success');
    } catch (error) {
      console.error('成果物チェックエラー:', error);
      showNotification('成果物の更新に失敗しました', 'error');
    }
  };

  // モーダルからの画面遷移ハンドラー
  const handleNavigateToView = (view) => {
    setActiveView(view);
    setUnifiedModalOpen(false);
  };

  // ローディング状態
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="flex items-center justify-between h-14 px-4 bg-white border-b shadow-sm">
          <span className="font-bold text-lg">{currentProject?.name || 'システム設計アシスタント'}</span>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">データを読み込み中...</p>
          </div>
        </main>
      </div>
    );
  }

  // プロジェクトが選択されていない場合
  if (!currentProject) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="flex items-center justify-between h-14 px-4 bg-white border-b shadow-sm">
          <span className="font-bold text-lg">システム設計アシスタント</span>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg mb-2">プロジェクトが選択されていません</div>
            <div className="text-sm text-gray-500">プロジェクトを選択してください</div>
          </div>
        </main>
      </div>
    );
  }

  // フェーズデータが空の場合
  if (phasesWithData.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="flex items-center justify-between h-14 px-4 bg-white border-b shadow-sm">
          <span className="font-bold text-lg">{currentProject?.name || 'システム設計アシスタント'}</span>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg mb-2">フェーズデータが見つかりません</div>
            <div className="text-sm text-gray-500">プロジェクトにフェーズが設定されていない可能性があります</div>
          </div>
        </main>
      </div>
    );
  }

  // 現在のフェーズが取得できない場合
  if (!currentPhase) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="flex items-center justify-between h-14 px-4 bg-white border-b shadow-sm">
          <span className="font-bold text-lg">{currentProject?.name || 'システム設計アシスタント'}</span>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg mb-2">フェーズの読み込みに失敗しました</div>
            <div className="text-sm text-gray-500">ページを再読み込みしてください</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 通知 */}
      {notification && (
        <MobileNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* ヘッダー */}
      <header className="flex items-center justify-between h-14 px-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">{currentProject?.name || 'システム設計アシスタント'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setUnifiedModalOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* メイン */}
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        {activeView === "phase" && currentPhase && (
          <>
            <MobilePhaseOverview phase={currentPhase} />
            <MobileTaskManager
              phase={currentPhase}
              onTaskUpdate={handleTaskUpdate}
            />
            <MobileDeliverableTracker
              phase={currentPhase}
              onStatusUpdate={handleDeliverableUpdate}
            />
          </>
        )}
        {activeView === "templates" && <MobileTemplates />}
        {activeView === "guide" && <MobileGuide />}
        {activeView === "documents" && <MobileDocumentManager />}
        {activeView === "settings" && <MobileSettings />}
        {activeView === "deliverables-checklist" && (
          <MobileDeliverablesChecklist 
            phaseData={Object.fromEntries(phasesWithData.map(phase => [phase.id, phase]))} 
            onCheck={handleDeliverableCheck} 
          />
        )}
        {activeView === "project-members" && (
          <div className="text-center py-8">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">プロジェクトメンバー</h3>
            <p className="text-gray-600">メンバー管理機能は今後実装予定です</p>
          </div>
        )}
        {activeView === "create-project" && (
          <div className="text-center py-8">
            <Plus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">プロジェクト作成</h3>
            <p className="text-gray-600">プロジェクト作成機能は今後実装予定です</p>
          </div>
        )}
        {activeView === "switch-project" && (
          <div className="text-center py-8">
            <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">プロジェクト切り替え</h3>
            <p className="text-gray-600">プロジェクト切り替え機能は今後実装予定です</p>
          </div>
        )}
      </main>

      {/* フッター（ボトムナビゲーション） */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around items-center h-24 z-20">
        {phasesWithData.map(phase => (
          <button
            key={phase.id}
            onClick={() => { setActivePhase(phase.id); setActiveView('phase'); }}
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              activePhase === phase.id && activeView === 'phase' ? 'text-blue-600 font-bold' : 'text-gray-500'
            }`}
          >
            <span className="text-2xl">
              {phase.title === '要件定義' ? '🔍' : 
               phase.title === '基本設計' ? '📝' : 
               phase.title === '外部設計' ? '📐' : '⚙️'}
            </span>
            <span className="text-sm mt-1">{phase.title}</span>
          </button>
        ))}
      </footer>

      {/* 統一されたモーダル */}
      <MobileUnifiedModal
        isOpen={unifiedModalOpen}
        onClose={() => setUnifiedModalOpen(false)}
        onNavigateToView={handleNavigateToView}
      />
    </div>
  );
} 