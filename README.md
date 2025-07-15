# システム設計アシスタント（sys）

## 概要

本プロジェクトは、システム開発の「要件定義」「基本設計」「外部設計」「開発準備」までの4フェーズを段階的にサポートするアシスタントアプリケーションです。プロジェクト管理、成果物チェックリスト、ドキュメント管理、テンプレートダウンロードなど、実務で役立つ機能を備えています。

---

## 主な機能

- フェーズ別タスク・成果物管理
- 成果物チェックリスト（進捗率表示・アコーディオン開閉）
- ドキュメント管理（タグ・バージョン・一括DL・右サイドバー開閉）
- テンプレートダウンロード（各フェーズ用の実用的なテンプレート）
- ダッシュボード風UI（Material 3ベース、レスポンシブ対応）

---

## セットアップ手順

1. 依存パッケージのインストール
   ```sh
   npm install
   ```
2. 開発サーバーの起動
   ```sh
   npm run dev
   ```
3. ブラウザで `http://localhost:5173`（または表示されたポート）にアクセス

---

## セーブポイント1の内容
- Tailwind CSSの設定ファイル（tailwind.config.js, postcss.config.js）とglobals.cssの修正が完了
- Viteサーバー起動時のエラー（border-border, outline-ring/50, text-foreground等）がすべて解消
- UIの基礎スタイルが正しく反映される状態

---

## ディレクトリ構成（主要部分）

```
sys/
  ├─ components/
  │    ├─ ui/ ... UIコンポーネント
  │    ├─ figma/ ... Figma連携用
  │    ├─ ... 各種機能コンポーネント
  ├─ styles/
  │    └─ globals.css ... グローバルCSS
  ├─ App.tsx ... ルートコンポーネント
  ├─ main.tsx ... エントリーポイント
  ├─ index.html ... Vite用HTML
  ├─ tailwind.config.js ... Tailwind設定
  ├─ postcss.config.js ... PostCSS設定
  └─ README.md ... このファイル
```

---

## ライセンス

MIT
