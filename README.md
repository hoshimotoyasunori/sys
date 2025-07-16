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
   npm install --legacy-peer-deps
   ```
   ※依存関係の衝突を回避するため、必ず--legacy-peer-depsオプションを付けてインストールしてください。
2. 開発サーバーの起動
   ```sh
   npm run dev
   ```
3. ブラウザで `http://localhost:5173`（または表示されたポート）にアクセス

---

## Electron本番ビルドで正常動作させるための注意点

1. **vite.config.ts の base オプションは必ず './' に設定してください。**
   - 例: `export default defineConfig({ base: './', ... })`
   - これにより、ビルド後のアセットパスが相対パスとなり、Electronのfile://スキームでも正しく読み込まれます。
2. **パッケージング前に必ず `npm run build` を実行し、dist/ フォルダに静的ファイルを出力してください。**
3. **electron-main.js では本番時に dist/index.html を loadFile で読み込むようにしてください。**
   - 例: `win.loadFile(path.join(__dirname, 'dist/index.html'));`
4. **アセット（画像やCSS、JSなど）は絶対パスではなく、相対パスやViteのimportを使って参照してください。**
5. **依存パッケージのインストールは `npm install --legacy-peer-deps` を推奨します。**

これらを守ることで、Electronパッケージング後も「真っ白」にならず正常に動作します。

---

## Electronアプリのビルド・配布方法

### 1. 依存パッケージのインストール
```sh
npm install
```

### 2. 本番ビルド（Viteで静的ファイル生成）
```sh
npm run build
```

### 3. Electronパッケージング
- **Mac用:**
  ```sh
  npm run build:mac
  ```
- **Windows用:**
  ```sh
  npm run build:win
  ```
- **両方まとめて:**
  ```sh
  npm run build:all
  ```

### 4. 出力ファイル
- `dist_electron/` または `release/` ディレクトリにインストーラー（.dmg, .exe）が生成されます。

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

---

## エンドユーザー向けインストール手順

### 動作環境
- **Mac**: macOS 12 Monterey 以降（Intel/Apple Silicon 両対応）
- **Windows**: Windows 10/11（64bit）
- **Linux**: Ubuntu 20.04 以降、AppImage/Snap対応ディストリビューション

### インストール方法
1. 配布されたインストーラー（`*.dmg`, `*.exe`, `*.AppImage` など）をダウンロードします。
2. 各OSごとに以下の手順でインストールしてください。

#### Macの場合（.dmg）
- ダウンロードした `.dmg` ファイルをダブルクリックして開き、アプリケーションフォルダにドラッグ＆ドロップしてください。
- Gatekeeperの警告が出る場合は、右クリック→「開く」で実行できます。

#### Windowsの場合（.exe）
- ダウンロードした `.exe` ファイルをダブルクリックし、画面の指示に従ってインストールしてください。
- セキュリティ警告が出る場合は「詳細情報」→「実行」を選択してください。

#### Linuxの場合（.AppImage/Snap）
- `.AppImage` ファイルの場合は、実行権限を付与してからダブルクリックで起動できます。
  ```sh
  chmod +x システム設計アシスタント-*.AppImage
  ./システム設計アシスタント-*.AppImage
  ```
- Snapパッケージの場合は、`snap install` コマンドでインストールしてください。

### 注意事項
- インストール時にセキュリティ警告が表示される場合がありますが、配布元が信頼できる場合のみ実行してください。
- アプリの自動アップデート機能はありません。新しいバージョンが配布された場合は再インストールしてください。
- ご不明点や不具合は配布元までご連絡ください。
