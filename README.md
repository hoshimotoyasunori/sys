# システム設計アシスタント

プロジェクト管理とシステム設計を支援するWebアプリケーションです。

## 機能

### プロジェクト管理
- プロジェクトの作成・削除・切り替え
- プロジェクトメンバーの招待・管理
- リアルタイム同期

### システム設計支援
- 4つのフェーズ（要件定義、基本設計、外部設計、開発準備）
- 各フェーズのタスク管理
- 成果物の管理
- 進捗の可視化

### 招待システム
- メール招待機能
- 招待の受け入れ・辞退
- 権限管理（オーナー、管理者、メンバー）

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **バックエンド**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **リアルタイム**: Supabase Realtime
- **メール**: Supabase Edge Functions

## セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env`ファイルを作成し、Supabaseの設定を追加：
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
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
npm run dev
```

## プロジェクト構造

```
sys/
├── components/          # Reactコンポーネント
│   ├── ui/             # shadcn/uiコンポーネント
│   ├── Header.tsx      # ヘッダー
│   ├── MainApp.tsx     # メインアプリケーション
│   └── ...
├── contexts/           # React Context
│   ├── AuthContext.tsx
│   ├── ProjectContext.tsx
│   └── ...
├── lib/               # ユーティリティ
│   ├── supabase.ts    # Supabase設定
│   └── email.ts       # メール機能
├── supabase/          # Supabase設定
│   ├── migrations/    # データベースマイグレーション
│   ├── functions/     # Edge Functions
│   └── config.toml    # Supabase設定
└── styles/            # スタイルシート
```

## 主要機能

### プロジェクト管理
- プロジェクトの作成・削除
- プロジェクトメンバーの招待
- リアルタイム同期

### タスク管理
- フェーズ別タスク管理
- チェックボックスによる進捗管理
- 順番の固定（order_index）

### 成果物管理
- フェーズ別成果物管理
- ステータス管理
- ドキュメント管理

### 招待システム
- メール招待
- 招待の受け入れ・辞退
- 権限管理

## 開発

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

## ライセンス

MIT License
