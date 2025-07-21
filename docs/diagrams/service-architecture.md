# サービスアーキテクチャ図（実際の使用状況）

## システム全体アーキテクチャ

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#2563eb',
    'primaryTextColor': '#ffffff',
    'primaryBorderColor': '#1d4ed8',
    'lineColor': '#64748b',
    'secondaryColor': '#f1f5f9',
    'tertiaryColor': '#e2e8f0',
    'fontFamily': 'Hiragino Sans, Arial, sans-serif',
    'fontSize': '14px'
  }
}}%%
graph TB
    %% スタイル定義
    classDef clientStyle fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000
    classDef hostingStyle fill:#e8f5e8,stroke:#388e3c,stroke-width:2px,color:#000
    classDef databaseStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    classDef serviceStyle fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef storageStyle fill:#fff8e1,stroke:#f57f17,stroke-width:2px,color:#000
    classDef cdnStyle fill:#e0f2f1,stroke:#00695c,stroke-width:2px,color:#000
    
    %% クライアント層
    subgraph CLIENT["クライアント層"]
        DESKTOP[("デスクトップアプリ<br/>Electron")]
        MOBILE[("モバイルアプリ<br/>React Native")]
        WEB[("ウェブアプリ<br/>React")]
    end
    
    %% ホスティング・CDN層
    subgraph HOSTING["ホスティング・CDN層"]
        VERCEL[("Vercel<br/>ホスティング")]
        CDN[("Vercel Edge<br/>CDN")]
    end
    
    %% バックエンド・データベース層
    subgraph BACKEND["バックエンド・データベース層"]
        SUPABASE[("Supabase<br/>BaaS")]
        POSTGRES[("PostgreSQL<br/>データベース")]
        AUTH[("認証サービス<br/>Supabase Auth")]
        REALTIME[("リアルタイム<br/>WebSocket")]
        STORAGE[("ファイルストレージ<br/>Supabase Storage")]
        FUNCTIONS[("Edge Functions<br/>Supabase Functions")]
    end
    
    %% 外部サービス層
    subgraph EXTERNAL["外部サービス層"]
        RESEND[("メールサービス<br/>Resend")]
    end
    
    %% 開発・運用ツール層
    subgraph TOOLS["開発・運用ツール層"]
        GITHUB[("バージョン管理<br/>GitHub")]
        VERCEL_DASH[("デプロイ管理<br/>Vercel Dashboard")]
        SUPABASE_DASH[("データベース管理<br/>Supabase Dashboard")]
    end
    
    %% 接続関係
    %% クライアントからホスティング
    DESKTOP -->|HTTPS| VERCEL
    MOBILE -->|HTTPS| VERCEL
    WEB -->|HTTPS| VERCEL
    
    %% ホスティングからCDN
    VERCEL -->|静的ファイル配信| CDN
    
    %% ホスティングからバックエンド
    VERCEL -->|API Gateway| SUPABASE
    VERCEL -->|認証| AUTH
    VERCEL -->|リアルタイム通信| REALTIME
    VERCEL -->|ファイル操作| STORAGE
    VERCEL -->|サーバーレス関数| FUNCTIONS
    
    %% バックエンド内部
    SUPABASE -->|データ操作| POSTGRES
    AUTH -->|ユーザー管理| POSTGRES
    REALTIME -->|リアルタイム更新| POSTGRES
    STORAGE -->|ファイル管理| POSTGRES
    
    %% 外部サービス接続
    FUNCTIONS -->|メール送信| RESEND
    
    %% 開発ツール接続
    GITHUB -->|CI/CD| VERCEL
    VERCEL_DASH -->|デプロイ管理| VERCEL
    SUPABASE_DASH -->|データベース管理| SUPABASE
    
    %% スタイル適用
    class DESKTOP,MOBILE,WEB clientStyle
    class VERCEL,CDN hostingStyle
    class SUPABASE,POSTGRES,AUTH,REALTIME,STORAGE,FUNCTIONS databaseStyle
    class RESEND serviceStyle
    class STORAGE storageStyle
    class CDN cdnStyle
```

## データベースアーキテクチャ

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#2563eb',
    'primaryTextColor': '#ffffff',
    'primaryBorderColor': '#1d4ed8',
    'lineColor': '#64748b',
    'secondaryColor': '#f1f5f9',
    'tertiaryColor': '#e2e8f0',
    'fontFamily': 'Hiragino Sans, Arial, sans-serif',
    'fontSize': '14px'
  }
}}%%
erDiagram
    USERS {
        uuid id PK
        string email
        string name
        timestamp created_at
        timestamp updated_at
    }
    
    PROJECTS {
        uuid id PK
        string name
        text description
        uuid owner_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    PROJECT_MEMBERS {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        string role
        timestamp created_at
    }
    
    PHASES {
        uuid id PK
        uuid project_id FK
        string name
        integer order_index
        timestamp created_at
        timestamp updated_at
    }
    
    TASKS {
        uuid id PK
        uuid phase_id FK
        string title
        text description
        string status
        integer order_index
        timestamp created_at
        timestamp updated_at
    }
    
    DELIVERABLES {
        uuid id PK
        uuid task_id FK
        string title
        text description
        string status
        integer order_index
        timestamp created_at
        timestamp updated_at
    }
    
    INVITATIONS {
        uuid id PK
        uuid project_id FK
        string email
        string token
        string status
        timestamp expires_at
        timestamp created_at
    }
    
    USERS ||--o{ PROJECTS : owns
    USERS ||--o{ PROJECT_MEMBERS : is_member_of
    PROJECTS ||--o{ PROJECT_MEMBERS : has_members
    PROJECTS ||--o{ PHASES : contains
    PHASES ||--o{ TASKS : contains
    TASKS ||--o{ DELIVERABLES : produces
    PROJECTS ||--o{ INVITATIONS : sends
```

## 認証・セキュリティアーキテクチャ

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#2563eb',
    'primaryTextColor': '#ffffff',
    'primaryBorderColor': '#1d4ed8',
    'lineColor': '#64748b',
    'secondaryColor': '#f1f5f9',
    'tertiaryColor': '#e2e8f0',
    'fontFamily': 'Hiragino Sans, Arial, sans-serif',
    'fontSize': '14px'
  }
}}%%
sequenceDiagram
    participant Client as クライアント
    participant Auth as Supabase Auth
    participant RLS as Row Level Security
    participant DB as PostgreSQL
    participant API as Edge Functions
    
    Note over Client,API: 認証フロー
    
    Client->>Auth: ログイン要求
    Auth->>Auth: 認証処理
    Auth-->>Client: JWTトークン発行
    
    Note over Client,API: API呼び出し
    
    Client->>API: API要求 + JWT
    API->>Auth: トークン検証
    Auth-->>API: ユーザー情報
    
    Note over Client,API: データベースアクセス
    
    API->>RLS: データベースクエリ
    RLS->>RLS: 権限チェック
    RLS->>DB: 許可されたクエリ実行
    DB-->>RLS: 結果
    RLS-->>API: フィルタリング済み結果
    API-->>Client: レスポンス
    
    Note over Client,API: リアルタイム更新
    
    Client->>Auth: WebSocket接続 + JWT
    Auth->>Auth: トークン検証
    Auth-->>Client: 接続確立
    
    DB->>RLS: データ変更
    RLS->>RLS: 権限チェック
    RLS->>Client: 許可された変更通知
```

## デプロイメント・CI/CDアーキテクチャ

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#2563eb',
    'primaryTextColor': '#ffffff',
    'primaryBorderColor': '#1d4ed8',
    'lineColor': '#64748b',
    'secondaryColor': '#f1f5f9',
    'tertiaryColor': '#e2e8f0',
    'fontFamily': 'Hiragino Sans, Arial, sans-serif',
    'fontSize': '14px'
  }
}}%%
flowchart LR
    %% スタイル定義
    classDef devStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    classDef buildStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    classDef deployStyle fill:#e8f5e8,stroke:#388e3c,stroke-width:2px,color:#000
    classDef monitorStyle fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    
    %% 開発フロー
    subgraph DEV["開発環境"]
        LOCAL[("ローカル開発<br/>Vite + Electron")]
        GIT[("Git管理<br/>GitHub")]
    end
    
    %% ビルド・テスト
    subgraph BUILD["ビルド・テスト"]
        TEST[("テスト実行<br/>Vitest")]
        BUILD_WEB[("Webビルド<br/>Vite")]
        BUILD_DESKTOP[("デスクトップビルド<br/>Electron Builder")]
    end
    
    %% デプロイメント
    subgraph DEPLOY["デプロイメント"]
        VERCEL_DEPLOY[("Vercel<br/>自動デプロイ")]
        SUPABASE_MIGRATE[("Supabase<br/>マイグレーション")]
    end
    
    %% 監視・運用
    subgraph MONITOR["監視・運用"]
        SUPABASE_MONITOR[("Supabase<br/>Monitoring")]
        VERCEL_MONITOR[("Vercel<br/>Dashboard")]
    end
    
    %% フロー
    LOCAL -->|コード変更| GIT
    GIT -->|プッシュ| TEST
    TEST -->|テスト通過| BUILD_WEB
    TEST -->|テスト通過| BUILD_DESKTOP
    BUILD_WEB -->|ビルド成功| VERCEL_DEPLOY
    BUILD_DESKTOP -->|ビルド成功| VERCEL_DEPLOY
    VERCEL_DEPLOY -->|デプロイ完了| SUPABASE_MIGRATE
    VERCEL_DEPLOY -->|本番環境| SUPABASE_MONITOR
    VERCEL_DEPLOY -->|本番環境| VERCEL_MONITOR
    
    %% スタイル適用
    class LOCAL,GIT devStyle
    class TEST,BUILD_WEB,BUILD_DESKTOP buildStyle
    class VERCEL_DEPLOY,SUPABASE_MIGRATE deployStyle
    class SUPABASE_MONITOR,VERCEL_MONITOR monitorStyle
```

## サービス連携アーキテクチャ

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#2563eb',
    'primaryTextColor': '#ffffff',
    'primaryBorderColor': '#1d4ed8',
    'lineColor': '#64748b',
    'secondaryColor': '#f1f5f9',
    'tertiaryColor': '#e2e8f0',
    'fontFamily': 'Hiragino Sans, Arial, sans-serif',
    'fontSize': '14px'
  }
}}%%
graph TB
    %% スタイル定義
    classDef coreStyle fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000
    classDef serviceStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    classDef externalStyle fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef dataStyle fill:#e8f5e8,stroke:#388e3c,stroke-width:2px,color:#000
    
    %% コアサービス
    subgraph CORE["コアサービス"]
        APP[("メインアプリケーション<br/>React + TypeScript")]
        API[("API Gateway<br/>Supabase")]
        DB[("データベース<br/>PostgreSQL")]
    end
    
    %% 外部サービス
    subgraph EXTERNAL["外部サービス"]
        RESEND[("メール配信<br/>Resend")]
        STORAGE[("ファイル保存<br/>Supabase Storage")]
    end
    
    %% 開発・運用サービス
    subgraph DEVOPS["開発・運用サービス"]
        VERCEL[("ホスティング<br/>Vercel")]
        GITHUB[("バージョン管理<br/>GitHub")]
        SUPABASE_DASH[("管理画面<br/>Supabase Dashboard")]
    end
    
    %% データフロー
    subgraph DATA["データフロー"]
        CACHE[("キャッシュ<br/>ブラウザ/ローカル")]
        SYNC[("同期管理<br/>リアルタイム")]
        QUEUE[("キュー<br/>オフライン処理")]
    end
    
    %% 接続関係
    APP -->|API呼び出し| API
    API -->|データ操作| DB
    API -->|メール送信| RESEND
    API -->|ファイル操作| STORAGE
    
    APP -->|キャッシュ| CACHE
    APP -->|同期| SYNC
    APP -->|オフライン| QUEUE
    
    VERCEL -->|デプロイ| APP
    GITHUB -->|CI/CD| VERCEL
    SUPABASE_DASH -->|管理| API
    
    %% スタイル適用
    class APP,API,DB coreStyle
    class RESEND,STORAGE externalStyle
    class VERCEL,GITHUB,SUPABASE_DASH serviceStyle
    class CACHE,SYNC,QUEUE dataStyle
```

## セキュリティ・コンプライアンス

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#2563eb',
    'primaryTextColor': '#ffffff',
    'primaryBorderColor': '#1d4ed8',
    'lineColor': '#64748b',
    'secondaryColor': '#f1f5f9',
    'tertiaryColor': '#e2e8f0',
    'fontFamily': 'Hiragino Sans, Arial, sans-serif',
    'fontSize': '14px'
  }
}}%%
mindmap
  root((セキュリティ・コンプライアンス))
    認証・認可
      JWT認証
      Row Level Security
      多要素認証
      セッション管理
    データ保護
      暗号化（転送時）
      暗号化（保存時）
      データマスキング
      バックアップ暗号化
    通信セキュリティ
      HTTPS/TLS 1.3
      WebSocket Secure
      API認証
      CORS設定
    インフラセキュリティ
      Vercelセキュリティ
      Supabaseセキュリティ
      CDN保護
      DDoS対策
    コンプライアンス
      GDPR対応
      個人情報保護法
      データローカリティ
      監査ログ
    監視・ログ
      セキュリティログ
      アクセスログ
      エラーログ
      パフォーマンス監視
```

## コスト構造

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#2563eb',
    'primaryTextColor': '#ffffff',
    'primaryBorderColor': '#1d4ed8',
    'lineColor': '#64748b',
    'secondaryColor': '#f1f5f9',
    'tertiaryColor': '#e2e8f0',
    'fontFamily': 'Hiragino Sans, Arial, sans-serif',
    'fontSize': '14px'
  }
}}%%
pie title 月間コスト構造（概算）
    "Vercel (ホスティング)" : 20
    "Supabase (データベース)" : 25
    "Resend (メール配信)" : 15
    "その他 (ドメイン、SSL等)" : 5
    "予備・スケールアップ" : 35
```

## 📋 実際の使用サービス一覧

| サービス | 用途 | 設定ファイル | パッケージ |
|----------|------|-------------|-----------|
| **Vercel** | ホスティング・デプロイメント | `vercel.json` | - |
| **Supabase** | バックエンド・データベース | `lib/supabase.ts` | `@supabase/supabase-js` |
| **Resend** | メール配信 | `supabase/functions/send-email/` | - |

## 🔧 環境変数設定

```bash
# Supabase設定
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend設定（メール送信機能）
VITE_RESEND_API_KEY=your_resend_api_key
VITE_FROM_EMAIL=onboarding@resend.dev
VITE_ENABLE_EMAIL_SENDING=true
``` 