# システム設計アシスタント

プロジェクト管理とシステム設計を支援するWebアプリケーションです。デスクトップとモバイルの両方に対応したレスポンシブデザインを採用し、チーム協働を支援します。

## 🚀 主要機能

### ✅ 実装済み機能

#### 📋 プロジェクト管理
- **プロジェクトの作成・削除・切り替え**
- **プロジェクトメンバーの招待・管理**
- **リアルタイム同期**
- **権限管理（オーナー、管理者、メンバー）**

#### 🎯 システム設計支援
- **4つのフェーズ管理**
  - 要件定義
  - 基本設計
  - 外部設計
  - 開発準備
- **各フェーズのタスク管理**
- **成果物の管理と進捗追跡**
- **進捗の可視化**

#### 📱 マルチプラットフォーム対応
- **Webアプリケーション** - レスポンシブデザイン
- **デスクトップアプリ** - Electronベース
- **モバイル対応** - PWA対応
- **タッチフレンドリーなUI**

#### 📧 招待システム
- **メール招待機能（Resend API）**
- **招待の受け入れ・辞退**
- **セキュアなトークン管理**

#### 📚 ドキュメント管理
- **テンプレート機能**
- **ダウンロード可能なテンプレート**
- **要件定義テンプレート**
- **ドキュメントの整理・管理**

#### 🎨 UI/UX機能
- **モダンなデザイン（shadcn/ui）**
- **アニメーション効果**
- **直感的なナビゲーション**
- **リアルタイム通知**

### ❌ 未実装機能（今後の予定）

#### 🔄 v1.1.0 予定
- **オフライン機能の強化**
- **ファイルエクスポート機能**
- **テンプレートの追加**
- **パフォーマンス最適化**

#### 🔄 v1.2.0 予定
- **チャット機能**
- **AI支援機能**
- **高度な分析機能**
- **プラグインシステム**

## 🛠 技術スタック

### フロントエンド
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **React Router DOM**
- **React Hook Form** + **Zod**

### バックエンド
- **Supabase** (PostgreSQL)
- **Supabase Auth**
- **Supabase Realtime**
- **Supabase Edge Functions**

### 外部サービス
- **Resend API** (メール送信)
- **Vercel** (デプロイ)

### 開発ツール
- **Electron** (デスクトップアプリ対応)
- **PWA** (Progressive Web App)

## 🚀 セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.local`ファイルを作成し、必要な設定を追加：
```env
# Supabase設定
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend設定（メール送信機能）
VITE_RESEND_API_KEY=your_resend_api_key
VITE_FROM_EMAIL=your_from_email
VITE_ENABLE_EMAIL_SENDING=true
```

### 3. Supabaseのセットアップ
```bash
# Supabase CLIのインストール
npm install -g supabase

# ローカル開発環境の起動
supabase start

# データベースのリセット（必要に応じて）
supabase db reset
```

### 4. 開発サーバーの起動
```bash
# Web開発サーバー
npm run dev

# Electron開発（デスクトップアプリ）
npm run electron:dev
```

## 📦 配布ファイル

### macOS
- **システム設計アシスタント-1.0.0.dmg** (121.9MB) - Intel Mac用インストーラー
- **システム設計アシスタント-1.0.0-arm64.dmg** (116.8MB) - Apple Silicon Mac用インストーラー
- **システム設計アシスタント-1.0.0-mac.zip** (117.9MB) - Intel Mac用ポータブル版
- **システム設計アシスタント-1.0.0-arm64-mac.zip** (112.8MB) - Apple Silicon Mac用ポータブル版

### Windows (要別途ビルド)
- **システム設計アシスタント Setup 1.0.0.exe** - Windows用インストーラー
- **システム設計アシスタント-1.0.0-win.zip** - Windows用ポータブル版

### Linux (要別途ビルド)
- **システム設計アシスタント-1.0.0.AppImage** - Linux用AppImage
- **システム設計アシスタント_1.0.0_amd64.deb** - Ubuntu/Debian用パッケージ

## 💻 インストール方法

### macOS

1. **DMGファイル**:
   - `システム設計アシスタント-x.x.x.dmg` をダウンロード
   - DMGファイルを開く
   - アプリケーションをApplicationsフォルダにドラッグ&ドロップ

2. **ZIPファイル**:
   - `システム設計アシスタント-x.x.x-mac.zip` をダウンロード
   - 解凍してアプリケーションを起動

### Windows

1. **インストーラー**:
   - `システム設計アシスタント Setup x.x.x.exe` をダウンロード
   - インストーラーを実行してインストール

2. **ポータブル版**:
   - `システム設計アシスタント-x.x.x-win.zip` をダウンロード
   - 解凍して任意のフォルダに配置
   - `システム設計アシスタント.exe` を実行

### Linux

1. **AppImage**:
   - `システム設計アシスタント-x.x.x.AppImage` をダウンロード
   - 実行権限を付与: `chmod +x システム設計アシスタント-x.x.x.AppImage`
   - 実行: `./システム設計アシスタント-x.x.x.AppImage`

2. **DEBパッケージ**:
   - `システム設計アシスタント_x.x.x_amd64.deb` をダウンロード
   - インストール: `sudo dpkg -i システム設計アシスタント_x.x.x_amd64.deb`

## 🎯 使用方法

1. **アプリケーションを起動**
2. **ログインまたは新規登録**
3. **プロジェクトの作成または選択**
4. **システム設計の開始**

### 主な機能
- 📋 プロジェクト管理
- 📝 要件定義書の作成
- 🏗️ システム設計書の作成
- 📊 データベース設計
- 🔌 API設計
- 🎨 UI/UX設計
- 📱 モバイル対応
- 👥 チーム協働
- 📧 メール通知
- 📄 テンプレート管理

## 📁 プロジェクト構造

```
sys/
├── 📄 ルートファイル
│   ├── README.md                    # プロジェクト概要・セットアップ・実装状況
│   ├── package.json                 # 依存関係・スクリプト定義
│   ├── package-lock.json            # 依存関係のロックファイル
│   ├── vite.config.ts               # Vite設定（Electron対応）
│   ├── tailwind.config.js           # Tailwind CSS設定
│   ├── postcss.config.js            # PostCSS設定
│   ├── tsconfig.json                # TypeScript設定
│   ├── vite-env.d.ts                # Vite型定義
│   ├── index.html                   # エントリーポイントHTML
│   ├── vercel.json                  # Vercelデプロイ設定
│   └── test-email.js                # メール機能テスト
│
├── 🖥️ デスクトップアプリ関連
│   ├── electron-main.js             # Electronメインプロセス
│   ├── electron-preload.js          # Electronプリロードスクリプト
│   └── build/
│       └── entitlements.mac.plist   # macOSサンドボックス設定
│
├── 🎨 フロントエンド
│   ├── main.tsx                     # Reactアプリケーションエントリーポイント
│   ├── App.tsx                      # メインアプリケーションコンポーネント
│   ├── styles/
│   │   └── globals.css              # グローバルスタイル
│   │
│   ├── components/                  # Reactコンポーネント
│   │   ├── ui/                      # shadcn/ui基本コンポーネント
│   │   │   ├── accordion.tsx        # アコーディオン
│   │   │   ├── alert-dialog.tsx     # アラートダイアログ
│   │   │   ├── alert.tsx            # アラート
│   │   │   ├── aspect-ratio.tsx     # アスペクト比
│   │   │   ├── avatar.tsx           # アバター
│   │   │   ├── badge.tsx            # バッジ
│   │   │   ├── breadcrumb.tsx       # パンくずリスト
│   │   │   ├── button.tsx           # ボタン
│   │   │   ├── calendar.tsx         # カレンダー
│   │   │   ├── card.tsx             # カード
│   │   │   ├── carousel.tsx         # カルーセル
│   │   │   ├── chart.tsx            # チャート
│   │   │   ├── checkbox.tsx         # チェックボックス
│   │   │   ├── collapsible.tsx      # 折りたたみ
│   │   │   ├── command.tsx          # コマンドパレット
│   │   │   ├── context-menu.tsx     # コンテキストメニュー
│   │   │   ├── dialog.tsx           # ダイアログ
│   │   │   ├── drawer.tsx           # ドロワー
│   │   │   ├── dropdown-menu.tsx    # ドロップダウンメニュー
│   │   │   ├── form.tsx             # フォーム
│   │   │   ├── hover-card.tsx       # ホバーカード
│   │   │   ├── input-otp.tsx        # OTP入力
│   │   │   ├── input.tsx            # 入力フィールド
│   │   │   ├── label.tsx            # ラベル
│   │   │   ├── menubar.tsx          # メニューバー
│   │   │   ├── navigation-menu.tsx  # ナビゲーションメニュー
│   │   │   ├── pagination.tsx       # ページネーション
│   │   │   ├── popover.tsx          # ポップオーバー
│   │   │   ├── progress.tsx         # プログレスバー
│   │   │   ├── radio-group.tsx      # ラジオボタングループ
│   │   │   ├── resizable.tsx        # リサイズ可能
│   │   │   ├── scroll-area.tsx      # スクロールエリア
│   │   │   ├── select.tsx           # セレクト
│   │   │   ├── separator.tsx        # セパレーター
│   │   │   ├── sheet.tsx            # シート
│   │   │   ├── sidebar.tsx          # サイドバー
│   │   │   ├── skeleton.tsx         # スケルトン
│   │   │   ├── slider.tsx           # スライダー
│   │   │   ├── sonner.tsx           # トースト通知
│   │   │   ├── switch.tsx           # スイッチ
│   │   │   ├── table.tsx            # テーブル
│   │   │   ├── tabs.tsx             # タブ
│   │   │   ├── textarea.tsx         # テキストエリア
│   │   │   ├── toggle-group.tsx     # トグルグループ
│   │   │   ├── toggle.tsx           # トグル
│   │   │   ├── tooltip.tsx          # ツールチップ
│   │   │   ├── use-mobile.ts        # モバイル判定フック
│   │   │   └── utils.ts             # ユーティリティ関数
│   │   │
│   │   ├── 📋 プロジェクト管理
│   │   │   ├── ProjectSelector.tsx      # プロジェクト選択
│   │   │   ├── ProjectSwitcher.tsx      # プロジェクト切り替え
│   │   │   ├── CreateProjectDialog.tsx  # プロジェクト作成ダイアログ
│   │   │   ├── DeleteProjectDialog.tsx  # プロジェクト削除ダイアログ
│   │   │   ├── ProjectMembersDialog.tsx # プロジェクトメンバー管理
│   │   │   └── ProjectSwitchDialog.tsx  # プロジェクト切り替えダイアログ
│   │   │
│   │   ├── 👥 メンバー管理
│   │   │   └── InvitationAcceptPage.tsx # 招待受け入れページ
│   │   │
│   │   ├── 🎯 システム設計支援
│   │   │   ├── MainApp.tsx              # デスクトップメインアプリ
│   │   │   ├── MobileApp.tsx            # モバイルメインアプリ
│   │   │   ├── PhaseOverview.tsx        # フェーズ概要
│   │   │   ├── TaskManager.tsx          # タスク管理
│   │   │   ├── DeliverableTracker.tsx   # 成果物管理
│   │   │   ├── DeliverablesChecklist.tsx # 成果物チェックリスト
│   │   │   ├── MobileDeliverablesChecklist.tsx # モバイル成果物チェックリスト
│   │   │   └── AdvicePanel.tsx          # アドバイスパネル
│   │   │
│   │   ├── 📚 ドキュメント管理
│   │   │   ├── DocumentManager.tsx      # ドキュメント管理
│   │   │   ├── Templates.tsx            # テンプレート機能
│   │   │   ├── DownloadableTemplates.tsx # ダウンロード可能テンプレート
│   │   │   ├── RequirementsTemplate.tsx # 要件定義テンプレート
│   │   │   ├── MobileTemplates.tsx      # モバイルテンプレート
│   │   │   └── MobileDocumentManager.tsx # モバイルドキュメント管理
│   │   │
│   │   ├── 📱 モバイル対応
│   │   │   ├── MobileGuide.tsx          # モバイルガイド
│   │   │   └── MobileProjectManagement.tsx # モバイルプロジェクト管理
│   │   │
│   │   ├── 🔐 認証・セキュリティ
│   │   │   ├── AuthGuard.tsx            # 認証ガード
│   │   │   └── LoginForm.tsx            # ログインフォーム
│   │   │
│   │   ├── 🎨 レイアウト・UI
│   │   │   ├── Header.tsx               # ヘッダー
│   │   │   ├── DashboardLayout.tsx      # ダッシュボードレイアウト
│   │   │   └── BasicGuide.tsx           # 基本ガイド
│   │   │
│   │   └── 📊 データ可視化
│   │       └── DataFlowDiagram.tsx      # データフロー図
│   │
│   ├── contexts/                   # React Context（状態管理）
│   │   ├── AuthContext.tsx         # 認証状態管理
│   │   ├── ProjectContext.tsx      # プロジェクト選択状態管理
│   │   ├── ProjectDataContext.tsx  # プロジェクトデータ状態管理
│   │   └── ProjectMembersContext.tsx # プロジェクトメンバー状態管理
│   │
│   └── lib/                        # ユーティリティ・設定
│       ├── supabase.ts             # Supabase設定・クライアント
│       └── email.ts                # メール機能
│
├── 🗄️ バックエンド（Supabase）
│   ├── config.toml                 # Supabase設定
│   ├── seed.sql                    # 初期データ
│   │
│   ├── migrations/                 # データベースマイグレーション（整理済み）
│   │   ├── 20250719000000_initial_schema.sql           # 初期スキーマ（統合版）
│   │   ├── 20250719000001_rls_policies.sql             # RLSポリシー設定（統合版）
│   │   ├── 20250719000002_initial_data.sql             # 初期データ設定
│   │   └── 20250719000003_invitation_enhancement.sql   # 招待機能拡張
│   │
│   └── functions/                  # Supabase Edge Functions
│       └── send-email/             # メール送信機能
│           └── index.ts            # メール送信処理
│
├── 📚 ドキュメント
│   ├── README.md                   # ドキュメント概要
│   ├── 1.要件定義書.md             # システム要件定義
│   ├── 2.システム設計書.md         # システム設計
│   ├── 3.機能仕様書.md             # 機能仕様
│   ├── 4.技術仕様書.md             # 技術仕様
│   ├── 5.データベース設計書.md     # データベース設計
│   ├── 6.API設計書.md              # API設計
│   ├── 7.UIUX設計書.md             # UI/UX設計
│   ├── 8.テスト計画書.md           # テスト計画
│   ├── 9.運用設計書.md             # 運用設計
│   ├── 10.セキュリティ設計書.md    # セキュリティ設計
│   ├── 11.ユーザーマニュアル.md    # ユーザーマニュアル
│   ├── 12.運用マニュアル.md        # 運用マニュアル
│   │
│   └── diagrams/                   # 図表・ダイアグラム
│       ├── README.md               # 図表概要
│       ├── service-architecture.md # サービスアーキテクチャ図
│       ├── plantuml-data-flow.puml # PlantUMLデータフロー図
│       ├── drawio-data-flow.drawio # Draw.ioデータフロー図
│       ├── optimized-mermaid.md    # 最適化Mermaid図
│       └── table-format.md         # 表形式データフロー
│
├── 📦 配布・ビルド関連
│   ├── public/                     # 静的ファイル
│   │   ├── icon-192.png           # PWAアイコン（192px）
│   │   ├── icon-192.svg           # PWAアイコン（SVG）
│   │   ├── icon-512.png           # PWAアイコン（512px）
│   │   └── manifest.json          # PWAマニフェスト
│   │
│   └── distribution/               # 配布ファイル（ビルド後）
│       ├── DISTRIBUTION_CHECKLIST.md # 配布チェックリスト
│       ├── システム設計アシスタント-1.0.0.dmg
│       ├── システム設計アシスタント-1.0.0-arm64.dmg
│       ├── システム設計アシスタント-1.0.0-mac.zip
│       └── システム設計アシスタント-1.0.0-arm64-mac.zip
│
└── 🔧 開発・設定ファイル
    ├── .gitignore                  # Git除外設定
    ├── .env.local                  # ローカル環境変数（非公開）
    └── .env.example                # 環境変数テンプレート
```

### 📊 データベース構造

```
📊 データベース（PostgreSQL）
├── 👤 ユーザー管理
│   ├── auth.users                  # Supabase認証ユーザー
│   └── public.user_profiles        # ユーザープロファイル
│
├── 📋 プロジェクト管理
│   ├── public.projects             # プロジェクト情報
│   ├── public.project_members      # プロジェクトメンバー
│   └── public.project_invitations  # プロジェクト招待
│
├── 🎯 システム設計支援
│   ├── public.phases               # 設計フェーズ
│   ├── public.tasks                # タスク管理
│   └── public.deliverables         # 成果物管理
│
└── 🔐 セキュリティ
    ├── RLS（Row Level Security）   # 行レベルセキュリティ
    ├── トリガー関数                # データ整合性
    └── ポリシー                    # アクセス制御
```

### 🔄 データフロー

```
🔄 リアルタイムデータフロー
├── 📱 クライアント端末
│   ├── Webブラウザ（React）
│   ├── デスクトップアプリ（Electron）
│   └── モバイルアプリ（PWA）
│
├── 🌐 ネットワーク層
│   ├── Vercel（CDN・ホスティング）
│   └── API Gateway
│
├── 🗄️ バックエンド
│   ├── Supabase（PostgreSQL）
│   ├── Supabase Auth（認証）
│   ├── Supabase Realtime（リアルタイム）
│   └── Supabase Edge Functions（サーバーレス）
│
└── 📧 外部サービス
    └── Resend（メール送信）
```

## 🔧 開発

### データベースマイグレーション
```bash
# 新しいマイグレーションの作成
supabase migration new migration_name

# マイグレーションの適用
supabase db reset
```

### Edge Functions
```bash
# Edge Functionのデプロイ
supabase functions deploy function_name
```

### ビルド
```bash
# Webアプリのビルド
npm run build

# Electronアプリのビルド
npm run electron:build

# プラットフォーム別ビルド
npm run build:mac    # macOS
npm run build:win    # Windows
npm run build:all    # 全プラットフォーム
```

## 🔒 セキュリティ

- **Supabase Auth**による認証
- **Row Level Security (RLS)**によるデータ保護
- **環境変数**による機密情報管理
- **セキュアな招待システム**
- **HTTPS通信**の必須
- **パスワードの暗号化**
- **セッション管理**
- **CSRF対策**

## 📱 対応プラットフォーム

- **Webブラウザ** (Chrome, Firefox, Safari, Edge)
- **モバイルブラウザ** (iOS Safari, Android Chrome)
- **デスクトップアプリ** (Electron)
- **PWA** (Progressive Web App)

## 🖥️ システム要件

### 最小要件
- **OS**: macOS 10.14+, Windows 10, Ubuntu 18.04+
- **メモリ**: 4GB RAM
- **ストレージ**: 500MB 空き容量
- **ネットワーク**: インターネット接続

### 推奨要件
- **OS**: macOS 12+, Windows 11, Ubuntu 20.04+
- **メモリ**: 8GB RAM
- **ストレージ**: 1GB 空き容量
- **ネットワーク**: 高速インターネット接続

## 🚀 デプロイ

### Vercel
```bash
# Vercel CLIのインストール
npm i -g vercel

# デプロイ
vercel
```

### 手動デプロイ
```bash
npm run build
# dist/フォルダの内容をWebサーバーにアップロード
```

## 🔧 トラブルシューティング

### よくある問題

1. **アプリが起動しない**
   - システム要件を確認
   - アンチウイルスソフトの除外設定を確認
   - 管理者権限で実行を試行

2. **ネットワークエラー**
   - インターネット接続を確認
   - ファイアウォール設定を確認
   - プロキシ設定を確認

3. **ファイルが保存できない**
   - ディスク容量を確認
   - ファイル権限を確認
   - アンチウイルスソフトの設定を確認

### ログの確認

- **macOS**: `~/Library/Logs/システム設計アシスタント/`
- **Windows**: `%APPDATA%\システム設計アシスタント\logs\`
- **Linux**: `~/.config/システム設計アシスタント/logs/`

## 📚 ドキュメント

詳細なドキュメントは `docs/` フォルダを参照してください：

- [要件定義書](docs/1.要件定義書.md)
- [システム設計書](docs/2.システム設計書.md)
- [機能仕様書](docs/3.機能仕様書.md)
- [技術仕様書](docs/4.技術仕様書.md)
- [データベース設計書](docs/5.データベース設計書.md)
- [API設計書](docs/6.API設計書.md)
- [UIUX設計書](docs/7.UIUX設計書.md)
- [テスト計画書](docs/8.テスト計画書.md)
- [運用設計書](docs/9.運用設計書.md)
- [セキュリティ設計書](docs/10.セキュリティ設計書.md)
- [ユーザーマニュアル](docs/11.ユーザーマニュアル.md)
- [運用マニュアル](docs/12.運用マニュアル.md)

## 📊 実装状況一覧

### ✅ 完全実装済み
- [x] ユーザー認証（Supabase Auth）
- [x] プロジェクト管理（作成・編集・削除・切り替え）
- [x] メンバー管理（招待・権限管理）
- [x] タスク管理（4フェーズ・チェックボックス）
- [x] 成果物管理（ステータス管理・チェックリスト）
- [x] フェーズ管理（4つの設計フェーズ）
- [x] リアルタイム同期（Supabase Realtime）
- [x] モバイル対応（レスポンシブ・PWA）
- [x] デスクトップアプリ（Electron）
- [x] テンプレート機能（要件定義テンプレート）
- [x] メール招待（Resend API）

### ❌ 未実装
- [ ] プッシュ通知（Firebase）
- [ ] 分析機能（Google Analytics）
- [ ] オフライン機能の強化
- [ ] ファイルエクスポート機能
- [ ] チャット機能
- [ ] AI支援機能
- [ ] 高度な分析機能
- [ ] プラグインシステム

## 📈 今後の予定

### v1.1.0 (予定)
- オフライン機能の強化
- ファイルエクスポート機能
- テンプレートの追加
- パフォーマンス最適化

### v1.2.0 (予定)
- チャット機能
- AI支援機能
- 高度な分析機能
- プラグインシステム

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 サポート

- **GitHub Issues**: [プロジェクトページ](https://github.com/yourusername/sys/issues)
- **メール**: support@yourcompany.com
- **ドキュメント**: [オンラインドキュメント](https://docs.yourcompany.com)

---

**リリース日**: 2025年7月20日  
**バージョン**: 1.0.0  
**ビルド**: 20250720-001
