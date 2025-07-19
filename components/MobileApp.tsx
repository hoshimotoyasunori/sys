import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Download, FileText, Target, Layout, Settings, Code, Search, MessageCircle, Layers } from 'lucide-react';

const phases = [
  { id: 'requirements-definition', label: '要件定義', icon: <span>🔍</span> },
  { id: 'basic-design', label: '基本設計', icon: <span>📝</span> },
  { id: 'external-design', label: '外部設計', icon: <span>📐</span> },
  { id: 'development-prep', label: '開発準備', icon: <span>⚙️</span> },
];

// 進捗サマリー
function MobilePhaseOverview({ phase }) {
  const completedTasks = phase.tasks.filter(task => task.status === 'completed').length;
  const totalTasks = phase.tasks.length;
  const completedDeliverables = phase.deliverables.filter(d => d.status === 'completed').length;
  const totalDeliverables = phase.deliverables.length;
  return (
    <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-800">進捗サマリー</span>
        </div>
        <span className="text-xs text-gray-500">{phase.title}</span>
      </div>
      <div className="flex justify-between text-sm">
        <div>
          <div className="text-gray-700">タスク</div>
          <div className="font-bold">{completedTasks}/{totalTasks} 完了</div>
        </div>
        <div>
          <div className="text-gray-700">成果物</div>
          <div className="font-bold">{completedDeliverables}/{totalDeliverables} 完了</div>
        </div>
      </div>
    </div>
  );
}

// タスク一覧
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
      <h2 className="text-base font-bold mb-2">主要タスク</h2>
      <div className="space-y-3">
        {phase.tasks.map(task => (
          <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
            <input
              type="checkbox"
              checked={task.status === 'completed'}
              onChange={() => onTaskUpdate(task.id, task.status === 'completed' ? 'not-started' : 'completed')}
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
        ))}
      </div>
    </div>
  );
}

// 成果物一覧
function MobileDeliverableTracker({ phase, onStatusUpdate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'not-started': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return '完了';
      case 'in-progress': return '進行中';
      case 'not-started': return '未着手';
      default: return '未着手';
    }
  };
  return (
    <div className="mb-6">
      <h2 className="text-base font-bold mb-2">主要成果物</h2>
      <div className="space-y-3">
        {phase.deliverables.map(deliverable => (
          <div key={deliverable.id} className="p-3 border rounded-lg bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{deliverable.title}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(deliverable.status)}`}>{getStatusLabel(deliverable.status)}</span>
            </div>
            <p className="text-xs text-gray-600">{deliverable.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">ステータス:</span>
              <select
                value={deliverable.status}
                onChange={e => onStatusUpdate(deliverable.id, e.target.value)}
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="not-started">未着手</option>
                <option value="in-progress">進行中</option>
                <option value="completed">完了</option>
              </select>
            </div>
          </div>
        ))}
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

export default function MobileApp() {
  const [activePhase, setActivePhase] = useState('requirements-definition');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState('phase'); // 'phase' | 'templates' | 'guide' | 'documents'
  const [phaseData, setPhaseData] = useState({
    'requirements-definition': {
      title: '要件定義',
      tasks: [
        { id: 't1', title: '目的・目標の明確化', description: 'プロジェクトの目的や目標を明確にする', status: 'not-started', priority: 'high' },
        { id: 't2', title: '現状分析', description: '現状業務の分析と課題特定', status: 'not-started', priority: 'high' },
        { id: 't3', title: 'ヒアリング', description: 'ユーザーヒアリングと要求収集', status: 'not-started', priority: 'medium' },
      ],
      deliverables: [
        { id: 'd1', title: '企画書', description: 'システム開発の目的や期待効果をまとめた文書', status: 'not-started' },
        { id: 'd2', title: '要件定義書', description: '機能・非機能要件を詳細に記述した文書', status: 'not-started' },
      ],
    },
    'basic-design': {
      title: '基本設計',
      tasks: [
        { id: 't1', title: 'システム構成設計', description: '全体アーキテクチャ設計', status: 'not-started', priority: 'high' },
        { id: 't2', title: 'DB設計', description: 'データベース論理・物理設計', status: 'not-started', priority: 'high' },
      ],
      deliverables: [
        { id: 'd1', title: '基本設計書', description: 'システム全体像を記述した文書', status: 'not-started' },
      ],
    },
    'external-design': {
      title: '外部設計',
      tasks: [
        { id: 't1', title: 'UI設計', description: '画面レイアウトや操作フロー設計', status: 'not-started', priority: 'medium' },
        { id: 't2', title: 'UX設計', description: 'ユーザー体験の最適化設計', status: 'not-started', priority: 'medium' },
      ],
      deliverables: [
        { id: 'd1', title: '画面設計書', description: '各画面のレイアウトや要素を記述した文書', status: 'not-started' },
      ],
    },
    'development-prep': {
      title: '開発準備',
      tasks: [
        { id: 't1', title: '環境構築', description: '開発環境のセットアップ', status: 'not-started', priority: 'high' },
        { id: 't2', title: 'コーディング規約策定', description: 'チーム内のコーディングルール策定', status: 'not-started', priority: 'medium' },
      ],
      deliverables: [
        { id: 'd1', title: '開発環境手順書', description: '開発環境のセットアップ手順書', status: 'not-started' },
      ],
    },
  });

  // タスク・成果物の状態更新
  const handleTaskUpdate = (taskId, status) => {
    setPhaseData(prev => {
      const phase = prev[activePhase];
      const newTasks = phase.tasks.map(t => t.id === taskId ? { ...t, status } : t);
      return {
        ...prev,
        [activePhase]: { ...phase, tasks: newTasks },
      };
    });
  };
  const handleDeliverableUpdate = (deliverableId, status) => {
    setPhaseData(prev => {
      const phase = prev[activePhase];
      const newDeliverables = phase.deliverables.map(d => d.id === deliverableId ? { ...d, status } : d);
      return {
        ...prev,
        [activePhase]: { ...phase, deliverables: newDeliverables },
      };
    });
  };

  // 成果物チェックリストの状態更新
  const handleDeliverableCheck = (phaseId, deliverableId, status) => {
    setPhaseData(prev => {
      const phase = prev[phaseId];
      const newDeliverables = phase.deliverables.map(d => d.id === deliverableId ? { ...d, status } : d);
      return {
        ...prev,
        [phaseId]: { ...phase, deliverables: newDeliverables },
      };
    });
  };

  // activeViewの値をデバッグ出力
  console.log('activeView:', activeView);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="flex items-center justify-between h-14 px-4 bg-white border-b shadow-sm">
        <span className="font-bold text-lg">システム設計アシスタント</span>
        <button onClick={() => setDrawerOpen(true)} className="p-2">
          <span className="text-2xl">☰</span> {/* ハンバーガー */}
        </button>
      </header>

      {/* メイン */}
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        {activeView === "phase" && (
          <>
            <MobilePhaseOverview phase={phaseData[activePhase]} />
            <MobileTaskManager
              phase={phaseData[activePhase]}
              onTaskUpdate={handleTaskUpdate}
            />
            <MobileDeliverableTracker
              phase={phaseData[activePhase]}
              onStatusUpdate={handleDeliverableUpdate}
            />
          </>
        )}
        {activeView === "templates" && <MobileTemplates />}
        {activeView === "guide" && <MobileGuide />}
        {activeView === "documents" && <MobileDocumentManager />}
        {activeView === "deliverables-checklist" && (
          <MobileDeliverablesChecklist phaseData={phaseData} onCheck={handleDeliverableCheck} />
        )}
      </main>

      {/* フッター（ボトムナビゲーション） */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around items-center h-24 z-20">
        {phases.map(phase => (
          <button
            key={phase.id}
            onClick={() => { setActivePhase(phase.id); setActiveView('phase'); }}
            className={`flex flex-col items-center justify-center flex-1 py-2 ${activePhase === phase.id && activeView === 'phase' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
          >
            <span className="text-2xl">{phase.icon}</span>
            <span className="text-sm mt-1">{phase.label}</span>
          </button>
        ))}
      </footer>

      {/* ドロワー（ハンバーガーメニュー） */}
      {drawerOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-30 flex">
          <div className="w-64 bg-white h-full shadow-lg p-6 flex flex-col">
            <button onClick={() => setDrawerOpen(false)} className="self-end mb-4 text-2xl">×</button>
            <nav className="flex flex-col gap-4">
              <button className="text-left text-base py-2" onClick={() => { setActiveView('templates'); setDrawerOpen(false); }}>テンプレート</button>
              <button className="text-left text-base py-2" onClick={() => { setActiveView('guide'); setDrawerOpen(false); }}>基本ガイド</button>
              <button className="text-left text-base py-2" onClick={() => { setActiveView('documents'); setDrawerOpen(false); }}>ドキュメント管理</button>
              <button className="text-left text-base py-2" onClick={() => { setActiveView('deliverables-checklist'); setDrawerOpen(false); }}>成果物チェック</button>
            </nav>
          </div>
          <div className="flex-1" onClick={() => setDrawerOpen(false)} />
        </div>
      )}
    </div>
  );
} 