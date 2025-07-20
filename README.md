# システム設計アシスタント

プロジェクト管理とシステム設計を支援するWebアプリケーションです。デスクトップとモバイルの両方に対応したレスポンシブデザインを採用しています。

## 🚀 主要機能

### 📋 プロジェクト管理
- **プロジェクトの作成・削除・切り替え**
- **プロジェクトメンバーの招待・管理**
- **リアルタイム同期**
- **権限管理（オーナー、管理者、メンバー）**

### 🎯 システム設計支援
- **4つのフェーズ管理**
  - 要件定義
  - 基本設計
  - 外部設計
  - 開発準備
- **各フェーズのタスク管理**
- **成果物の管理と進捗追跡**
- **進捗の可視化**

### 📱 モバイル対応
- **レスポンシブデザイン**
- **タッチフレンドリーなUI**
- **モーダルナビゲーション**
- **PWA対応**

### 📧 招待システム
- **メール招待機能（Resend API）**
- **招待の受け入れ・辞退**
- **セキュアなトークン管理**

### 📚 ドキュメント管理
- **テンプレート機能**
- **ダウンロード可能なテンプレート**
- **要件定義テンプレート**
- **ドキュメントの整理・管理**

### 🎨 UI/UX機能
- **ダークモード対応**
- **アニメーション効果**
- **直感的なナビゲーション**
- **リアルタイム通知**

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
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RESEND_API_KEY=your_resend_api_key
VITE_FROM_EMAIL=your_from_email
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

## 📁 プロジェクト構造

```
sys/
├── components/              # Reactコンポーネント
│   ├── ui/                 # shadcn/uiコンポーネント
│   ├── Header.tsx          # ヘッダー
│   ├── MainApp.tsx         # デスクトップメインアプリ
│   ├── MobileApp.tsx       # モバイルメインアプリ
│   ├── ProjectSelector.tsx # プロジェクト選択
│   ├── Templates.tsx       # テンプレート機能
│   ├── DocumentManager.tsx # ドキュメント管理
│   └── ...
├── contexts/               # React Context
│   ├── AuthContext.tsx     # 認証管理
│   ├── ProjectContext.tsx  # プロジェクト管理
│   ├── ProjectDataContext.tsx # プロジェクトデータ
│   └── ProjectMembersContext.tsx # メンバー管理
├── lib/                   # ユーティリティ
│   ├── supabase.ts        # Supabase設定
│   └── email.ts           # メール機能
├── supabase/              # Supabase設定
│   ├── migrations/        # データベースマイグレーション
│   ├── functions/         # Edge Functions
│   └── config.toml        # Supabase設定
├── docs/                  # ドキュメント
└── styles/                # スタイルシート
```

## 🎯 主要機能詳細

### プロジェクト管理
- **プロジェクトの作成・削除**
- **プロジェクトメンバーの招待**
- **リアルタイム同期**
- **権限ベースのアクセス制御**

### タスク管理
- **フェーズ別タスク管理**
- **チェックボックスによる進捗管理**
- **優先度設定**
- **順番の固定（order_index）**

### 成果物管理
- **フェーズ別成果物管理**
- **ステータス管理（未着手/進行中/完了）**
- **成果物チェックリスト**
- **進捗の可視化**

### 招待システム
- **メール招待（Resend API）**
- **招待の受け入れ・辞退**
- **セキュアなトークン管理**
- **権限管理**

### テンプレート機能
- **要件定義テンプレート**
- **ダウンロード可能なテンプレート**
- **カスタマイズ可能なテンプレート**

### モバイル対応
- **レスポンシブデザイン**
- **タッチフレンドリーなUI**
- **モーダルナビゲーション**
- **PWA対応**

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

## 🔒 セキュリティ

- **Supabase Auth**による認証
- **Row Level Security (RLS)**によるデータ保護
- **環境変数**による機密情報管理
- **セキュアな招待システム**

## 📱 対応プラットフォーム

- **Webブラウザ** (Chrome, Firefox, Safari, Edge)
- **モバイルブラウザ** (iOS Safari, Android Chrome)
- **デスクトップアプリ** (Electron)
- **PWA** (Progressive Web App)

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

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 サポート

問題や質問がある場合は、GitHubのIssuesページでお知らせください。
