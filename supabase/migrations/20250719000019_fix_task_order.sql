-- タスクと成果物のorder_indexを正しく設定

-- 要件定義フェーズのタスクのorder_indexを設定
UPDATE tasks 
SET order_index = CASE 
  WHEN title = 'プロジェクトの目的と目標の明確化' THEN 1
  WHEN title = '現状業務の分析と課題特定' THEN 2
  WHEN title = 'ユーザーヒアリングと要求収集' THEN 3
  WHEN title = '機能要件の洗い出しと詳細化' THEN 4
  WHEN title = '非機能要件の定義' THEN 5
  WHEN title = '要件の優先順位付け' THEN 6
  ELSE order_index
END
WHERE phase_id IN (SELECT id FROM phases WHERE name = '要件定義');

-- 基本設計フェーズのタスクのorder_indexを設定
UPDATE tasks 
SET order_index = CASE 
  WHEN title = 'システム全体構成設計' THEN 1
  WHEN title = 'データベース論理・物理設計' THEN 2
  WHEN title = '機能概要設計' THEN 3
  WHEN title = '外部インターフェース設計' THEN 4
  WHEN title = '画面遷移設計' THEN 5
  WHEN title = '非機能要件の詳細化' THEN 6
  ELSE order_index
END
WHERE phase_id IN (SELECT id FROM phases WHERE name = '基本設計');

-- 外部設計フェーズのタスクのorder_indexを設定
UPDATE tasks 
SET order_index = CASE 
  WHEN title = 'ユーザーインターフェース設計' THEN 1
  WHEN title = 'ユーザーエクスペリエンス設計' THEN 2
  WHEN title = '入力・出力情報の詳細設計' THEN 3
  WHEN title = 'エラーハンドリングの検討' THEN 4
  WHEN title = '帳票設計' THEN 5
  WHEN title = 'テスト計画の詳細作成' THEN 6
  ELSE order_index
END
WHERE phase_id IN (SELECT id FROM phases WHERE name = '外部設計');

-- 開発準備フェーズのタスクのorder_indexを設定
UPDATE tasks 
SET order_index = CASE 
  WHEN title = '開発環境の構築' THEN 1
  WHEN title = '開発技術の最終決定' THEN 2
  WHEN title = 'バージョン管理システムの導入' THEN 3
  WHEN title = 'コーディング規約の策定' THEN 4
  WHEN title = '開発スケジュールの詳細化' THEN 5
  WHEN title = '課題管理・進捗管理ツールの準備' THEN 6
  ELSE order_index
END
WHERE phase_id IN (SELECT id FROM phases WHERE name = '開発準備');

-- 要件定義フェーズの成果物のorder_indexを設定
UPDATE deliverables 
SET order_index = CASE 
  WHEN name = '企画書' THEN 1
  WHEN name = '要件定義書' THEN 2
  WHEN name = '業務フロー図（As-Is/To-Be）' THEN 3
  ELSE order_index
END
WHERE phase_id IN (SELECT id FROM phases WHERE name = '要件定義');

-- 基本設計フェーズの成果物のorder_indexを設定
UPDATE deliverables 
SET order_index = CASE 
  WHEN name = '基本設計書（外部設計書）' THEN 1
  WHEN name = 'テスト計画書（概要）' THEN 2
  ELSE order_index
END
WHERE phase_id IN (SELECT id FROM phases WHERE name = '基本設計');

-- 外部設計フェーズの成果物のorder_indexを設定
UPDATE deliverables 
SET order_index = CASE 
  WHEN name = '画面設計書' THEN 1
  WHEN name = 'ワイヤーフレーム・プロトタイプ' THEN 2
  WHEN name = '入出力設計書' THEN 3
  ELSE order_index
END
WHERE phase_id IN (SELECT id FROM phases WHERE name = '外部設計');

-- 開発準備フェーズの成果物のorder_indexを設定
UPDATE deliverables 
SET order_index = CASE 
  WHEN name = '開発環境構築手順書' THEN 1
  WHEN name = 'コーディング規約' THEN 2
  WHEN name = '開発スケジュール詳細' THEN 3
  ELSE order_index
END
WHERE phase_id IN (SELECT id FROM phases WHERE name = '開発準備'); 