import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Download, 
  FileText, 
  Palette, 
  Code, 
  Clock, 
  User, 
  CheckCircle,
  Database,
  Layout,
  Settings,
  TestTube,
  GitBranch,
  FileCode,
  Monitor,
  Layers,
  Target,
  Shield,
  BarChart3,
  FileCheck,
  Workflow,
  Search,
  Users,
  MessageCircle,
  ClipboardList,
  TrendingUp
} from 'lucide-react';

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

## 1. 文書概要
### 1.1 文書の目的
本文書は、[システム名]の要件を明確化し、開発チーム全体で共有することを目的とする。

### 1.2 対象読者
- プロジェクトマネージャー
- システムアーキテクト
- 開発チーム
- テストチーム
- ユーザー代表

### 1.3 文書の構成
[文書の構成を説明]

## 2. システム概要
### 2.1 システムの目的
[システムの目的を明確に記載]

### 2.2 システムの概要
[システムの全体像を簡潔に説明]

### 2.3 システムの適用範囲
[システムが対象とする業務範囲を明確化]

## 3. 機能要件
### 3.1 機能要件一覧
| 要件ID | 機能名 | 優先度 | 概要 |
|--------|--------|--------|------|
| F001 | [機能名] | Must | [機能概要] |
| F002 | [機能名] | Should | [機能概要] |
| F003 | [機能名] | Could | [機能概要] |

### 3.2 機能要件詳細
#### 3.2.1 [機能名] (F001)
**概要**: [機能の概要]
**詳細**: [機能の詳細仕様]
**入力**: [入力データ・条件]
**処理**: [処理内容]
**出力**: [出力データ・結果]
**制約**: [制約事項]
**例外処理**: [エラー処理]

#### 3.2.2 [機能名] (F002)
[同様の形式で記載]

### 3.3 画面遷移要件
[画面遷移図や画面フロー図を挿入]

### 3.4 データ要件
#### 3.4.1 データ一覧
| データ名 | 概要 | 主要項目 | 更新頻度 |
|----------|------|----------|----------|
| [データ名] | [概要] | [項目] | [頻度] |

#### 3.4.2 データ関連図
[ER図やデータフロー図を挿入]

## 4. 非機能要件
### 4.1 性能要件
#### 4.1.1 応答時間要件
| 処理 | 目標値 | 条件 |
|------|--------|------|
| 画面表示 | 3秒以内 | 通常時 |
| 検索処理 | 5秒以内 | 1万件以下 |
| バッチ処理 | 30分以内 | 日次処理 |

#### 4.1.2 スループット要件
- 同時アクセス数: [XX]ユーザー
- 1日あたりトランザクション数: [XX]件

### 4.2 可用性要件
- 稼働率: 99.9%
- 定期メンテナンス: 月1回 2時間以内
- 障害復旧時間: 4時間以内

### 4.3 セキュリティ要件
#### 4.3.1 認証・認可
- ユーザー認証: [認証方式]
- パスワードポリシー: [ポリシー]
- セッション管理: [管理方式]

#### 4.3.2 データ保護
- データ暗号化: [暗号化方式]
- 通信暗号化: HTTPS/TLS 1.3
- バックアップ: [頻度・保存期間]

#### 4.3.3 監査・ログ
- アクセスログ: [記録内容]
- 操作ログ: [記録内容]
- ログ保存期間: [期間]

### 4.4 運用・保守要件
#### 4.4.1 運用要件
- 運用時間: [時間帯]
- 監視項目: [監視対象]
- 通知条件: [通知条件]

#### 4.4.2 保守要件
- 保守時間帯: [時間帯]
- 更新頻度: [頻度]
- データ移行: [移行方針]

### 4.5 拡張性要件
- ユーザー数拡張: [倍率]
- データ量拡張: [倍率]
- 機能拡張: [拡張性]

## 5. 制約事項
### 5.1 技術制約
[技術的な制約事項]

### 5.2 環境制約
[環境・インフラの制約事項]

### 5.3 スケジュール制約
[スケジュール上の制約事項]

### 5.4 予算制約
[予算上の制約事項]

## 6. インターフェース要件
### 6.1 外部システム連携
| 連携先システム | 連携方式 | データ形式 | 頻度 |
|----------------|----------|------------|------|
| [システム名] | [方式] | [形式] | [頻度] |

### 6.2 ユーザーインターフェース要件
[UI/UXに関する要件]

## 7. 移行要件
### 7.1 データ移行
[既存システムからのデータ移行要件]

### 7.2 運用移行
[運用体制の移行要件]

## 8. テスト要件
### 8.1 テスト方針
[テストの基本方針]

### 8.2 テスト種別
- 単体テスト: [カバレッジ・基準]
- 結合テスト: [テスト観点]
- システムテスト: [テスト観点]
- 受入テスト: [テスト観点]

## 9. 用語集
| 用語 | 定義 |
|------|------|
| [用語1] | [定義] |
| [用語2] | [定義] |

## 10. 参考資料
[参考にした資料・文献]

---
作成日: [YYYY/MM/DD]
作成者: [氏名]
レビュー者: [氏名]
承認者: [氏名]
版数: 1.0`
  },
  {
    id: 'business-flow-template',
    title: '業務フロー図テンプレート',
    description: '現状（As-Is）と将来（To-Be）の業務フローを可視化するためのテンプレート。',
    category: 'requirements-definition',
    type: 'template',
    icon: Workflow,
    difficulty: 'intermediate',
    content: `# 業務フロー分析書

## 1. 分析概要
### 1.1 分析目的
[業務フロー分析の目的を記載]

### 1.2 分析範囲
[分析対象の業務範囲を明確化]

### 1.3 分析方法
[ヒアリング、観察、文書調査等の手法]

## 2. 現状業務フロー（As-Is）
### 2.1 業務フロー概要
[現状の業務フローの全体像]

### 2.2 業務フロー詳細
#### フロー図
[フローチャートを挿入]
※記号説明
- ○: 開始/終了
- □: 処理・作業
- ◇: 判断・分岐
- □(二重線): システム処理

#### フロー説明
| ステップ | 作業内容 | 担当者 | 所要時間 | 使用ツール | 備考 |
|----------|----------|--------|----------|------------|------|
| 1 | [作業内容] | [担当者] | [時間] | [ツール] | [備考] |
| 2 | [作業内容] | [担当者] | [時間] | [ツール] | [備考] |

### 2.3 現状の課題・問題点
#### 2.3.1 効率性の課題
[作業効率、時間、コストに関する課題]
- 課題1: [詳細]
- 課題2: [詳細]

#### 2.3.2 品質の課題
[品質、精度、信頼性に関する課題]
- 課題1: [詳細]
- 課題2: [詳細]

#### 2.3.3 情報管理の課題
[情報共有、管理、セキュリティに関する課題]
- 課題1: [詳細]
- 課題2: [詳細]

### 2.4 現状分析結果
#### ボトルネック分析
[処理の遅延箇所や非効率な部分]

#### リスク分析
[業務上のリスクや問題の発生要因]

## 3. 改善方針
### 3.1 改善の基本方針
[業務改善の基本的な考え方]

### 3.2 改善目標
#### 定量目標
- 処理時間短縮: [XX]%削減
- 工数削減: [XX]時間/月
- エラー率削減: [XX]%

#### 定性目標
- [目標1]
- [目標2]

## 4. 将来業務フロー（To-Be）
### 4.1 業務フロー概要
[将来の業務フローの全体像]

### 4.2 業務フロー詳細
#### フロー図
[改善後のフローチャートを挿入]

#### フロー説明
| ステップ | 作業内容 | 担当者 | 所要時間 | システム機能 | 改善点 |
|----------|----------|--------|----------|--------------|--------|
| 1 | [作業内容] | [担当者] | [時間] | [機能] | [改善内容] |
| 2 | [作業内容] | [担当者] | [時間] | [機能] | [改善内容] |

### 4.3 システム化範囲
#### 自動化対象業務
[システムで自動化する業務を明確化]

#### 残存手作業
[システム導入後も手作業で行う業務]

### 4.4 改善効果
#### 定量効果
| 項目 | As-Is | To-Be | 改善効果 |
|------|-------|-------|----------|
| 処理時間 | [XX]時間 | [XX]時間 | [XX]%削減 |
| 人件費 | [XX]万円 | [XX]万円 | [XX]万円削減 |
| エラー率 | [XX]% | [XX]% | [XX]%削減 |

#### 定性効果
- [効果1]
- [効果2]

## 5. 移行計画
### 5.1 移行方針
[現状から将来への移行方法]

### 5.2 移行ステップ
| フェーズ | 期間 | 移行内容 | 注意点 |
|----------|------|----------|--------|
| Phase1 | [期間] | [内容] | [注意点] |
| Phase2 | [期間] | [内容] | [注意点] |

### 5.3 リスクと対策
| リスク | 影響 | 対策 |
|--------|------|------|
| [リスク1] | [影響] | [対策] |
| [リスク2] | [影響] | [対策] |

## 6. 教育・研修計画
### 6.1 研修対象者
[研修が必要な対象者を特定]

### 6.2 研修内容
[システム操作、業務手順等の研修内容]

### 6.3 研修スケジュール
[研修の実施時期とスケジュール]

## 7. 付録
### 7.1 業務フロー図記号説明
[使用する記号の説明]

### 7.2 関連資料
[参考資料や関連文書]

---
作成日: [YYYY/MM/DD]
作成者: [氏名]
確認者: [氏名]
版数: 1.0`
  },
  {
    id: 'stakeholder-interview-template',
    title: 'ステークホルダーヒアリングシート',
    description: '効果的なヒアリングを行うための質問項目と記録用のテンプレート。',
    category: 'requirements-definition',
    type: 'template',
    icon: MessageCircle,
    difficulty: 'beginner',
    content: `# ステークホルダーヒアリングシート

## ヒアリング情報
- **実施日時**: [YYYY/MM/DD HH:MM-HH:MM]
- **実施場所**: [場所]
- **ヒアリング対象者**: [氏名・所属・役職]
- **ヒアリング実施者**: [氏名]
- **記録者**: [氏名]

## 1. 基本情報
### 1.1 対象者の役割・責任
**Q1**: 現在のお仕事の内容と責任範囲を教えてください。
**A**: 

**Q2**: 新システムに期待する役割は何ですか？
**A**: 

### 1.2 現在の業務状況
**Q3**: 普段どのような業務に一番時間を費やしていますか？
**A**: 

**Q4**: 業務で使用している主なツールやシステムは何ですか？
**A**: 

## 2. 現状の課題・問題点
### 2.1 業務上の課題
**Q5**: 現在の業務で最も困っていることは何ですか？
**A**: 

**Q6**: 日常業務で無駄だと感じることや改善したいことはありますか？
**A**: 

**Q7**: 現在のシステムで不便に感じることはありますか？
**A**: 

### 2.2 情報管理の課題
**Q8**: 情報の共有や管理で困っていることはありますか？
**A**: 

**Q9**: データの入力や確認作業で時間がかかることはありますか？
**A**: 

### 2.3 コミュニケーションの課題
**Q10**: 他部署や関係者との連携で課題を感じることはありますか？
**A**: 

## 3. システムへの要望・期待
### 3.1 機能要望
**Q11**: 新しいシステムに絶対に必要だと思う機能は何ですか？
**A**: 

**Q12**: あったら便利だと思う機能はありますか？
**A**: 

**Q13**: 現在のシステムで気に入っている機能があれば教えてください。
**A**: 

### 3.2 操作性への要望
**Q14**: システムの操作で重視したいことは何ですか？（例：簡単、高速、正確等）
**A**: 

**Q15**: どのようなデバイスからシステムを使用したいですか？
**A**: 

### 3.3 性能への要望
**Q16**: システムの処理速度についてどの程度を期待しますか？
**A**: 

**Q17**: 同時に何人程度がシステムを使用すると想定されますか？
**A**: 

## 4. 運用・保守について
### 4.1 運用時間
**Q18**: システムをいつ使用しますか？（平日/休日、時間帯等）
**A**: 

**Q19**: システムが停止した場合の業務への影響はどの程度ですか？
**A**: 

### 4.2 データ管理
**Q20**: 扱うデータにセキュリティ上の配慮が必要なものはありますか？
**A**: 

**Q21**: どの程度の期間、データを保存する必要がありますか？
**A**: 

### 4.3 サポート体制
**Q22**: システムの操作で困った時、どのようなサポートを期待しますか？
**A**: 

**Q23**: 新システムの研修はどの程度必要だと思いますか？
**A**: 

## 5. 成功基準・評価指標
### 5.1 成功の定義
**Q24**: このシステムが成功したと言えるのはどのような状態ですか？
**A**: 

**Q25**: システム導入前後で何がどう変わっていれば良いと思いますか？
**A**: 

### 5.2 評価指標
**Q26**: システムの効果を測る指標として何が適切だと思いますか？
**A**: 

## 6. 制約・懸念事項
### 6.1 制約事項
**Q27**: システム導入にあたって制約や制限はありますか？
**A**: 

**Q28**: 予算や期間について何か制約はありますか？
**A**: 

### 6.2 懸念事項
**Q29**: 新システム導入について心配なことはありますか？
**A**: 

**Q30**: 現在の業務が変わることで困ることはありますか？
**A**: 

## 7. その他
### 7.1 追加要望
**Q31**: その他、システムに関してご要望やご意見はありますか？
**A**: 

### 7.2 優先順位
**Q32**: 今日お話いただいた内容で、特に重要だと思うものを3つ教えてください。
**A**: 
1. 
2. 
3. 

## 8. フォローアップ
### 8.1 次回確認事項
- [ ] [確認事項1]
- [ ] [確認事項2]
- [ ] [確認事項3]

### 8.2 追加ヒアリング
**必要性**: [要/不要]
**実施予定**: [日時]
**内容**: [ヒアリング内容]

## 9. ヒアリング実施者所見
### 9.1 重要ポイント
[ヒアリングで得られた重要な情報]

### 9.2 課題・検討事項
[さらに詳細確認が必要な事項]

### 9.3 次のアクション
[このヒアリング結果を受けて行うべき次のアクション]

---
記録日: [YYYY/MM/DD]
記録者: [氏名]
確認者: [ヒアリング対象者氏名]`
  },
  
  // 基本設計テンプレート
  {
    id: 'system-architecture-template',
    title: 'システム全体構成設計書テンプレート',
    description: 'システムアーキテクチャの基本構成を設計するためのテンプレート。レイヤー構成、技術選択、非機能要件を含む。',
    category: 'basic-design',
    type: 'document',
    icon: Layers,
    difficulty: 'intermediate',
    content: `# システム全体構成設計書

## 1. 概要
### 1.1 文書の目的
本文書は[システム名]のシステム全体構成を定義し、アーキテクチャの設計方針を明確化することを目的とする。

### 1.2 システム概要
[システムの概要を記載]

## 2. アーキテクチャ方針
### 2.1 基本方針
- **拡張性**: 将来の機能拡張に対応可能な構成
- **保守性**: 運用・保守が容易な構成
- **可用性**: 高い可用性を実現する構成
- **セキュリティ**: セキュアな構成

### 2.2 設計原則
1. **疎結合**: コンポーネント間の依存関係を最小化
2. **モジュール化**: 機能ごとに独立したモジュール構成
3. **標準技術**: 業界標準の技術を採用
4. **性能重視**: 高性能を実現する設計

## 3. システム全体構成
### 3.1 システム構成図
[システム構成図を挿入]

### 3.2 レイヤー構成
#### 3.2.1 プレゼンテーション層
**役割**: ユーザーインターフェースとユーザー操作の処理
**技術**: [フロントエンド技術]
**特徴**:
- レスポンシブデザイン対応
- アクセシビリティ対応
- SEO対応

#### 3.2.2 アプリケーション層
**役割**: ビジネスロジックの実装
**技術**: [バックエンド技術]
**特徴**:
- RESTful API提供
- 認証・認可処理
- バリデーション処理

#### 3.2.3 データアクセス層
**役割**: データベースアクセスの抽象化
**技術**: [ORM/データアクセス技術]
**特徴**:
- データベース依存性の隠蔽
- トランザクション管理
- 接続プール管理

#### 3.2.4 データ層
**役割**: データの永続化
**技術**: [データベース技術]
**特徴**:
- ACID特性の保証
- 高可用性構成
- バックアップ・復旧

## 4. 技術構成
### 4.1 技術スタック一覧
| レイヤー | 技術 | バージョン | 選定理由 |
|----------|------|------------|----------|
| フロントエンド | [技術名] | [バージョン] | [理由] |
| バックエンド | [技術名] | [バージョン] | [理由] |
| データベース | [技術名] | [バージョン] | [理由] |
| Web Server | [技術名] | [バージョン] | [理由] |
| OS | [技術名] | [バージョン] | [理由] |

### 4.2 フレームワーク・ライブラリ
#### フロントエンド
- [フレームワーク名]: [用途・選定理由]
- [ライブラリ名]: [用途・選定理由]

#### バックエンド
- [フレームワーク名]: [用途・選定理由]
- [ライブラリ名]: [用途・選定理由]

## 5. インフラ構成
### 5.1 物理構成
[物理構成図を挿入]

### 5.2 ネットワーク構成
#### 5.2.1 ネットワーク構成図
[ネットワーク構成図を挿入]

#### 5.2.2 セグメント設計
| セグメント | 用途 | IPアドレス範囲 | VLAN ID |
|------------|------|----------------|---------|
| [セグメント名] | [用途] | [IP範囲] | [VLAN] |

### 5.3 サーバー構成
#### 5.3.1 サーバー一覧
| サーバー名 | 役割 | スペック | OS | 台数 |
|------------|------|----------|----|----- |
| [サーバー名] | [役割] | [スペック] | [OS] | [台数] |

#### 5.3.2 ロードバランサー構成
[ロードバランサーの構成と設定]

### 5.4 ストレージ構成
- **データベース用**: [ストレージ仕様]
- **ファイル用**: [ストレージ仕様]
- **バックアップ用**: [ストレージ仕様]

## 6. セキュリティ設計
### 6.1 セキュリティ方針
[セキュリティの基本方針]

### 6.2 認証・認可
#### 6.2.1 認証方式
- **ユーザー認証**: [認証方式]
- **システム間認証**: [認証方式]

#### 6.2.2 認可設計
[権限管理の仕組み]

### 6.3 通信セキュリティ
- **暗号化プロトコル**: [プロトコル]
- **証明書管理**: [管理方法]

### 6.4 データ保護
- **データ暗号化**: [暗号化方式]
- **個人情報保護**: [保護方法]

## 7. 性能設計
### 7.1 性能要件
| 項目 | 目標値 | 条件 |
|------|--------|------|
| 応答時間 | [XX]秒以内 | [条件] |
| スループット | [XX]TPS | [条件] |
| 同時接続数 | [XX]ユーザー | [条件] |

### 7.2 性能対策
#### 7.2.1 フロントエンド
- [対策1]
- [対策2]

#### 7.2.2 バックエンド
- [対策1]
- [対策2]

#### 7.2.3 データベース
- [対策1]
- [対策2]

## 8. 可用性設計
### 8.1 可用性要件
- **稼働率**: [XX]%
- **復旧時間**: [XX]時間以内

### 8.2 冗長化設計
[冗長化の仕組みと構成]

### 8.3 障害対策
#### 8.3.1 障害検知
[監視・アラートの仕組み]

#### 8.3.2 自動復旧
[自動復旧の仕組み]

#### 8.3.3 手動復旧
[手動復旧の手順]

## 9. 運用設計
### 9.1 監視設計
#### 9.1.1 監視対象
| 監視項目 | 監視方法 | 閾値 | 通知先 |
|----------|----------|------|--------|
| [項目] | [方法] | [閾値] | [通知先] |

#### 9.2 ログ設計
[ログの出力方針と管理方法]

### 9.3 バックアップ設計
[バックアップの方針と手順]

## 10. 移行設計
### 10.1 移行方針
[既存システムからの移行方針]

### 10.2 移行手順
[移行の手順とスケジュール]

---
作成日: [YYYY/MM/DD]
作成者: [氏名]
レビュー者: [氏名]
承認者: [氏名]
版数: 1.0`
  },

  // 外部設計テンプレート
  {
    id: 'ui-design-template',
    title: '画面設計書テンプレート',
    description: 'ワイヤーフレーム、画面遷移図、入力検証ルールを含む包括的な画面設計テンプレート。',
    category: 'external-design',
    type: 'document',
    icon: Layout,
    difficulty: 'intermediate',
    content: `# 画面設計書

## 1. 概要
### 1.1 文書の目的
本文書は[システム名]の画面設計仕様を定義し、開発の指針とすることを目的とする。

### 1.2 対象画面
[設計対象の画面範囲]

### 1.3 設計方針
- **ユーザビリティ**: 直感的で使いやすいインターフェース
- **アクセシビリティ**: WCAG 2.1 AA準拠
- **レスポンシブ**: モバイル・タブレット・PC対応
- **一貫性**: 統一されたデザインシステム

## 2. 画面一覧
### 2.1 画面構成
| 画面ID | 画面名 | 機能概要 | 対象ユーザー | 優先度 |
|--------|--------|----------|--------------|--------|
| SCR001 | [画面名] | [機能概要] | [ユーザー種別] | [高/中/低] |
| SCR002 | [画面名] | [機能概要] | [ユーザー種別] | [高/中/低] |

### 2.2 画面遷移図
[画面遷移図を挿入]

## 3. 共通設計
### 3.1 レイアウト設計
#### 3.1.1 基本レイアウト
[基本レイアウト図を挿入]

#### 3.1.2 グリッドシステム
- **デスクトップ**: 12カラムグリッド
- **タブレット**: 8カラムグリッド  
- **モバイル**: 4カラムグリッド

#### 3.1.3 ブレークポイント
| デバイス | 画面幅 | 最適化内容 |
|----------|--------|------------|
| モバイル | ~768px | [最適化内容] |
| タブレット | 769px~1024px | [最適化内容] |
| デスクトップ | 1025px~ | [最適化内容] |

### 3.2 カラーパレット
#### 3.2.1 ブランドカラー
- **プライマリ**: #[HEX] - [用途]
- **セカンダリ**: #[HEX] - [用途]
- **アクセント**: #[HEX] - [用途]

#### 3.2.2 システムカラー
- **成功**: #[HEX] - 成功メッセージ
- **警告**: #[HEX] - 警告メッセージ
- **エラー**: #[HEX] - エラーメッセージ
- **情報**: #[HEX] - 情報メッセージ

### 3.3 タイポグラフィ
#### 3.3.1 フォント
- **メインフォント**: [フォント名]
- **サブフォント**: [フォント名]

#### 3.3.2 文字サイズ
| 用途 | サイズ | 行間 | 用途 |
|------|--------|------|------|
| h1 | 32px | 1.2 | ページタイトル |
| h2 | 24px | 1.3 | セクションタイトル |
| h3 | 20px | 1.4 | サブタイトル |
| body | 16px | 1.5 | 本文 |
| small | 14px | 1.4 | 補足テキスト |

### 3.4 コンポーネント設計
#### 3.4.1 ボタン
[ボタンの種類とスタイル]

#### 3.4.2 フォーム
[入力フィールドの種類とスタイル]

#### 3.4.3 ナビゲーション
[ナビゲーションの種類とスタイル]

## 4. 画面詳細設計
### 4.1 [画面名] (SCR001)
#### 4.1.1 画面概要
**目的**: [画面の目的]
**対象ユーザー**: [対象ユーザー]
**アクセス方法**: [アクセス経路]

#### 4.1.2 ワイヤーフレーム
[ワイヤーフレーム図を挿入]

#### 4.1.3 画面要素
| 要素ID | 要素名 | 種別 | 必須 | 説明 |
|--------|--------|------|------|------|
| E001 | [要素名] | [種別] | [○/△/-] | [説明] |
| E002 | [要素名] | [種別] | [○/△/-] | [説明] |

#### 4.1.4 入力項目詳細
##### E001: [項目名]
- **種別**: [テキスト/選択/日付等]
- **最大文字数**: [文字数]
- **入力形式**: [形式]
- **必須チェック**: [チェック内容]
- **形式チェック**: [チェック内容]
- **初期値**: [初期値]
- **プレースホルダー**: [表示文言]

#### 4.1.5 表示項目詳細
##### E002: [項目名]
- **データソース**: [データの取得元]
- **表示形式**: [表示形式]
- **更新タイミング**: [更新条件]
- **ソート**: [ソート方法]
- **フィルタ**: [フィルタ条件]

#### 4.1.6 操作・イベント
| 操作対象 | イベント | 処理内容 | 遷移先 |
|----------|----------|----------|--------|
| [ボタン名] | クリック | [処理内容] | [遷移先] |
| [フィールド名] | 入力 | [処理内容] | - |

#### 4.1.7 エラーハンドリング
| エラー条件 | エラーメッセージ | 表示位置 | 対処方法 |
|------------|------------------|----------|----------|
| [条件] | [メッセージ] | [位置] | [対処法] |

#### 4.1.8 権限制御
| ユーザー種別 | 参照 | 追加 | 更新 | 削除 |
|--------------|------|------|------|------|
| [種別1] | ○ | ○ | ○ | × |
| [種別2] | ○ | × | × | × |

#### 4.1.9 レスポンシブ対応
##### モバイル表示
[モバイル時の表示方法]

##### タブレット表示
[タブレット時の表示方法]

## 5. 画面遷移仕様
### 5.1 遷移パターン
[画面遷移のパターンと条件]

### 5.2 パンくずリスト
[パンくずリストの表示仕様]

### 5.3 戻る・進む操作
[ブラウザの戻る・進むボタンの動作]

## 6. 操作性・UX設計
### 6.1 キーボード操作
[キーボードでの操作方法]

### 6.2 マウス操作
[マウスでの操作方法]

### 6.3 タッチ操作
[タッチデバイスでの操作方法]

### 6.4 ローディング表示
[読み込み中の表示方法]

### 6.5 プログレス表示
[進捗状況の表示方法]

## 7. アクセシビリティ
### 7.1 対応方針
[アクセシビリティ対応の方針]

### 7.2 スクリーンリーダー対応
[スクリーンリーダーへの対応]

### 7.3 キーボードナビゲーション
[キーボードでのナビゲーション]

## 8. 性能・表示速度
### 8.1 表示速度要件
[画面表示速度の要件]

### 8.2 最適化方針
[表示速度最適化の方針]

## 9. テスト観点
### 9.1 表示テスト
[表示確認のテスト項目]

### 9.2 操作テスト
[操作確認のテスト項目]

### 9.3 レスポンシブテスト
[レスポンシブ対応のテスト項目]

---
作成日: [YYYY/MM/DD]
作成者: [氏名]
デザイナー: [氏名]
レビュー者: [氏名]
版数: 1.0`
  },

  // 開発準備テンプレート
  {
    id: 'coding-standards',
    title: 'コーディング規約テンプレート',
    description: 'JavaScript/TypeScript、Python、Java等の言語別コーディング規約テンプレート。',
    category: 'development-prep',
    type: 'document',
    icon: FileCode,
    difficulty: 'beginner',
    content: `# コーディング規約

## 1. 概要
### 1.1 目的
本規約は、開発チーム全体でコードの品質と可読性を保つことを目的とする。

### 1.2 適用範囲
- プロジェクト: [プロジェクト名]
- 対象言語: [対象言語]
- 対象者: 開発チーム全員

### 1.3 基本方針
- **可読性**: 理解しやすいコード
- **保守性**: 変更・修正しやすいコード
- **一貫性**: 統一されたスタイル
- **効率性**: パフォーマンスを考慮したコード

## 2. ファイル構成・命名規則
### 2.1 ディレクトリ構成
\`\`\`
src/
├── components/          # コンポーネント
├── pages/              # ページ
├── hooks/              # カスタムフック
├── utils/              # ユーティリティ
├── types/              # 型定義
├── constants/          # 定数
├── api/                # API関連
├── styles/             # スタイル
└── tests/              # テスト
\`\`\`

### 2.2 ファイル命名規則
| 種類 | 命名規則 | 例 |
|------|----------|-----|
| コンポーネント | PascalCase | \`UserProfile.tsx\` |
| ページ | kebab-case | \`user-profile.tsx\` |
| ユーティリティ | camelCase | \`dateUtils.ts\` |
| 定数 | UPPER_SNAKE_CASE | \`API_ENDPOINTS.ts\` |
| 型定義 | PascalCase | \`UserTypes.ts\` |

### 2.3 変数・関数命名規則
#### 2.3.1 変数名
- **camelCase**を使用
- 意味のある名前を付ける
- 略語は避ける

\`\`\`typescript
// ✅ Good
const userName = 'john_doe';
const userAge = 25;
const isUserActive = true;

// ❌ Bad
const un = 'john_doe';
const a = 25;
const flag = true;
\`\`\`

#### 2.3.2 関数名
- **camelCase**を使用
- 動詞から始める
- 何をする関数か明確にする

\`\`\`typescript
// ✅ Good
function getUserProfile(userId: string): UserProfile {}
function validateEmail(email: string): boolean {}
function calculateTotalPrice(items: Item[]): number {}

// ❌ Bad
function user(id: string): UserProfile {}
function check(email: string): boolean {}
function total(items: Item[]): number {}
\`\`\`

#### 2.3.3 定数名
- **UPPER_SNAKE_CASE**を使用
- 意味のある名前を付ける

\`\`\`typescript
// ✅ Good
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT = 5000;

// ❌ Bad
const max = 3;
const url = 'https://api.example.com';
const timeout = 5000;
\`\`\`

## 3. TypeScript/JavaScript 規約
### 3.1 型定義
#### 3.1.1 基本的な型定義
\`\`\`typescript
// インターフェース定義
interface User {
  id: string;
  name: string;
  email: string;
  age?: number; // オプショナル
}

// 型エイリアス
type Status = 'pending' | 'approved' | 'rejected';
type UserRole = 'admin' | 'user' | 'guest';
\`\`\`

#### 3.1.2 Generics の使用
\`\`\`typescript
// ✅ Good
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  // 実装
}

// 使用例
const users = await fetchData<User[]>('/api/users');
\`\`\`

### 3.2 関数・メソッド
#### 3.2.1 Arrow Function vs Function Declaration
\`\`\`typescript
// ✅ コンポーネント: Arrow Function
const UserProfile: React.FC<Props> = ({ user }) => {
  return <div>{user.name}</div>;
};

// ✅ ユーティリティ関数: Function Declaration
function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

// ✅ イベントハンドラー: Arrow Function
const handleClick = useCallback((event: MouseEvent) => {
  // 処理
}, []);
\`\`\`

#### 3.2.2 async/await の使用
\`\`\`typescript
// ✅ Good
async function fetchUserData(userId: string): Promise<User> {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// ❌ Bad - Promise chain
function fetchUserData(userId: string): Promise<User> {
  return fetch(\`/api/users/\${userId}\`)
    .then(response => response.json())
    .catch(error => console.error(error));
}
\`\`\`

### 3.3 条件分岐・ループ
#### 3.3.1 条件分岐
\`\`\`typescript
// ✅ Good - Early Return
function validateUser(user: User): boolean {
  if (!user.email) {
    return false;
  }
  
  if (!user.name) {
    return false;
  }
  
  return true;
}

// ✅ Good - Optional Chaining
const userName = user?.profile?.name ?? 'Unknown';

// ✅ Good - Nullish Coalescing
const timeout = config.timeout ?? DEFAULT_TIMEOUT;
\`\`\`

#### 3.3.2 配列操作
\`\`\`typescript
// ✅ Good - map, filter, reduce の活用
const activeUsers = users
  .filter(user => user.isActive)
  .map(user => ({
    id: user.id,
    name: user.name,
    email: user.email
  }));

// ✅ Good - 分割代入
const [first, second, ...rest] = items;
const { name, email } = user;
\`\`\`

## 4. React/Next.js 規約
### 4.1 コンポーネント設計
#### 4.1.1 関数コンポーネント
\`\`\`typescript
// ✅ Good
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && <button onClick={() => onEdit(user)}>Edit</button>}
      {onDelete && <button onClick={() => onDelete(user.id)}>Delete</button>}
    </div>
  );
};
\`\`\`

#### 4.1.2 Hooks の使用
\`\`\`typescript
// ✅ Good - カスタムフック
function useUserData(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await fetchUserData(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return { user, loading, error };
}
\`\`\`

### 4.2 State 管理
\`\`\`typescript
// ✅ Good - useReducer for complex state
interface State {
  users: User[];
  loading: boolean;
  error: string | null;
}

type Action = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: User[] }
  | { type: 'FETCH_ERROR'; payload: string };

function userReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
\`\`\`

## 5. エラーハンドリング
### 5.1 エラーの種類と対応
\`\`\`typescript
// カスタムエラークラス
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// エラーハンドリング
async function apiCall<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new ApiError(
        'API request failed',
        response.status,
        'API_ERROR'
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      // API エラーの処理
      throw error;
    } else {
      // その他のエラー
      throw new Error('Unexpected error occurred');
    }
  }
}
\`\`\`

## 6. コメント・ドキュメント
### 6.1 JSDoc
\`\`\`typescript
/**
 * ユーザーデータを取得する
 * @param userId - ユーザーID
 * @param includeProfile - プロフィール情報を含めるかどうか
 * @returns ユーザーデータ
 * @throws {ApiError} API呼び出しに失敗した場合
 */
async function fetchUser(
  userId: string, 
  includeProfile = false
): Promise<User> {
  // 実装
}
\`\`\`

### 6.2 インラインコメント
\`\`\`typescript
// ✅ Good - why not what
// XSS攻撃を防ぐためにHTMLエスケープを行う
const escapedHtml = escapeHtml(userInput);

// ブラウザの互換性のため setTimeout を使用
// requestAnimationFrame は IE10以下で未対応
setTimeout(callback, 0);

// ❌ Bad - what not why
// ユーザー名を取得
const name = user.name;
\`\`\`

## 7. テスト
### 7.1 テストファイル命名
\`\`\`
src/
├── utils/
│   ├── dateUtils.ts
│   └── dateUtils.test.ts
├── components/
│   ├── UserCard.tsx
│   └── UserCard.test.tsx
\`\`\`

### 7.2 テストの書き方
\`\`\`typescript
describe('UserCard', () => {
  it('should render user name and email', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    render(<UserCard user={user} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
  
  it('should call onEdit when edit button is clicked', () => {
    const user = { id: '1', name: 'John', email: 'john@example.com' };
    const onEdit = jest.fn();
    
    render(<UserCard user={user} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText('Edit'));
    
    expect(onEdit).toHaveBeenCalledWith(user);
  });
});
\`\`\`

## 8. パフォーマンス
### 8.1 React最適化
\`\`\`typescript
// ✅ memo for expensive components
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});

// ✅ useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ✅ useCallback for event handlers
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
\`\`\`

## 9. セキュリティ
### 9.1 基本原則
\`\`\`typescript
// ✅ 入力値の検証
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ✅ XSS対策
import DOMPurify from 'dompurify';

function SafeHtml({ html }: { html: string }) {
  const cleanHtml = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}

// ✅ 環境変数の使用
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
\`\`\`

## 10. Linter・Formatter設定
### 10.1 ESLint設定例
\`\`\`json
{
  "extends": [
    "@typescript-eslint/recommended",
    "next/core-web-vitals"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-console": "warn"
  }
}
\`\`\`

### 10.2 Prettier設定例
\`\`\`json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
\`\`\`

---
作成日: [YYYY/MM/DD]
作成者: [氏名]
レビュー者: [氏名]
版数: 1.0`
  },

  // 共通テンプレート
  {
    id: 'meeting-minutes',
    title: '会議議事録テンプレート',
    description: '設計レビュー、進捗報告、課題管理等の会議で使用する議事録テンプレート。',
    category: 'common',
    type: 'template',
    icon: User,
    difficulty: 'beginner',
    content: `# 会議議事録

## 会議基本情報
- **会議名**: [会議名]
- **開催日時**: [YYYY/MM/DD HH:MM-HH:MM]
- **開催場所**: [場所 / オンライン（ツール名）]
- **司会**: [氏名]
- **記録**: [氏名]

## 参加者
### 出席者
| 氏名 | 所属・役職 | 備考 |
|------|------------|------|
| [氏名] | [所属・役職] | [備考] |
| [氏名] | [所属・役職] | [備考] |

### 欠席者
| 氏名 | 所属・役職 | 欠席理由 |
|------|------------|----------|
| [氏名] | [所属・役職] | [理由] |

## 会議の目的・議題
### 目的
[会議の目的を記載]

### 議題
1. [議題1]
2. [議題2]
3. [議題3]

## 配布資料
- [資料名1] - [作成者]
- [資料名2] - [作成者]
- [資料名3] - [作成者]

## 前回議事録確認
### 前回のアクションアイテム進捗
| 項目 | 担当者 | 期限 | 状況 | 備考 |
|------|--------|------|------|------|
| [項目] | [担当者] | [期限] | [完了/進行中/未着手] | [備考] |

## 討議内容・決定事項
### 議題1: [議題名]
#### 討議内容
[討議の内容を詳細に記載]

#### 決定事項
- [決定事項1]
- [決定事項2]

#### 残課題・懸念事項
- [課題1]
- [課題2]

### 議題2: [議題名]
#### 討議内容
[討議の内容を詳細に記載]

#### 決定事項
- [決定事項1]
- [決定事項2]

#### 残課題・懸念事項
- [課題1]
- [課題2]

## アクションアイテム
| No | 内容 | 担当者 | 期限 | 確認方法 | 優先度 |
|----|------|--------|------|----------|--------|
| 1 | [アクション内容] | [担当者] | [YYYY/MM/DD] | [確認方法] | [高/中/低] |
| 2 | [アクション内容] | [担当者] | [YYYY/MM/DD] | [確認方法] | [高/中/低] |

## 次回会議
- **開催予定日**: [YYYY/MM/DD HH:MM-HH:MM]
- **議題予定**: 
  1. [予定議題1]
  2. [予定議題2]
- **準備事項**: [準備が必要な事項]

## その他・補足事項
[その他の重要な情報や補足事項]

## 添付資料
- [添付資料1]
- [添付資料2]

---
**記録者確認**: [記録者氏名] [確認日: YYYY/MM/DD]
**司会者確認**: [司会者氏名] [確認日: YYYY/MM/DD]
**配布先**: [配布先一覧]
**配布日**: [YYYY/MM/DD]`
  }
];

const categoryLabels = {
  'requirements-definition': '要件定義',
  'basic-design': '基本設計',
  'external-design': '外部設計',
  'development-prep': '開発準備',
  'common': '共通'
};

const categoryIcons = {
  'requirements-definition': Search,
  'basic-design': FileText,
  'external-design': Palette,
  'development-prep': Code,
  'common': Settings
};

const difficultyColors = {
  'beginner': 'bg-green-100 text-green-800',
  'intermediate': 'bg-yellow-100 text-yellow-800',
  'advanced': 'bg-red-100 text-red-800'
};

const difficultyLabels = {
  'beginner': '初級',
  'intermediate': '中級',
  'advanced': '上級'
};

const typeIcons = {
  'document': FileText,
  'checklist': CheckCircle,
  'template': Layout
};

export function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredTemplates = templates.filter(template => {
    const categoryMatch = selectedCategory === 'all' || template.category === selectedCategory;
    const typeMatch = selectedType === 'all' || template.type === selectedType;
    return categoryMatch && typeMatch;
  });

  const handleDownload = (template: Template) => {
    const blob = new Blob([template.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`Downloaded: ${template.title}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">テンプレート一覧</h1>
        <p className="text-gray-600">
          システム開発で使用できるテンプレートをダウンロードできます。各フェーズに応じたテンプレートをご利用ください。
        </p>
      </div>

      {/* フィルター */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">カテゴリ:</span>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべて</option>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">タイプ:</span>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべて</option>
            <option value="document">文書</option>
            <option value="checklist">チェックリスト</option>
            <option value="template">テンプレート</option>
          </select>
        </div>
      </div>

      {/* テンプレート一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const IconComponent = template.icon;
          const CategoryIcon = categoryIcons[template.category];
          const TypeIcon = typeIcons[template.type];
          
          return (
            <Card key={template.id} className="rounded-2xl border-gray-200 hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {categoryLabels[template.category]}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TypeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">{template.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-lg line-clamp-2 flex-1 min-w-0">{template.title}</CardTitle>
                  <Badge 
                    variant={
                      template.difficulty === 'beginner' ? 'secondary' :
                      template.difficulty === 'intermediate' ? 'default' : 'destructive'
                    }
                    className="text-xs flex-shrink-0"
                  >
                    {template.difficulty === 'beginner' ? '初級' :
                     template.difficulty === 'intermediate' ? '中級' : '上級'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {template.description}
                </CardDescription>
                

                
                <Button 
                  onClick={() => handleDownload(template)}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  ダウンロード
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">テンプレートが見つかりません</h3>
          <p className="text-gray-600">別のフィルター条件を試してください。</p>
        </div>
      )}
    </div>
  );
}