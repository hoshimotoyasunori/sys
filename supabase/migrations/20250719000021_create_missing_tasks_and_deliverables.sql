-- 既存のプロジェクトにタスクと成果物が存在しない場合に作成

-- プロジェクトオーナーを取得する関数
CREATE OR REPLACE FUNCTION get_project_owner(project_id UUID)
RETURNS UUID AS $$
DECLARE
    owner_id UUID;
BEGIN
    SELECT user_id INTO owner_id
    FROM project_members
    WHERE project_id = get_project_owner.project_id AND role = 'owner'
    LIMIT 1;
    
    RETURN owner_id;
END;
$$ LANGUAGE plpgsql;

-- 各プロジェクトに対してタスクと成果物を作成
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
        owner_id := get_project_owner(project_record.id);
        
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
                (project_record.id, phase_record.id, '要件定義書', 'システムが備えるべき機能（機能要件）と非機能要件を詳細に記述した、すべての開発工程の基礎となる文書', 'document', 'pending', owner_id, 2),
                (project_record.id, phase_record.id, '業務フロー図（As-Is/To-Be）', '現状の業務とシステム導入後の業務の流れを図式化したもの', 'document', 'pending', owner_id, 3);
            
            -- 基本設計フェーズのタスクと成果物
            ELSIF phase_record.name = '基本設計' THEN
                -- タスク
                INSERT INTO tasks (project_id, phase_id, title, description, status, priority, created_by, order_index) VALUES
                (project_record.id, phase_record.id, 'システム全体構成設計', 'アーキテクチャ設計を行い、システムの基盤を設計する', 'todo', 'high', owner_id, 1),
                (project_record.id, phase_record.id, 'データベース論理・物理設計', 'ER図の作成と正規化、インデックス設計を実施する', 'todo', 'high', owner_id, 2),
                (project_record.id, phase_record.id, '機能概要設計', '各機能の入力、処理、出力の概要を設計する', 'todo', 'medium', owner_id, 3),
                (project_record.id, phase_record.id, '外部インターフェース設計', '他システムとの連携仕様を設計する', 'todo', 'medium', owner_id, 4),
                (project_record.id, phase_record.id, '画面遷移設計', '画面間の遷移フローを設計する', 'todo', 'medium', owner_id, 5),
                (project_record.id, phase_record.id, '非機能要件の詳細化', '性能、セキュリティ、可用性などの要件を詳細化する', 'todo', 'high', owner_id, 6);
                
                -- 成果物
                INSERT INTO deliverables (project_id, phase_id, name, description, type, status, created_by, order_index) VALUES
                (project_record.id, phase_record.id, '基本設計書（外部設計書）', 'システムの全体像を記述した文書（システム構成図、データベース設計書、画面遷移図、機能一覧、他システム連携概要、非機能要件詳細を含む）', 'document', 'pending', owner_id, 1),
                (project_record.id, phase_record.id, 'テスト計画書（概要）', 'テストの全体方針、範囲、フェーズなどを記述', 'document', 'pending', owner_id, 2);
            
            -- 外部設計フェーズのタスクと成果物
            ELSIF phase_record.name = '外部設計' THEN
                -- タスク
                INSERT INTO tasks (project_id, phase_id, title, description, status, priority, created_by, order_index) VALUES
                (project_record.id, phase_record.id, 'ユーザーインターフェース設計', '画面レイアウト、操作フローを設計する', 'todo', 'high', owner_id, 1),
                (project_record.id, phase_record.id, 'ユーザーエクスペリエンス設計', 'ユーザー体験の最適化を図る', 'todo', 'high', owner_id, 2),
                (project_record.id, phase_record.id, '入力・出力情報の詳細設計', 'データの入出力仕様を詳細に設計する', 'todo', 'medium', owner_id, 3),
                (project_record.id, phase_record.id, 'エラーハンドリングの検討', 'エラー処理とユーザーへの通知方法を設計する', 'todo', 'medium', owner_id, 4),
                (project_record.id, phase_record.id, '帳票設計', '各種レポートの設計を行う', 'todo', 'low', owner_id, 5),
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

-- 関数を削除
DROP FUNCTION get_project_owner(UUID); 