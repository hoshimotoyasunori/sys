# データフロー図 - 図示方法比較

このディレクトリには、システム設計アシスタントの3端末間データ同期フローを様々な方法で図示したファイルが含まれています。

## 📁 ファイル一覧

| ファイル名 | 形式 | 特徴 | 推奨度 |
|-----------|------|------|--------|
| `plantuml-data-flow.puml` | PlantUML | プロフェッショナル、見やすい | ⭐⭐⭐⭐⭐ |
| `drawio-data-flow.drawio` | Draw.io XML | 直感的、編集しやすい | ⭐⭐⭐⭐ |
| `optimized-mermaid.md` | Mermaid最適化 | 既存改善、設定調整 | ⭐⭐⭐ |
| `DataFlowDiagram.tsx` | React Flow | インタラクティブ、アプリ内表示 | ⭐⭐⭐⭐ |
| `table-format.md` | 表形式 | 簡潔、読みやすい | ⭐⭐⭐ |

## 🎯 各方法の特徴比較

### 1. PlantUML
**ファイル**: `plantuml-data-flow.puml`

**特徴**:
- ✅ 最も見やすく、プロフェッショナル
- ✅ 豊富なカスタマイズオプション
- ✅ 日本語フォント対応
- ✅ 色分けとレイアウトが美しい
- ❌ 専用ツールが必要

**使用方法**:
```bash
# VSCode/Cursor拡張機能をインストール
# "PlantUML" by jebbs を検索してインストール

# または、オンラインで表示
# https://www.plantuml.com/plantuml/uml/ にコードを貼り付け
```

### 2. Draw.io
**ファイル**: `drawio-data-flow.drawio`

**特徴**:
- ✅ 直感的な操作
- ✅ 豊富なテンプレート
- ✅ オンライン/オフライン対応
- ✅ リアルタイムコラボレーション
- ❌ ファイルサイズが大きい

**使用方法**:
```bash
# オンラインで開く
# https://app.diagrams.net/ にアクセス
# ファイル > 開く > drawio-data-flow.drawio を選択

# または、VSCode拡張機能
# "Draw.io Integration" をインストール
```

### 3. Mermaid最適化
**ファイル**: `optimized-mermaid.md`

**特徴**:
- ✅ 既存のMermaidを改善
- ✅ テーマとスタイル調整
- ✅ 日本語フォント対応
- ✅ 複数図タイプ（フローチャート、シーケンス、クラス）
- ❌ 基本的なMermaidの制限

**使用方法**:
```bash
# Markdownファイルとして表示
# GitHub、VSCode、その他のMarkdownビューアーで表示可能
```

### 4. React Flow
**ファイル**: `components/DataFlowDiagram.tsx`

**特徴**:
- ✅ インタラクティブ操作
- ✅ アプリ内で動的表示
- ✅ カスタムノードとスタイル
- ✅ ズーム・パン・ミニマップ
- ❌ Reactアプリケーションが必要

**使用方法**:
```bash
# 依存関係をインストール
npm install reactflow

# コンポーネントをインポート
import DataFlowDiagram from './components/DataFlowDiagram';

# アプリ内で使用
<DataFlowDiagram />
```

### 5. 表形式
**ファイル**: `table-format.md`

**特徴**:
- ✅ 最も簡潔で読みやすい
- ✅ 詳細な情報を整理
- ✅ 検索・フィルタリング可能
- ✅ 印刷に最適
- ❌ 視覚的な関係性が分かりにくい

**使用方法**:
```bash
# Markdownファイルとして表示
# 表形式なので、どのMarkdownビューアーでも見やすい
```

## 🚀 推奨使用方法

### 開発チーム向け
1. **PlantUML** - 技術文書、設計書
2. **Draw.io** - プレゼンテーション、会議資料
3. **表形式** - 詳細仕様、API仕様書

### エンドユーザー向け
1. **React Flow** - アプリ内ヘルプ、チュートリアル
2. **Mermaid最適化** - ドキュメント、README
3. **表形式** - ユーザーマニュアル、FAQ

### プレゼンテーション向け
1. **Draw.io** - スライド、配布資料
2. **PlantUML** - 技術プレゼン
3. **表形式** - 比較資料、統計

## 🔧 インストール手順

### PlantUML
```bash
# VSCode/Cursor拡張機能
# 1. 拡張機能タブを開く
# 2. "PlantUML" を検索
# 3. "PlantUML" by jebbs をインストール
# 4. .pumlファイルを開いて表示
```

### Draw.io
```bash
# VSCode/Cursor拡張機能
# 1. 拡張機能タブを開く
# 2. "Draw.io Integration" を検索
# 3. インストール
# 4. .drawioファイルを開いて編集
```

### React Flow
```bash
# 依存関係インストール
npm install reactflow

# TypeScript型定義（必要に応じて）
npm install @types/reactflow
```

## 📊 比較表

| 項目 | PlantUML | Draw.io | Mermaid | React Flow | 表形式 |
|------|----------|---------|---------|------------|--------|
| **見やすさ** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **編集しやすさ** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **カスタマイズ性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **学習コスト** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **ファイルサイズ** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **バージョン管理** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🎨 カスタマイズ例

### PlantUML テーマ変更
```plantuml
!theme cerulean
!theme plain
!theme dark
```

### Mermaid スタイル調整
```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ff0000' }}}%%
```

### React Flow カスタムノード
```tsx
const CustomNode = ({ data }) => (
  <div style={{ background: data.color }}>
    {data.label}
  </div>
);
```

## 📝 更新履歴

- **2025-07-20**: 初回作成
  - PlantUML版作成
  - Draw.io版作成
  - Mermaid最適化版作成
  - React Flow版作成
  - 表形式版作成

## 🤝 コントリビューション

新しい図示方法や改善案があれば、以下の手順で追加してください：

1. 新しいファイルを作成
2. このREADMEに追加
3. 比較表を更新
4. 使用例を追加

## 📞 サポート

図示方法について質問がある場合は、以下の方法でサポートを受けられます：

- **PlantUML**: [公式ドキュメント](https://plantuml.com/)
- **Draw.io**: [公式サイト](https://app.diagrams.net/)
- **Mermaid**: [公式ドキュメント](https://mermaid.js.org/)
- **React Flow**: [公式ドキュメント](https://reactflow.dev/) 