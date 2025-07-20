-- タスクと成果物テーブルにproject_idフィールドを追加
-- 既存のデータをphase_idからproject_idを取得して移行

-- タスクテーブルにproject_idカラムを追加
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS project_id UUID;

-- 成果物テーブルにproject_idカラムを追加
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS project_id UUID;

-- 既存のタスクデータのproject_idを更新
UPDATE tasks 
SET project_id = (
  SELECT p.project_id 
  FROM phases p 
  WHERE p.id = tasks.phase_id
)
WHERE project_id IS NULL;

-- 既存の成果物データのproject_idを更新
UPDATE deliverables 
SET project_id = (
  SELECT p.project_id 
  FROM phases p 
  WHERE p.id = deliverables.phase_id
)
WHERE project_id IS NULL;

-- project_idをNOT NULLに設定
ALTER TABLE tasks ALTER COLUMN project_id SET NOT NULL;
ALTER TABLE deliverables ALTER COLUMN project_id SET NOT NULL;

-- 外部キー制約を追加（既存の制約がある場合は削除してから追加）
DO $$ 
BEGIN
    -- tasksテーブルの外部キー制約
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'fk_tasks_project_id' AND table_name = 'tasks') THEN
        ALTER TABLE tasks DROP CONSTRAINT fk_tasks_project_id;
    END IF;
    
    -- deliverablesテーブルの外部キー制約
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'fk_deliverables_project_id' AND table_name = 'deliverables') THEN
        ALTER TABLE deliverables DROP CONSTRAINT fk_deliverables_project_id;
    END IF;
END $$;

ALTER TABLE tasks ADD CONSTRAINT fk_tasks_project_id 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE deliverables ADD CONSTRAINT fk_deliverables_project_id 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- インデックスを追加
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_project_id ON deliverables(project_id);

-- 既存のプロジェクトに対してタスクと成果物が存在しない場合、作成する
DO $$
DECLARE
    project_record RECORD;
    phase_record RECORD;
    owner_id UUID;
    existing_tasks_count INTEGER;
    existing_deliverables_count INTEGER;
BEGIN
    -- 各プロジェクトをループ
    FOR project_record IN 
        SELECT id FROM projects
    LOOP
        -- プロジェクトオーナーを取得
        SELECT user_id INTO owner_id
        FROM project_members
        WHERE project_id = project_record.id AND role = 'owner'
        LIMIT 1;
        
        -- 既にタスクと成果物が存在するかチェック
        SELECT COUNT(*) INTO existing_tasks_count 
        FROM tasks 
        WHERE project_id = project_record.id;
        
        SELECT COUNT(*) INTO existing_deliverables_count 
        FROM deliverables 
        WHERE project_id = project_record.id;
        
        -- 既にタスクと成果物が存在する場合はスキップ
        IF existing_tasks_count > 0 OR existing_deliverables_count > 0 THEN
            CONTINUE;
        END IF;
        
        -- 各フェーズに対してタスクと成果物を作成
        FOR phase_record IN 
            SELECT id, name FROM phases WHERE project_id = project_record.id ORDER BY order_index
        LOOP
            -- 要件定義フェーズのタスクと成果物
            IF phase_record.name = '要件定義' THEN
                -- タスク
                INSERT INTO tasks (project_id, phase_id, title, description, status, priority, created_by, order_index) VALUES
                (project_record.id, phase_record.id, 'プロジェクトの目的と目標の明確化', 'システム開発の目的、ターゲット、期待効果、ビジネスゴールを明確にする', 'todo', 'high', owner_id, 1),
                (project_record.id, phase_record.id, '現状業務の分析と課題特定', '現在の業務プロセスを分析し、課題や改善点を特定する', 'todo', 'high', owner_id, 2),
                (project_record.id, phase_record.id, 'ユーザーヒアリングと要求収集', 'ステークホルダーからのヒアリングを通じて要求を収集・整理する', 'todo', 'high', owner_id, 3),
                (project_record.id, phase_record.id, '機能要件の洗い出しと詳細化', 'システムが備えるべき機能を具体的に定義し、詳細化する', 'todo', 'high', owner_id, 4),
                (project_record.id, phase_record.id, '非機能要件の定義', '性能、セキュリティ、可用性、保守性などの非機能要件を定義する', 'todo', 'medium', owner_id, 5),
                (project_record.id, phase_record.id, '要件の優先順位付け', 'MoSCoW法などを用いて要件の優先順位を決定する', 'todo', 'medium', owner_id, 6);
                
                -- 成果物
                INSERT INTO deliverables (project_id, phase_id, name, description, type, status, created_by, order_index) VALUES
                (project_record.id, phase_record.id, '企画書', 'システム開発の目的、ターゲット、期待効果、ビジネスゴールなどをまとめた文書', 'document', 'pending', owner_id, 1),
                (project_record.id, phase_record.id, '現状業務分析書', '現在の業務プロセスと課題を分析した文書', 'document', 'pending', owner_id, 2),
                (project_record.id, phase_record.id, '要件定義書', '機能要件と非機能要件を詳細に記述した文書', 'document', 'pending', owner_id, 3);
            
            -- 基本設計フェーズのタスクと成果物
            ELSIF phase_record.name = '基本設計' THEN
                -- タスク
                INSERT INTO tasks (project_id, phase_id, title, description, status, priority, created_by, order_index) VALUES
                (project_record.id, phase_record.id, 'システム構成の設計', 'システム全体の構成とアーキテクチャを設計する', 'todo', 'high', owner_id, 1),
                (project_record.id, phase_record.id, 'データベース設計', 'データベースのテーブル設計とリレーションを定義する', 'todo', 'high', owner_id, 2),
                (project_record.id, phase_record.id, 'API設計', 'システム間連携のためのAPI仕様を設計する', 'todo', 'high', owner_id, 3),
                (project_record.id, phase_record.id, 'セキュリティ設計', '認証・認可、データ保護などのセキュリティ要件を設計する', 'todo', 'medium', owner_id, 4),
                (project_record.id, phase_record.id, '性能設計', 'システムの性能要件を満たすための設計を行う', 'todo', 'medium', owner_id, 5),
                (project_record.id, phase_record.id, '運用設計', 'システムの運用・保守に関する設計を行う', 'todo', 'medium', owner_id, 6);
                
                -- 成果物
                INSERT INTO deliverables (project_id, phase_id, name, description, type, status, created_by, order_index) VALUES
                (project_record.id, phase_record.id, 'システム構成図', 'システム全体の構成を図示した文書', 'document', 'pending', owner_id, 1),
                (project_record.id, phase_record.id, 'データベース設計書', 'テーブル定義、ER図、正規化結果などを記述', 'document', 'pending', owner_id, 2),
                (project_record.id, phase_record.id, 'API仕様書', 'APIのエンドポイント、パラメータ、レスポンス形式を定義', 'document', 'pending', owner_id, 3);
            
            -- 外部設計フェーズのタスクと成果物
            ELSIF phase_record.name = '外部設計' THEN
                -- タスク
                INSERT INTO tasks (project_id, phase_id, title, description, status, priority, created_by, order_index) VALUES
                (project_record.id, phase_record.id, '画面設計', 'ユーザーインターフェースの画面設計を行う', 'todo', 'high', owner_id, 1),
                (project_record.id, phase_record.id, 'ユーザビリティ設計', 'ユーザーにとって使いやすいUI/UXを設計する', 'todo', 'high', owner_id, 2),
                (project_record.id, phase_record.id, '入出力設計', 'データの入力・出力形式を設計する', 'todo', 'high', owner_id, 3),
                (project_record.id, phase_record.id, 'プロトタイプ作成', '画面のプロトタイプを作成してユーザビリティを検証する', 'todo', 'medium', owner_id, 4),
                (project_record.id, phase_record.id, 'ユーザーテスト実施', 'プロトタイプを使用してユーザーテストを実施する', 'todo', 'medium', owner_id, 5),
                (project_record.id, phase_record.id, 'テスト計画の詳細作成', '単体テスト、結合テスト、総合テストの範囲を詳細化する', 'todo', 'medium', owner_id, 6);
                
                -- 成果物
                INSERT INTO deliverables (project_id, phase_id, name, description, type, status, created_by, order_index) VALUES
                (project_record.id, phase_record.id, '画面設計書', '各画面のレイアウト、操作フロー、UI仕様を記述した文書', 'document', 'pending', owner_id, 1),
                (project_record.id, phase_record.id, 'ワイヤーフレーム・プロトタイプ', '画面のワイヤーフレームとプロトタイプ', 'design', 'pending', owner_id, 2),
                (project_record.id, phase_record.id, '入出力設計書', 'データの入出力仕様を詳細に記述した文書', 'document', 'pending', owner_id, 3);
            
            -- 開発準備フェーズのタスクと成果物
            ELSIF phase_record.name = '開発準備' THEN
                -- タスク
                INSERT INTO tasks (project_id, phase_id, title, description, status, priority, created_by, order_index) VALUES
                (project_record.id, phase_record.id, '開発環境の構築', '開発に必要な環境をセットアップする', 'todo', 'high', owner_id, 1),
                (project_record.id, phase_record.id, '開発技術の最終決定', '開発言語、フレームワーク、ライブラリの最終決定とセットアップ', 'todo', 'high', owner_id, 2),
                (project_record.id, phase_record.id, 'バージョン管理システムの導入', 'Git等のバージョン管理システム導入とルール策定', 'todo', 'high', owner_id, 3),
                (project_record.id, phase_record.id, 'コーディング規約の策定', '開発チーム内のコーディング規約を策定する', 'todo', 'medium', owner_id, 4),
                (project_record.id, phase_record.id, '開発スケジュールの詳細化', 'より詳細な開発スケジュールを作成する', 'todo', 'medium', owner_id, 5),
                (project_record.id, phase_record.id, '課題管理・進捗管理ツールの準備', 'プロジェクト管理ツールのセットアップ', 'todo', 'medium', owner_id, 6);
                
                -- 成果物
                INSERT INTO deliverables (project_id, phase_id, name, description, type, status, created_by, order_index) VALUES
                (project_record.id, phase_record.id, '開発環境構築手順書', '開発環境のセットアップ方法を記述', 'document', 'pending', owner_id, 1),
                (project_record.id, phase_record.id, 'コーディング規約', '開発チーム内で統一されたコード記述ルール', 'document', 'pending', owner_id, 2),
                (project_record.id, phase_record.id, '開発スケジュール詳細', '各タスクの期間、担当、依存関係などを具体化したスケジュール', 'document', 'pending', owner_id, 3);
            END IF;
        END LOOP;
    END LOOP;
END $$; 