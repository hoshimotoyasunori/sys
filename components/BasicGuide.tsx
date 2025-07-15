import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  Users, 
  Lightbulb,
  AlertTriangle,
  Clock,
  Target,
  Layers,
  MessageCircle,
  RefreshCw,
  Shield
} from 'lucide-react';

const phases = [
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

const generalPrinciples = [
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

const commonPitfalls = [
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

export function BasicGuide() {
  return (
    <div className="space-y-8">
      {/* システム開発の基本原則 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6" />
            システム開発の基本原則
          </CardTitle>
          <CardDescription>
            成功するシステム開発プロジェクトのための基本的な考え方と原則
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generalPrinciples.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <IconComponent className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="text-sm font-medium mb-2">{principle.title}</h4>
                      <p className="text-sm text-gray-600">{principle.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* フェーズ別ガイド */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            フェーズ別実行ガイド
          </CardTitle>
          <CardDescription>
            各フェーズの詳細な実行手順と成果物
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {phases.map((phase, index) => (
              <div key={phase.id} className="relative">
                {index < phases.length - 1 && (
                  <div className="absolute left-4 top-16 w-0.5 h-full bg-gray-200" />
                )}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {phase.id}
                    </div>
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{phase.title}</h3>
                      <Badge variant="outline">{phase.duration}</Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{phase.description}</p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* 主要活動 */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900">主要活動</h4>
                        <ul className="space-y-1">
                          {phase.keyActivities.map((activity, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* 成果物 */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900">主要成果物</h4>
                        <ul className="space-y-1">
                          {phase.deliverables.map((deliverable, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <FileText className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* 重要なポイント */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900">重要なポイント</h4>
                        <ul className="space-y-1">
                          {phase.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <Lightbulb className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* よくある課題と対策 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            よくある課題と対策
          </CardTitle>
          <CardDescription>
            システム開発でよく発生する問題とその解決策
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commonPitfalls.map((pitfall, index) => (
              <div key={index} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                <h4 className="text-sm font-medium text-orange-900 mb-2">{pitfall.title}</h4>
                <p className="text-sm text-orange-800 mb-3">{pitfall.description}</p>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs mt-0.5">解決策</Badge>
                  <p className="text-sm text-green-800">{pitfall.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* プロジェクト成功のチェックリスト */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            プロジェクト成功のチェックリスト
          </CardTitle>
          <CardDescription>
            各フェーズで確認すべき項目
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-3">フェーズ完了時の確認項目</h4>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  すべての成果物が作成され、レビューが完了している
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  ステークホルダーの承認が得られている
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  次フェーズの前提条件が満たされている
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  リスクや課題が特定され、対策が検討されている
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  必要な文書が整備され、チームで共有されている
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}