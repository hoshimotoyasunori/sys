import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Download, FileText, FileSpreadsheet, FileCode, File } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  type: 'document' | 'spreadsheet' | 'code' | 'markdown';
  content: string;
  filename: string;
}

interface DownloadableTemplatesProps {
  phaseId: string;
}

const templates: Record<string, Template[]> = {
  'basic-design': [
    {
      id: 'basic-design-doc',
      name: '基本設計書テンプレート',
      description: 'システム全体構成、データベース設計、機能概要を記述するテンプレート',
      type: 'document',
      filename: '基本設計書テンプレート.md',
      content: `# 基本設計書

## 1. 文書概要
- **作成日**: ${new Date().toLocaleDateString('ja-JP')}
- **作成者**: [作成者名]
- **バージョン**: 1.0
- **承認者**: [承認者名]

## 2. プロジェクト概要
### 2.1 プロジェクト名
[プロジェクト名を記述]

### 2.2 プロジェクトの目的
[プロジェクトの目的と背景を記述]

### 2.3 対象システム
[対象となるシステムの概要を記述]

## 3. システム全体構成
### 3.1 システム構成概要
[システム全体のアーキテクチャを記述]

### 3.2 技術スタック
- **フロントエンド**: [使用技術]
- **バックエンド**: [使用技術]
- **データベース**: [使用技術]
- **インフラストラクチャ**: [使用技術]

### 3.3 システム構成図
[システム構成図を挿入]

## 4. データベース設計
### 4.1 論理設計
#### 4.1.1 ER図
[ER図を挿入]

#### 4.1.2 テーブル一覧
| テーブル名 | 論理名 | 説明 |
|-----------|--------|------|
| [テーブル名] | [論理名] | [説明] |

### 4.2 物理設計
#### 4.2.1 テーブル定義
##### [テーブル名]
| カラム名 | データ型 | NULL | デフォルト値 | 説明 |
|----------|----------|------|-------------|------|
| [カラム名] | [データ型] | [NULL可否] | [デフォルト値] | [説明] |

#### 4.2.2 インデックス設計
| テーブル名 | インデックス名 | カラム | 種別 | 説明 |
|-----------|---------------|--------|------|------|
| [テーブル名] | [インデックス名] | [カラム] | [種別] | [説明] |

## 5. 機能設計
### 5.1 機能一覧
| 機能ID | 機能名 | 概要 | 優先度 |
|--------|--------|------|--------|
| [機能ID] | [機能名] | [概要] | [優先度] |

### 5.2 機能詳細
#### 5.2.1 [機能名]
- **機能概要**: [機能の概要]
- **入力**: [入力項目]
- **処理**: [処理内容]
- **出力**: [出力項目]
- **例外処理**: [例外処理]

## 6. 外部インターフェース設計
### 6.1 外部システム連携一覧
| 連携先システム | 連携方式 | データ形式 | 頻度 | 説明 |
|---------------|----------|-----------|------|------|
| [システム名] | [連携方式] | [データ形式] | [頻度] | [説明] |

### 6.2 API設計
#### 6.2.1 [API名]
- **URL**: [エンドポイント]
- **メソッド**: [HTTPメソッド]
- **リクエスト形式**: [形式]
- **レスポンス形式**: [形式]

## 7. 非機能要件
### 7.1 性能要件
- **レスポンス時間**: [要件]
- **スループット**: [要件]
- **同時接続数**: [要件]

### 7.2 セキュリティ要件
- **認証方式**: [方式]
- **認可方式**: [方式]
- **暗号化**: [要件]

### 7.3 可用性要件
- **稼働率**: [要件]
- **保守時間**: [要件]

### 7.4 拡張性要件
- **スケーラビリティ**: [要件]
- **拡張性**: [要件]

## 8. 制約事項
### 8.1 技術的制約
[技術的な制約事項を記述]

### 8.2 運用制約
[運用上の制約事項を記述]

## 9. リスクと対策
| リスク | 影響度 | 発生確率 | 対策 |
|--------|--------|----------|------|
| [リスク] | [影響度] | [発生確率] | [対策] |

## 10. 付録
### 10.1 用語集
| 用語 | 説明 |
|------|------|
| [用語] | [説明] |

### 10.2 参考資料
- [資料名]: [URL または場所]
`
    },
    {
      id: 'database-design',
      name: 'データベース設計シート',
      description: 'テーブル定義、ER図、インデックス設計を整理するスプレッドシート形式',
      type: 'spreadsheet',
      filename: 'データベース設計シート.csv',
      content: `テーブル名,論理名,説明,作成日,更新日
users,ユーザー,システムのユーザー情報を管理,${new Date().toLocaleDateString('ja-JP')},${new Date().toLocaleDateString('ja-JP')}

カラム名,データ型,サイズ,NULL可否,デフォルト値,説明,備考
id,INTEGER,,NOT NULL,,ユーザーID（主キー）,AUTO_INCREMENT
username,VARCHAR,50,NOT NULL,,ユーザー名,UNIQUE制約
email,VARCHAR,255,NOT NULL,,メールアドレス,UNIQUE制約
password_hash,VARCHAR,255,NOT NULL,,パスワードハッシュ,
created_at,TIMESTAMP,,NOT NULL,CURRENT_TIMESTAMP,作成日時,
updated_at,TIMESTAMP,,NOT NULL,CURRENT_TIMESTAMP,更新日時,ON UPDATE CURRENT_TIMESTAMP

インデックス名,テーブル名,カラム,種別,説明
PRIMARY,users,id,PRIMARY KEY,主キー
idx_username,users,username,UNIQUE,ユーザー名による検索
idx_email,users,email,UNIQUE,メールアドレスによる検索
`
    },
    {
      id: 'system-architecture',
      name: 'システム構成図テンプレート',
      description: 'システム構成図を作成するためのテンプレート',
      type: 'document',
      filename: 'システム構成図テンプレート.md',
      content: `# システム構成図テンプレート

## 1. 概要
このテンプレートは、システム構成図を作成する際のガイドラインを提供します。

## 2. 構成要素
### 2.1 クライアント層
\`\`\`
[Webブラウザ] --> [ロードバランサー]
[モバイルアプリ] --> [ロードバランサー]
\`\`\`

### 2.2 プレゼンテーション層
\`\`\`
[ロードバランサー] --> [Webサーバー1]
[ロードバランサー] --> [Webサーバー2]
\`\`\`

### 2.3 アプリケーション層
\`\`\`
[Webサーバー] --> [アプリケーションサーバー1]
[Webサーバー] --> [アプリケーションサーバー2]
\`\`\`

### 2.4 データアクセス層
\`\`\`
[アプリケーションサーバー] --> [データベースサーバー]
[アプリケーションサーバー] --> [キャッシュサーバー]
\`\`\`

## 3. 推奨ツール
- **Draw.io**: 無料のオンライン図表作成ツール
- **Lucidchart**: プロフェッショナルな図表作成ツール
- **PlantUML**: テキストベースの図表作成
- **Visio**: Microsoft製の図表作成ツール

## 4. 記載項目
- サーバー名/役割
- IPアドレス/ポート番号
- プロトコル
- データフロー
- 冗長化構成
- セキュリティ境界
`
    }
  ],
  'external-design': [
    {
      id: 'screen-design-doc',
      name: '画面設計書テンプレート',
      description: '画面レイアウト、UI要素、操作フローを定義するテンプレート',
      type: 'document',
      filename: '画面設計書テンプレート.md',
      content: `# 画面設計書

## 1. 文書概要
- **作成日**: ${new Date().toLocaleDateString('ja-JP')}
- **作成者**: [作成者名]
- **バージョン**: 1.0
- **対象システム**: [システム名]

## 2. 画面一覧
| 画面ID | 画面名 | URL | 説明 | 優先度 |
|--------|--------|-----|------|--------|
| SCR001 | ログイン画面 | /login | ユーザーログイン | 高 |
| SCR002 | ダッシュボード | /dashboard | メイン画面 | 高 |
| SCR003 | ユーザー一覧 | /users | ユーザー管理 | 中 |

## 3. 画面設計詳細

### 3.1 [画面名] (画面ID: [画面ID])

#### 3.1.1 画面概要
**目的**: [画面の目的]
**対象ユーザー**: [対象となるユーザー]
**アクセス権**: [必要な権限]

#### 3.1.2 画面レイアウト
\`\`\`
+----------------------------------+
|           ヘッダー              |
+----------------------------------+
| サイドバー |    メインコンテンツ  |
|           |                     |
|           |                     |
+----------------------------------+
|           フッター              |
+----------------------------------+
\`\`\`

#### 3.1.3 画面要素
| 要素ID | 要素名 | 種別 | 必須 | 初期値 | 説明 |
|--------|--------|------|------|--------|------|
| txt_username | ユーザー名 | テキストボックス | ○ | - | ログイン用ユーザー名 |
| txt_password | パスワード | パスワードボックス | ○ | - | ログイン用パスワード |
| btn_login | ログインボタン | ボタン | ○ | - | ログイン実行 |

#### 3.1.4 入力規則
| 項目 | 入力規則 | エラーメッセージ |
|------|----------|------------------|
| ユーザー名 | 半角英数字、4-20文字 | ユーザー名は半角英数字4-20文字で入力してください |
| パスワード | 半角英数字記号、8文字以上 | パスワードは8文字以上で入力してください |

#### 3.1.5 画面操作フロー
1. ユーザーがユーザー名を入力
2. ユーザーがパスワードを入力
3. ログインボタンをクリック
4. 入力値検証
5. 認証処理
6. 成功時：ダッシュボードにリダイレクト
7. 失敗時：エラーメッセージを表示

#### 3.1.6 表示条件・制御
| 条件 | 表示/非表示 | 有効/無効 |
|------|-------------|-----------|
| 初期表示 | 全要素表示 | 全要素有効 |
| 入力中 | 全要素表示 | 全要素有効 |
| 処理中 | 全要素表示 | 入力項目無効 |

#### 3.1.7 エラーハンドリング
| エラーケース | エラーメッセージ | 表示場所 |
|-------------|------------------|----------|
| 必須入力未入力 | [項目名]は必須入力です | 項目下部 |
| 認証失敗 | ユーザー名またはパスワードが正しくありません | 画面上部 |
| システムエラー | システムエラーが発生しました | 画面上部 |

#### 3.1.8 関連画面
- **前画面**: [画面名]
- **次画面**: [画面名]
- **関連画面**: [画面名]

## 4. 共通仕様

### 4.1 レスポンシブデザイン
| デバイス | ブレークポイント | レイアウト |
|----------|------------------|-----------|
| モバイル | 〜768px | 1カラム |
| タブレット | 769px〜1024px | 2カラム |
| デスクトップ | 1025px〜 | 3カラム |

### 4.2 カラーパレット
- **プライマリ**: #007bff
- **セカンダリ**: #6c757d
- **成功**: #28a745
- **警告**: #ffc107
- **エラー**: #dc3545

### 4.3 フォント
- **見出し**: Noto Sans JP Bold
- **本文**: Noto Sans JP Regular
- **コード**: Consolas, Monaco

## 5. アクセシビリティ
- WAI-ARIA準拠
- キーボードナビゲーション対応
- スクリーンリーダー対応
- コントラスト比4.5:1以上

## 6. ブラウザ対応
| ブラウザ | バージョン | 対応レベル |
|----------|-----------|-----------|
| Chrome | 最新-2 | 完全対応 |
| Firefox | 最新-2 | 完全対応 |
| Safari | 最新-2 | 完全対応 |
| Edge | 最新-2 | 完全対応 |
`
    },
    {
      id: 'wireframe-template',
      name: 'ワイヤーフレームテンプレート',
      description: 'ワイヤーフレーム作成のガイドライン',
      type: 'document',
      filename: 'ワイヤーフレームテンプレート.md',
      content: `# ワイヤーフレームテンプレート

## 1. ワイヤーフレーム作成ガイド

### 1.1 目的
- レイアウトの構造を明確にする
- コンテンツの優先順位を決める
- ユーザーフローを可視化する
- 開発前の認識合わせを行う

### 1.2 作成手順
1. **情報設計**: コンテンツの整理と優先順位付け
2. **レイアウト設計**: 要素の配置と構造の決定
3. **ユーザーフロー**: 画面間の遷移を設計
4. **詳細化**: 具体的な要素とサイズを決定

## 2. 推奨ツール

### 2.1 デザインツール
- **Figma**: 協業に優れたWebベースツール
- **Adobe XD**: Adobeの統合環境
- **Sketch**: Mac専用の定番ツール
- **Balsamiq**: 手書き風の簡易ツール

### 2.2 プロトタイピングツール
- **InVision**: インタラクティブプロトタイプ
- **Marvel**: シンプルなプロトタイピング
- **Principle**: アニメーション重視

## 3. ワイヤーフレーム要素

### 3.1 基本要素
\`\`\`
[ロゴ/ブランド名]    [ナビゲーション]     [検索ボックス]

+-- サイドバー --+  +-- メインコンテンツ --+
| [ナビ項目1]    |  | [見出し]             |
| [ナビ項目2]    |  | [本文テキスト]        |
| [ナビ項目3]    |  | [画像プレースホルダー] |
+---------------+  | [ボタン]             |
                   +--------------------+

[フッター情報]
\`\`\`

### 3.2 グリッドシステム
- **12カラムグリッド**: デスクトップ
- **8カラムグリッド**: タブレット
- **4カラムグリッド**: モバイル

### 3.3 コンポーネント一覧
| コンポーネント | 説明 | 使用場面 |
|---------------|------|----------|
| ヘッダー | サイトの共通ヘッダー | 全ページ |
| ナビゲーション | メインナビゲーション | 全ページ |
| フッター | サイトの共通フッター | 全ページ |
| カード | コンテンツのグループ化 | 一覧ページ |
| モーダル | 追加情報の表示 | 詳細表示 |

## 4. レスポンシブ考慮事項

### 4.1 ブレークポイント
- **Mobile**: 〜768px
- **Tablet**: 769px〜1024px
- **Desktop**: 1025px〜

### 4.2 レイアウトパターン
| パターン | 説明 | 適用場面 |
|----------|------|----------|
| Stacked | 縦積みレイアウト | モバイル |
| Sidebar | サイドバー付き | デスクトップ |
| Grid | グリッドレイアウト | 一覧表示 |

## 5. ユーザビリティチェックリスト

### 5.1 ナビゲーション
- [ ] 現在位置が分かる
- [ ] 主要機能に2クリック以内でアクセス可能
- [ ] 戻るボタンの位置が一貫している

### 5.2 コンテンツ
- [ ] 重要な情報が目立つ位置にある
- [ ] 読みやすいフォントサイズ
- [ ] 適切な行間・余白

### 5.3 操作性
- [ ] ボタンが十分な大きさ
- [ ] タップしやすい間隔
- [ ] フィードバックが明確

## 6. テンプレート例

### 6.1 ランディングページ
\`\`\`
+----------------------------------------+
|  [ロゴ]        [ナビ]        [CTA]   |
+----------------------------------------+
|                                        |
|         [メインビジュアル]              |
|         [キャッチコピー]                |
|         [サブコピー]                    |
|         [CTAボタン]                     |
|                                        |
+----------------------------------------+
| [特徴1]     [特徴2]     [特徴3]        |
+----------------------------------------+
|              [詳細説明]                 |
+----------------------------------------+
|        [お客様の声/事例]                |
+----------------------------------------+
|            [FAQ]                      |
+----------------------------------------+
|      [最終CTA]                        |
+----------------------------------------+
|        [フッター]                      |
+----------------------------------------+
\`\`\`

### 6.2 管理画面
\`\`\`
+-- ヘッダー ---------------------------+
| [ロゴ] [ユーザー情報] [ログアウト]      |
+---------------------------------------+
| サイド  |        メインコンテンツ      |
| バー   |                             |
| [メニュー1] | [パンくず]                 |
| [メニュー2] | [ページタイトル]            |
| [メニュー3] | [検索・フィルター]          |
|        | [データテーブル]            |
|        | [ページネーション]          |
+--------+----------------------------+
\`\`\`
`
    },
    {
      id: 'ui-guidelines',
      name: 'UI/UXガイドライン',
      description: 'UIコンポーネントとデザインシステムのガイドライン',
      type: 'document',
      filename: 'UI_UXガイドライン.md',
      content: `# UI/UXガイドライン

## 1. デザインシステム概要

### 1.1 目的
- 一貫性のあるユーザー体験の提供
- 開発効率の向上
- メンテナンス性の向上
- ブランド統一

### 1.2 基本原則
- **一貫性**: 同じ操作は同じ結果を返す
- **予測可能性**: ユーザーが操作結果を予測できる
- **フィードバック**: 操作に対する明確な反応
- **効率性**: 最小限の操作で目的達成

## 2. カラーシステム

### 2.1 基本カラー
| 色名 | HEX | RGB | 用途 |
|------|-----|-----|------|
| Primary | #007bff | rgb(0, 123, 255) | メインアクション |
| Secondary | #6c757d | rgb(108, 117, 125) | サブアクション |
| Success | #28a745 | rgb(40, 167, 69) | 成功状態 |
| Warning | #ffc107 | rgb(255, 193, 7) | 警告状態 |
| Danger | #dc3545 | rgb(220, 53, 69) | エラー状態 |
| Info | #17a2b8 | rgb(23, 162, 184) | 情報表示 |

### 2.2 グレースケール
| レベル | HEX | 用途 |
|--------|-----|------|
| White | #ffffff | 背景色 |
| Gray-100 | #f8f9fa | 薄い背景 |
| Gray-200 | #e9ecef | ボーダー |
| Gray-300 | #dee2e6 | 無効状態 |
| Gray-400 | #ced4da | プレースホルダー |
| Gray-500 | #adb5bd | 補助テキスト |
| Gray-600 | #6c757d | セカンダリテキスト |
| Gray-700 | #495057 | メインテキスト |
| Gray-800 | #343a40 | 見出し |
| Gray-900 | #212529 | 重要なテキスト |
| Black | #000000 | 最重要テキスト |

## 3. タイポグラフィ

### 3.1 フォントファミリー
- **日本語**: Noto Sans JP, Hiragino Kaku Gothic ProN, Meiryo, sans-serif
- **英数字**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **コード**: Consolas, Monaco, "Courier New", monospace

### 3.2 フォントサイズ
| レベル | サイズ | Line Height | 用途 |
|--------|--------|-------------|------|
| H1 | 32px | 1.25 | ページタイトル |
| H2 | 28px | 1.3 | セクションタイトル |
| H3 | 24px | 1.35 | サブセクション |
| H4 | 20px | 1.4 | 小見出し |
| H5 | 18px | 1.45 | 項目見出し |
| H6 | 16px | 1.5 | 最小見出し |
| Body | 16px | 1.6 | 本文 |
| Small | 14px | 1.6 | 補助文 |
| Caption | 12px | 1.5 | キャプション |

## 4. スペーシング

### 4.1 基本単位
- **ベース**: 8px
- **スケール**: 4px, 8px, 16px, 24px, 32px, 48px, 64px

### 4.2 コンポーネント間隔
| 用途 | 間隔 |
|------|------|
| 関連要素間 | 8px |
| セクション間 | 24px |
| ページ要素間 | 48px |
| 画面端余白 | 16px (mobile), 24px (desktop) |

## 5. コンポーネント仕様

### 5.1 ボタン
#### プライマリボタン
- **背景色**: Primary
- **テキスト色**: White
- **パディング**: 12px 24px
- **ボーダー半径**: 4px
- **フォントサイズ**: 16px

#### セカンダリボタン
- **背景色**: Transparent
- **テキスト色**: Primary
- **ボーダー**: 1px solid Primary
- **パディング**: 12px 24px
- **ボーダー半径**: 4px

#### 状態
| 状態 | スタイル |
|------|----------|
| Default | 通常表示 |
| Hover | 背景色を10%暗く |
| Active | 背景色を20%暗く |
| Disabled | 透明度50%、クリック無効 |

### 5.2 入力フィールド
- **ボーダー**: 1px solid Gray-300
- **パディング**: 12px 16px
- **ボーダー半径**: 4px
- **フォーカス**: Primary色のボーダー、影付き

### 5.3 カード
- **背景色**: White
- **ボーダー**: 1px solid Gray-200
- **ボーダー半径**: 8px
- **影**: 0 2px 4px rgba(0,0,0,0.1)
- **パディング**: 24px

## 6. レイアウトガイド

### 6.1 グリッドシステム
- **カラム数**: 12
- **ガター**: 24px
- **最大幅**: 1200px
- **ブレークポイント**: 576px, 768px, 992px, 1200px

### 6.2 Z-index階層
| レベル | 値 | 用途 |
|--------|----|----- |
| Base | 0 | 通常要素 |
| Dropdown | 1000 | ドロップダウン |
| Sticky | 1020 | 固定ヘッダー |
| Modal Backdrop | 1040 | モーダル背景 |
| Modal | 1050 | モーダルコンテンツ |
| Tooltip | 1070 | ツールチップ |

## 7. インタラクション

### 7.1 アニメーション
- **持続時間**: 0.2s (短い), 0.3s (標準), 0.5s (長い)
- **イージング**: ease-out (開始), ease-in (終了), ease-in-out (両方)

### 7.2 ローディング
- **スピナー**: Primary色、32px
- **プログレスバー**: Primary色、8px高
- **スケルトン**: Gray-200背景

## 8. アクセシビリティ

### 8.1 コントラスト比
- **通常文字**: 4.5:1以上
- **大きい文字**: 3:1以上
- **非テキスト**: 3:1以上

### 8.2 フォーカス表示
- **アウトライン**: 2px solid Primary
- **オフセット**: 2px

### 8.3 代替テキスト
- 画像には適切なalt属性
- アイコンには説明テキスト
- 音声読み上げ対応

## 9. レスポンシブデザイン

### 9.1 ブレークポイント戦略
- **Mobile First**: 小画面から設計
- **Progressive Enhancement**: 段階的な機能向上
- **Touch Friendly**: タッチ操作に最適化

### 9.2 コンポーネント適応
| コンポーネント | Mobile | Tablet | Desktop |
|---------------|--------|--------|---------|
| ナビゲーション | ハンバーガー | 水平 | 水平 |
| カード | 1列 | 2列 | 3-4列 |
| モーダル | 全画面 | 中央 | 中央 |

## 10. パフォーマンス

### 10.1 画像最適化
- **形式**: WebP優先、PNG/JPEGフォールバック
- **サイズ**: 各デバイスサイズに最適化
- **遅延読み込み**: 必要に応じて実装

### 10.2 フォント最適化
- **preload**: 重要フォントの先読み
- **display: swap**: フォント読み込み中の表示
- **subset**: 必要文字のみ読み込み
`
    }
  ],
  'development-prep': [
    {
      id: 'coding-standards',
      name: 'コーディング規約テンプレート',
      description: 'チーム開発で統一すべきコーディングルール',
      type: 'document',
      filename: 'コーディング規約.md',
      content: `# コーディング規約

## 1. 概要

### 1.1 目的
- コードの可読性向上
- メンテナンス性の向上
- チーム開発の効率化
- バグの削減

### 1.2 適用範囲
本規約は以下の言語・技術に適用されます：
- JavaScript/TypeScript
- React
- CSS/SCSS
- HTML
- Node.js

## 2. 全般的なルール

### 2.1 ファイル・フォルダ命名規則
- **ファイル名**: kebab-case (例: user-profile.js)
- **フォルダ名**: kebab-case (例: user-management)
- **Reactコンポーネント**: PascalCase (例: UserProfile.tsx)
- **設定ファイル**: そのまま (例: .eslintrc.js)

### 2.2 インデント
- **スペース**: 2文字
- **タブ使用禁止**
- **末尾スペース削除**

### 2.3 改行コード
- **LF** (\n) を使用
- **CRLF**, **CR** は使用禁止

### 2.4 文字エンコーディング
- **UTF-8** を使用

## 3. JavaScript/TypeScript

### 3.1 変数・関数命名
\`\`\`javascript
// 変数: camelCase
const userName = 'john';
const isUserActive = true;

// 定数: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// 関数: camelCase (動詞始まり)
function getUserName() {}
function calculateTotalPrice() {}

// クラス: PascalCase
class UserService {}
class ApiClient {}
\`\`\`

### 3.2 変数宣言
\`\`\`javascript
// const を優先、次に let、var は使用禁止
const userName = 'john';
let userAge = 25;

// 1行1変数
const firstName = 'John';
const lastName = 'Doe';

// 分割代入を活用
const { name, age } = user;
const [first, second] = items;
\`\`\`

### 3.3 関数定義
\`\`\`javascript
// アロー関数を優先
const add = (a, b) => a + b;

// 複数行の場合
const processUser = (user) => {
  const processed = validateUser(user);
  return transformUser(processed);
};

// 型注釈 (TypeScript)
const add = (a: number, b: number): number => a + b;
\`\`\`

### 3.4 オブジェクト・配列
\`\`\`javascript
// オブジェクト: 末尾カンマあり
const user = {
  name: 'John',
  age: 25,
  email: 'john@example.com', // 末尾カンマ
};

// 配列: 末尾カンマあり
const colors = [
  'red',
  'green',
  'blue', // 末尾カンマ
];

// プロパティ省略記法を活用
const name = 'John';
const age = 25;
const user = { name, age }; // { name: name, age: age } の省略形
\`\`\`

### 3.5 文字列
\`\`\`javascript
// シングルクォートを優先
const message = 'Hello World';

// テンプレートリテラルを活用
const greeting = \`Hello, \${name}!\`;

// 複数行文字列
const htmlTemplate = \`
  <div class="container">
    <h1>\${title}</h1>
    <p>\${description}</p>
  </div>
\`;
\`\`\`

### 3.6 比較演算
\`\`\`javascript
// 厳密等価演算子を使用
if (value === 'test') {}
if (count !== 0) {}

// == と != は使用禁止
// if (value == 'test') {} // NG
\`\`\`

### 3.7 エラーハンドリング
\`\`\`javascript
// try-catch を適切に使用
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('API call failed:', error);
  throw new Error('Failed to fetch data');
}

// Promiseの場合
apiCall()
  .then(result => processResult(result))
  .catch(error => handleError(error));
\`\`\`

## 4. React

### 4.1 コンポーネント定義
\`\`\`tsx
// 関数コンポーネントを使用
import React from 'react';

interface Props {
  name: string;
  age?: number;
}

export const UserProfile: React.FC<Props> = ({ name, age = 0 }) => {
  return (
    <div className="user-profile">
      <h1>{name}</h1>
      {age > 0 && <p>Age: {age}</p>}
    </div>
  );
};

// デフォルトエクスポート
export default UserProfile;
\`\`\`

### 4.2 Hooks使用
\`\`\`tsx
// useState
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// useEffect
useEffect(() => {
  fetchUserData();
}, []); // 依存配列を明示

// カスタムHooks
const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading };
};
\`\`\`

### 4.3 イベントハンドリング
\`\`\`tsx
// インライン関数は避ける
const UserForm: React.FC = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // 処理
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleInputChange} />
    </form>
  );
};
\`\`\`

## 5. CSS/SCSS

### 5.1 命名規則（BEM）
\`\`\`css
/* Block */
.user-card {}

/* Element */
.user-card__header {}
.user-card__body {}
.user-card__footer {}

/* Modifier */
.user-card--featured {}
.user-card__header--large {}
\`\`\`

### 5.2 プロパティ順序
\`\`\`css
.example {
  /* Position */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  
  /* Box Model */
  display: flex;
  width: 100px;
  height: 100px;
  margin: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  
  /* Typography */
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  
  /* Visual */
  background: #fff;
  border-radius: 4px;
  opacity: 1;
  
  /* Animation */
  transition: all 0.3s ease;
  transform: translateX(10px);
}
\`\`\`

### 5.3 セレクタ
\`\`\`css
/* クラスセレクタを優先 */
.button {}

/* IDセレクタは避ける */
/* #header {} NG */

/* ネストは3階層まで */
.card {
  .card__header {
    .card__title {} /* OK */
    .card__subtitle {
      .small-text {} /* NG: 4階層 */
    }
  }
}
\`\`\`

## 6. HTML

### 6.1 基本構造
\`\`\`html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ページタイトル</title>
</head>
<body>
  <!-- コンテンツ -->
</body>
</html>
\`\`\`

### 6.2 セマンティック要素
\`\`\`html
<header>
  <nav>
    <ul>
      <li><a href="/">ホーム</a></li>
      <li><a href="/about">会社概要</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>記事タイトル</h1>
    <section>
      <h2>セクションタイトル</h2>
      <p>段落テキスト</p>
    </section>
  </article>
</main>

<footer>
  <p>&copy; 2024 Company Name</p>
</footer>
\`\`\`

### 6.3 アクセシビリティ
\`\`\`html
<!-- alt属性 -->
<img src="image.jpg" alt="画像の説明">

<!-- label要素 -->
<label for="email">メールアドレス</label>
<input type="email" id="email" name="email">

<!-- ARIA属性 -->
<button aria-label="メニューを開く">☰</button>
<div role="alert">エラーメッセージ</div>
\`\`\`

## 7. コメント

### 7.1 JavaScript/TypeScript
\`\`\`javascript
/**
 * ユーザー情報を取得する
 * @param userId - ユーザーID
 * @returns ユーザー情報
 */
const fetchUser = async (userId: string): Promise<User> => {
  // APIからユーザー情報を取得
  const response = await fetch(\`/api/users/\${userId}\`);
  return response.json();
};

// TODO: エラーハンドリングを追加
// FIXME: パフォーマンスの改善が必要
\`\`\`

### 7.2 CSS
\`\`\`css
/**
 * ユーザーカードコンポーネント
 * ユーザーの基本情報を表示するカード
 */
.user-card {
  /* カードの基本スタイル */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  
  /* TODO: ダークモード対応 */
}
\`\`\`

## 8. ツール設定

### 8.1 ESLint設定例
\`\`\`javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-unused-vars': 'error',
    'prefer-const': 'error',
  },
};
\`\`\`

### 8.2 Prettier設定例
\`\`\`json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
\`\`\`

## 9. ファイル構成

### 9.1 プロジェクト構造
\`\`\`
src/
├── components/           # 再利用可能なコンポーネント
│   ├── common/          # 共通コンポーネント
│   └── ui/              # UIコンポーネント
├── pages/               # ページコンポーネント
├── hooks/               # カスタムHooks
├── utils/               # ユーティリティ関数
├── types/               # 型定義
├── api/                 # API関連
├── styles/              # スタイルファイル
└── assets/              # 静的ファイル
\`\`\`

### 9.2 インポート順序
\`\`\`javascript
// 1. Node.js標準ライブラリ
import fs from 'fs';

// 2. 外部ライブラリ
import React from 'react';
import { useState } from 'react';

// 3. 内部ライブラリ (絶対パス)
import { Button } from '@/components/ui/button';

// 4. 相対パス (親階層から)
import { UserService } from '../services/user';

// 5. 相対パス (同階層・子階層)
import { validateUser } from './validation';
\`\`\`

## 10. レビュー観点

### 10.1 必須チェック項目
- [ ] 命名規則に従っているか
- [ ] 適切なコメントが書かれているか
- [ ] エラーハンドリングが適切か
- [ ] セキュリティ上の問題がないか
- [ ] パフォーマンスに問題がないか

### 10.2 推奨チェック項目
- [ ] DRY原則に従っているか
- [ ] 単一責任原則に従っているか
- [ ] テストしやすい設計か
- [ ] 可読性が高いか
- [ ] 将来の拡張性を考慮しているか
`
    },
    {
      id: 'dev-environment',
      name: '開発環境構築手順',
      description: '開発環境のセットアップマニュアル',
      type: 'document',
      filename: '開発環境構築手順.md',
      content: `# 開発環境構築手順

## 1. 概要

この手順書では、プロジェクトの開発に必要な環境構築について説明します。

### 1.1 対象OS
- Windows 10/11
- macOS 10.15以降
- Ubuntu 18.04以降

### 1.2 必要な権限
- 管理者権限（一部ツールのインストール時）
- インターネット接続

## 2. 基本ツールのインストール

### 2.1 Node.js
#### インストール方法
1. [Node.js公式サイト](https://nodejs.org/) からLTS版をダウンロード
2. インストーラーを実行
3. デフォルト設定でインストール

#### バージョン確認
\`\`\`bash
node --version
npm --version
\`\`\`

**推奨バージョン**: Node.js 18.x以降

### 2.2 Git
#### Windows
1. [Git for Windows](https://gitforwindows.org/) をダウンロード
2. インストーラーを実行
3. デフォルト設定でインストール

#### macOS
\`\`\`bash
# Homebrew経由でインストール
brew install git
\`\`\`

#### Ubuntu
\`\`\`bash
sudo apt update
sudo apt install git
\`\`\`

#### 初期設定
\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
\`\`\`

### 2.3 Visual Studio Code
1. [VS Code公式サイト](https://code.visualstudio.com/) からダウンロード
2. インストーラーを実行

#### 推奨拡張機能
\`\`\`json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-vscode.vscode-git-extension-pack"
  ]
}
\`\`\`

## 3. プロジェクトのセットアップ

### 3.1 リポジトリのクローン
\`\`\`bash
git clone https://github.com/your-org/your-project.git
cd your-project
\`\`\`

### 3.2 依存関係のインストール
\`\`\`bash
npm install
\`\`\`

### 3.3 環境変数の設定
\`\`\`bash
# .env.example をコピー
cp .env.example .env

# 必要な値を設定
# エディタで .env ファイルを編集
\`\`\`

#### 設定例
\`\`\`env
# アプリケーション設定
NODE_ENV=development
PORT=3000

# データベース設定
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# API設定
API_BASE_URL=http://localhost:3001

# 認証設定
JWT_SECRET=your-secret-key
\`\`\`

### 3.4 データベースのセットアップ
#### PostgreSQL (例)
\`\`\`bash
# インストール
npm install -g postgres

# データベース作成
createdb mydb

# マイグレーション実行
npm run db:migrate

# シードデータ投入
npm run db:seed
\`\`\`

## 4. 開発サーバーの起動

### 4.1 フロントエンド
\`\`\`bash
npm run dev
\`\`\`

ブラウザで http://localhost:3000 にアクセス

### 4.2 バックエンド (別途)
\`\`\`bash
npm run server
\`\`\`

APIサーバーが http://localhost:3001 で起動

### 4.3 両方同時起動
\`\`\`bash
npm run start:all
\`\`\`

## 5. 開発ツールの設定

### 5.1 ESLint
\`\`\`bash
# インストール (package.jsonに含まれている場合は不要)
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# 設定ファイル確認
cat .eslintrc.js
\`\`\`

### 5.2 Prettier
\`\`\`bash
# インストール (package.jsonに含まれている場合は不要)
npm install --save-dev prettier

# 設定ファイル確認
cat .prettierrc
\`\`\`

### 5.3 Husky (Git Hooks)
\`\`\`bash
# セットアップ
npx husky install
npm run prepare
\`\`\`

### 5.4 VS Code設定
プロジェクトルートに \.vscode/settings.json\ を作成：

\`\`\`json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  }
}
\`\`\`

## 6. データベースツール

### 6.1 pgAdmin (PostgreSQL)
1. [pgAdmin公式サイト](https://www.pgadmin.org/) からダウンロード
2. インストール後、データベース接続設定

### 6.2 MongoDB Compass (MongoDB使用時)
1. [MongoDB Compass](https://www.mongodb.com/products/compass) をダウンロード
2. インストール後、接続文字列を設定

### 6.3 Redis CLI (Redis使用時)
\`\`\`bash
# macOS
brew install redis

# Ubuntu
sudo apt install redis-server

# Windows
# Redis公式サイトからダウンロード
\`\`\`

## 7. API開発ツール

### 7.1 Postman
1. [Postman公式サイト](https://www.postman.com/) からダウンロード
2. アカウント作成（チーム共有のため）
3. プロジェクトのコレクションをインポート

### 7.2 cURL (コマンドライン)
\`\`\`bash
# API動作確認例
curl -X GET http://localhost:3001/api/users
curl -X POST -H "Content-Type: application/json" -d '{"name":"test"}' http://localhost:3001/api/users
\`\`\`

## 8. ブラウザ開発ツール

### 8.1 Chrome DevTools拡張
- React Developer Tools
- Redux DevTools
- Apollo Client DevTools (GraphQL使用時)

### 8.2 Firefox拡張
- React Developer Tools
- Redux DevTools

## 9. パッケージマネージャー設定

### 9.1 npm設定
\`\`\`bash
# レジストリ確認
npm config get registry

# プライベートレジストリ設定 (必要に応じて)
npm config set registry https://your-private-registry.com

# 認証情報設定
npm login
\`\`\`

### 9.2 Yarn (使用する場合)
\`\`\`bash
# インストール
npm install -g yarn

# プロジェクトでの使用
yarn install
yarn dev
\`\`\`

## 10. コンテナ環境 (Docker使用時)

### 10.1 Docker Desktop
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) をダウンロード
2. インストール・起動

### 10.2 開発環境起動
\`\`\`bash
# 全サービス起動
docker-compose up -d

# ログ確認
docker-compose logs -f

# 停止
docker-compose down
\`\`\`

### 10.3 個別サービス操作
\`\`\`bash
# データベースのみ起動
docker-compose up -d database

# アプリケーションコンテナに入る
docker-compose exec app bash

# データベース接続
docker-compose exec database psql -U postgres
\`\`\`

## 11. 確認・テスト

### 11.1 動作確認チェックリスト
- [ ] フロントエンドが正常に起動する
- [ ] APIサーバーが正常に起動する
- [ ] データベース接続が成功する
- [ ] 基本的なページが表示される
- [ ] API呼び出しが成功する
- [ ] 認証機能が動作する

### 11.2 テスト実行
\`\`\`bash
# 単体テスト
npm run test

# E2Eテスト
npm run test:e2e

# カバレッジ確認
npm run test:coverage
\`\`\`

## 12. トラブルシューティング

### 12.1 よくある問題

#### Node.jsバージョン不一致
\`\`\`bash
# nvmを使用してバージョン管理
nvm install 18
nvm use 18
\`\`\`

#### ポート番号の競合
\`\`\`bash
# プロセス確認
lsof -ti:3000

# プロセス停止
kill -9 <PID>
\`\`\`

#### 依存関係の問題
\`\`\`bash
# node_modules削除・再インストール
rm -rf node_modules package-lock.json
npm install
\`\`\`

#### Git認証エラー
\`\`\`bash
# SSH鍵生成
ssh-keygen -t ed25519 -C "your.email@example.com"

# SSH鍵をGitHubに追加
cat ~/.ssh/id_ed25519.pub
\`\`\`

### 12.2 ログ確認場所
- アプリケーションログ: \'./logs/app.log\'
- データベースログ: システムログまたはDocker logs
- Webサーバーログ: \'./logs/access.log\'

## 13. チーム開発のルール

### 13.1 ブランチ戦略
\`\`\`bash
# 機能開発
git checkout -b feature/user-authentication
git checkout -b feature/user-profile

# バグ修正
git checkout -b fix/login-error

# ホットフィックス
git checkout -b hotfix/security-patch
\`\`\`

### 13.2 コミットメッセージ規約
\`\`\`
feat: ユーザー認証機能を追加
fix: ログイン時のエラーハンドリングを修正
docs: READMEを更新
style: コードフォーマットを統一
refactor: ユーザーサービスをリファクタリング
test: ユーザー登録のテストを追加
\`\`\`

### 13.3 プルリクエスト
- 機能ごとに1つのPR
- 適切なタイトルと説明
- レビュアーを2名以上指定
- CIが通過してからマージ

## 14. 参考資料

### 14.1 ドキュメント
- [プロジェクトWiki](wiki-url)
- [API仕様書](api-docs-url)
- [デザインシステム](design-system-url)

### 14.2 外部リソース
- [Node.js公式ドキュメント](https://nodejs.org/docs/)
- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)

## 15. サポート

### 15.1 質問・相談
- Slack: #dev-support チャンネル
- メール: dev-team@company.com
- 緊急時: 開発リーダーに直接連絡

### 15.2 定期ミーティング
- 毎日 9:30-9:45: デイリースタンドアップ
- 毎週金曜 16:00-17:00: ふりかえり
- 月初: 月次目標設定
`
    },
    {
      id: 'project-structure',
      name: 'プロジェクト構成テンプレート',
      description: 'スケーラブルなプロジェクト構成の雛形',
      type: 'markdown',
      filename: 'プロジェクト構成テンプレート.md',
      content: `# プロジェクト構成テンプレート

## 1. ディレクトリ構成

\`\`\`
project-root/
├── .github/                 # GitHub設定
│   ├── workflows/          # GitHub Actions
│   ├── ISSUE_TEMPLATE/     # イシューテンプレート
│   └── PULL_REQUEST_TEMPLATE.md
├── .vscode/                # VS Code設定
│   ├── settings.json
│   ├── extensions.json
│   └── launch.json
├── docs/                   # プロジェクトドキュメント
│   ├── api/               # API仕様書
│   ├── design/            # デザイン関連
│   └── guides/            # 開発ガイド
├── public/                # 静的ファイル
│   ├── images/
│   ├── icons/
│   └── manifest.json
├── src/                   # ソースコード
│   ├── components/        # コンポーネント
│   │   ├── common/       # 共通コンポーネント
│   │   ├── layout/       # レイアウトコンポーネント
│   │   └── ui/           # UIコンポーネント
│   ├── pages/            # ページコンポーネント
│   ├── hooks/            # カスタムHooks
│   ├── services/         # API呼び出し等のサービス
│   ├── utils/            # ユーティリティ関数
│   ├── types/            # 型定義
│   ├── constants/        # 定数
│   ├── contexts/         # Reactコンテキスト
│   ├── store/            # 状態管理
│   ├── styles/           # スタイルファイル
│   └── tests/            # テストファイル
├── scripts/              # ビルド・デプロイスクリプト
├── config/               # 設定ファイル
├── .env.example          # 環境変数テンプレート
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── jest.config.js
├── docker-compose.yml
├── Dockerfile
└── README.md
\`\`\`

## 2. 各ディレクトリの詳細

### 2.1 src/components/
\`\`\`
components/
├── common/                # プロジェクト共通コンポーネント
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   ├── Modal/
│   ├── Form/
│   └── index.ts
├── layout/               # レイアウト関連
│   ├── Header/
│   ├── Footer/
│   ├── Sidebar/
│   └── Layout.tsx
├── ui/                   # 基本UIコンポーネント
│   ├── Input/
│   ├── Select/
│   ├── Checkbox/
│   └── index.ts
└── feature/              # 機能固有コンポーネント
    ├── user/
    ├── product/
    └── order/
\`\`\`

### 2.2 src/pages/
\`\`\`
pages/
├── auth/
│   ├── login/
│   │   ├── LoginPage.tsx
│   │   ├── components/
│   │   └── hooks/
│   └── register/
├── dashboard/
├── user/
│   ├── profile/
│   └── settings/
└── index.ts
\`\`\`

### 2.3 src/hooks/
\`\`\`
hooks/
├── api/                  # API関連フック
│   ├── useUser.ts
│   ├── useProduct.ts
│   └── index.ts
├── ui/                   # UI関連フック
│   ├── useModal.ts
│   ├── useForm.ts
│   └── index.ts
└── utils/                # ユーティリティフック
    ├── useLocalStorage.ts
    ├── useDebounce.ts
    └── index.ts
\`\`\`

### 2.4 src/services/
\`\`\`
services/
├── api/
│   ├── client.ts         # APIクライアント設定
│   ├── endpoints.ts      # エンドポイント定義
│   ├── user.ts          # ユーザー関連API
│   ├── product.ts       # 商品関連API
│   └── index.ts
├── auth/
│   ├── authService.ts
│   └── tokenService.ts
└── storage/
    ├── localStorage.ts
    └── sessionStorage.ts
\`\`\`

### 2.5 src/types/
\`\`\`
types/
├── api/                  # API関連の型
│   ├── user.ts
│   ├── product.ts
│   └── common.ts
├── components/           # コンポーネントの型
├── global.d.ts          # グローバル型定義
└── index.ts
\`\`\`

### 2.6 src/utils/
\`\`\`
utils/
├── formatters/          # データフォーマット
│   ├── date.ts
│   ├── currency.ts
│   └── string.ts
├── validators/          # バリデーション
│   ├── email.ts
│   ├── password.ts
│   └── form.ts
├── helpers/             # ヘルパー関数
│   ├── array.ts
│   ├── object.ts
│   └── dom.ts
└── constants/           # 定数
    ├── api.ts
    ├── routes.ts
    └── messages.ts
\`\`\`

## 3. 設定ファイル詳細

### 3.1 package.json
\`\`\`json
{
  "name": "project-name",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook",
    "prepare": "husky install"
  },
  "dependencies": {
    "next": "^13.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/node": "^18.0.0",
    "@types/react": "^18.0.0",
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "@typescript-eslint/parser": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^13.0.0",
    "husky": "^8.0.0",
    "jest": "^29.0.0",
    "prettier": "^2.8.0",
    "typescript": "^4.9.0"
  }
}
\`\`\`

### 3.2 tsconfig.json
\`\`\`json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/services/*": ["./src/services/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
\`\`\`

### 3.3 .eslintrc.js
\`\`\`javascript
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      env: {
        jest: true,
      },
    },
  ],
};
\`\`\`

### 3.4 .prettierrc
\`\`\`json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
\`\`\`

## 4. 命名規則

### 4.1 ファイル・ディレクトリ
- **コンポーネントファイル**: PascalCase (UserProfile.tsx)
- **ページファイル**: PascalCase (LoginPage.tsx)
- **ユーティリティファイル**: camelCase (dateFormatter.ts)
- **ディレクトリ**: kebab-case (user-management)
- **定数ファイル**: camelCase (apiEndpoints.ts)

### 4.2 コンポーネント構成
\`\`\`
ComponentName/
├── ComponentName.tsx      # メインコンポーネント
├── ComponentName.test.tsx # テストファイル
├── ComponentName.stories.tsx # Storybookストーリー
├── types.ts              # コンポーネント固有の型
├── hooks.ts              # コンポーネント固有のhooks
├── utils.ts              # コンポーネント固有のutils
└── index.ts              # エクスポート
\`\`\`

## 5. インポート規則

### 5.1 インポート順序
\`\`\`typescript
// 1. React関連
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';

// 2. 外部ライブラリ
import axios from 'axios';
import { format } from 'date-fns';

// 3. 内部ライブラリ (絶対パス)
import { Button } from '@/components/ui/Button';
import { useUser } from '@/hooks/api/useUser';
import { UserType } from '@/types/user';

// 4. 相対パス
import { validateForm } from './utils';
import { FormComponent } from './components/FormComponent';

// 5. 型のみのインポート (末尾)
import type { FormData } from './types';
\`\`\`

### 5.2 エクスポート規則
\`\`\`typescript
// コンポーネントの場合
export const UserProfile: React.FC<Props> = ({ ... }) => {
  // ...
};

export default UserProfile;

// ユーティリティの場合
export const formatDate = (date: Date): string => {
  // ...
};

export const validateEmail = (email: string): boolean => {
  // ...
};

// 型の場合
export interface UserType {
  id: string;
  name: string;
  email: string;
}

export type UserStatus = 'active' | 'inactive' | 'pending';
\`\`\`

## 6. 環境設定

### 6.1 .env.example
\`\`\`bash
# アプリケーション設定
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API設定
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
API_SECRET_KEY=your-secret-key

# データベース設定
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# 認証設定
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# 外部サービス
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# メール設定
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
\`\`\`

## 7. Docker設定

### 7.1 Dockerfile
\`\`\`dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
\`\`\`

### 7.2 docker-compose.yml
\`\`\`yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
    depends_on:
      - db
      - redis
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
\`\`\`

## 8. GitHub設定

### 8.1 .github/workflows/ci.yml
\`\`\`yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run type check
      run: npm run type-check
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Build
      run: npm run build
\`\`\`

## 9. 推奨ツール・ライブラリ

### 9.1 開発ツール
- **Storybook**: コンポーネント開発
- **Jest**: 単体テスト
- **Playwright**: E2Eテスト
- **Husky**: Git hooks
- **lint-staged**: staged filesのlinting

### 9.2 ライブラリ
- **UI**: Chakra UI, Mantine, Ant Design
- **状態管理**: Zustand, Redux Toolkit, Jotai
- **フォーム**: React Hook Form, Formik
- **HTTP**: Axios, SWR, React Query
- **日付**: date-fns, Day.js
- **アニメーション**: Framer Motion

## 10. プロジェクト開始チェックリスト

### 10.1 初期設定
- [ ] リポジトリ作成・クローン
- [ ] 依存関係インストール
- [ ] 環境変数設定
- [ ] データベースセットアップ
- [ ] CI/CD設定

### 10.2 開発環境
- [ ] VS Code拡張機能インストール
- [ ] ESLint/Prettier設定確認
- [ ] Git hooks設定
- [ ] Storybook設定
- [ ] テスト環境確認

### 10.3 チーム設定
- [ ] コーディング規約共有
- [ ] ブランチ戦略決定
- [ ] レビュープロセス確立
- [ ] デプロイフロー確認
- [ ] ドキュメント整備
`
    }
  ]
};

const getIcon = (type: Template['type']) => {
  switch (type) {
    case 'document':
    case 'markdown':
      return FileText;
    case 'spreadsheet':
      return FileSpreadsheet;
    case 'code':
      return FileCode;
    default:
      return File;
  }
};

const getMimeType = (type: Template['type']) => {
  switch (type) {
    case 'spreadsheet':
      return 'text/csv';
    case 'code':
      return 'text/plain';
    case 'document':
    case 'markdown':
    default:
      return 'text/markdown';
  }
};

export function DownloadableTemplates({ phaseId }: DownloadableTemplatesProps) {
  const phaseTemplates = templates[phaseId] || [];

  const downloadTemplate = (template: Template) => {
    const blob = new Blob([template.content], { type: getMimeType(template.type) });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = template.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (phaseTemplates.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          ダウンロード可能なテンプレート
        </CardTitle>
        <CardDescription>
          このフェーズで役立つテンプレートをダウンロードできます
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {phaseTemplates.map(template => {
          const IconComponent = getIcon(template.type);
          return (
            <div key={template.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <IconComponent className="h-5 w-5 mt-1 text-gray-500" />
              <div className="flex-1 space-y-2">
                <div>
                  <h4 className="text-sm">{template.name}</h4>
                  <p className="text-xs text-gray-600">{template.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadTemplate(template)}
                  className="h-8"
                >
                  <Download className="h-3 w-3 mr-1" />
                  ダウンロード
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}