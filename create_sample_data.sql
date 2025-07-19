-- サンプルデータを作成するSQLスクリプト

-- 1. プロジェクト情報を確認
SELECT 'Current Projects:' as info;
SELECT id, name, owner_id FROM projects;

-- 2. フェーズ情報を確認
SELECT 'Current Phases:' as info;
SELECT id, name, project_id, order_index FROM phases ORDER BY project_id, order_index;

-- 3. タスク情報を確認
SELECT 'Current Tasks:' as info;
SELECT id, title, phase_id, project_id, status, priority FROM tasks;

-- 4. 成果物情報を確認
SELECT 'Current Deliverables:' as info;
SELECT id, name, phase_id, project_id, status FROM deliverables;

-- 5. プロジェクトメンバー情報を確認
SELECT 'Current Project Members:' as info;
SELECT project_id, user_id, role FROM project_members;

-- 6. サンプルデータを作成（プロジェクトとフェーズが存在する場合）
DO $$
DECLARE
    project_record RECORD;
    phase_record RECORD;
    user_id UUID;
BEGIN
    -- 最初のプロジェクトを取得
    SELECT * INTO project_record FROM projects LIMIT 1;
    
    IF project_record IS NULL THEN
        RAISE NOTICE 'No projects found';
        RETURN;
    END IF;
    
    -- 最初のユーザーを取得（または固定のUUIDを使用）
    SELECT auth.uid() INTO user_id;
    IF user_id IS NULL THEN
        -- テスト用のUUIDを使用
        user_id := '00000000-0000-0000-0000-000000000000'::UUID;
    END IF;
    
    RAISE NOTICE 'Creating sample data for project: % (ID: %)', project_record.name, project_record.id;
    
    -- 各フェーズに対してタスクと成果物を作成
    FOR phase_record IN 
        SELECT id, name FROM phases WHERE project_id = project_record.id ORDER BY order_index
    LOOP
        RAISE NOTICE 'Processing phase: % (ID: %)', phase_record.name, phase_record.id;
        
        -- 要件定義フェーズのタスクと成果物
        IF phase_record.name = '要件定義' THEN
            -- タスク
            INSERT INTO tasks (project_id, phase_id, title, description, status, priority, order_index, created_by) VALUES
            (project_record.id, phase_record.id, 'プロジェクトの目的と目標の明確化', 'システム開発の目的、ターゲット、期待効果、ビジネスゴールを明確にする', 'todo', 'high', 1, user_id),
            (project_record.id, phase_record.id, '現状業務の分析と課題特定', '現在の業務プロセスを分析し、課題や改善点を特定する', 'todo', 'high', 2, user_id),
            (project_record.id, phase_record.id, 'ユーザーヒアリングと要求収集', 'ステークホルダーからのヒアリングを通じて要求を収集・整理する', 'todo', 'high', 3, user_id),
            (project_record.id, phase_record.id, '機能要件の洗い出しと詳細化', 'システムが備えるべき機能を具体的に定義し、詳細化する', 'todo', 'high', 4, user_id),
            (project_record.id, phase_record.id, '非機能要件の定義', '性能、セキュリティ、可用性、保守性などの非機能要件を定義する', 'todo', 'medium', 5, user_id),
            (project_record.id, phase_record.id, '要件の優先順位付け', 'MoSCoW法などを用いて要件の優先順位を決定する', 'todo', 'medium', 6, user_id)
            ON CONFLICT DO NOTHING;
            
            -- 成果物
            INSERT INTO deliverables (project_id, phase_id, name, description, type, status, order_index, created_by) VALUES
            (project_record.id, phase_record.id, '企画書', 'システム開発の目的、ターゲット、期待効果、ビジネスゴールなどをまとめた文書', 'document', 'pending', 1, user_id),
            (project_record.id, phase_record.id, '要件定義書', 'システムが備えるべき機能（機能要件）と非機能要件を詳細に記述した、すべての開発工程の基礎となる文書', 'document', 'pending', 2, user_id),
            (project_record.id, phase_record.id, '業務フロー図（As-Is/To-Be）', '現状の業務とシステム導入後の業務の流れを図式化したもの', 'document', 'pending', 3, user_id)
            ON CONFLICT DO NOTHING;
        
        -- 基本設計フェーズのタスクと成果物
        ELSIF phase_record.name = '基本設計' THEN
            -- タスク
            INSERT INTO tasks (project_id, phase_id, title, description, status, priority, order_index, created_by) VALUES
            (project_record.id, phase_record.id, 'システム全体構成設計', 'アーキテクチャ設計を行い、システムの基盤を設計する', 'todo', 'high', 1, user_id),
            (project_record.id, phase_record.id, 'データベース論理・物理設計', 'ER図の作成と正規化、インデックス設計を実施する', 'todo', 'high', 2, user_id),
            (project_record.id, phase_record.id, '機能概要設計', '各機能の入力、処理、出力の概要を設計する', 'todo', 'medium', 3, user_id),
            (project_record.id, phase_record.id, '外部インターフェース設計', '他システムとの連携仕様を設計する', 'todo', 'medium', 4, user_id),
            (project_record.id, phase_record.id, '画面遷移設計', '画面間の遷移フローを設計する', 'todo', 'medium', 5, user_id),
            (project_record.id, phase_record.id, '非機能要件の詳細化', '性能、セキュリティ、可用性などの要件を詳細化する', 'todo', 'high', 6, user_id)
            ON CONFLICT DO NOTHING;
            
            -- 成果物
            INSERT INTO deliverables (project_id, phase_id, name, description, type, status, order_index, created_by) VALUES
            (project_record.id, phase_record.id, '基本設計書（外部設計書）', 'システムの全体像を記述した文書（システム構成図、データベース設計書、画面遷移図、機能一覧、他システム連携概要、非機能要件詳細を含む）', 'document', 'pending', 1, user_id),
            (project_record.id, phase_record.id, 'テスト計画書（概要）', 'テストの全体方針、範囲、フェーズなどを記述', 'document', 'pending', 2, user_id)
            ON CONFLICT DO NOTHING;
        
        -- 外部設計フェーズのタスクと成果物
        ELSIF phase_record.name = '外部設計' THEN
            -- タスク
            INSERT INTO tasks (project_id, phase_id, title, description, status, priority, order_index, created_by) VALUES
            (project_record.id, phase_record.id, 'ユーザーインターフェース設計', '画面レイアウト、操作フローを設計する', 'todo', 'high', 1, user_id),
            (project_record.id, phase_record.id, 'ユーザーエクスペリエンス設計', 'ユーザー体験の最適化を図る', 'todo', 'high', 2, user_id),
            (project_record.id, phase_record.id, '入力・出力情報の詳細設計', 'データの入出力仕様を詳細に設計する', 'todo', 'medium', 3, user_id),
            (project_record.id, phase_record.id, 'エラーハンドリングの検討', 'エラー処理とユーザーへの通知方法を設計する', 'todo', 'medium', 4, user_id),
            (project_record.id, phase_record.id, '帳票設計', '各種レポートの設計を行う', 'todo', 'low', 5, user_id),
            (project_record.id, phase_record.id, 'テスト計画の詳細作成', '単体テスト、結合テスト、総合テストの範囲を詳細化する', 'todo', 'medium', 6, user_id)
            ON CONFLICT DO NOTHING;
            
            -- 成果物
            INSERT INTO deliverables (project_id, phase_id, name, description, type, status, order_index, created_by) VALUES
            (project_record.id, phase_record.id, '画面設計書', '各画面のレイアウト、操作フロー、UI仕様を記述した文書', 'document', 'pending', 1, user_id),
            (project_record.id, phase_record.id, 'ワイヤーフレーム・プロトタイプ', '画面のワイヤーフレームとプロトタイプ', 'design', 'pending', 2, user_id),
            (project_record.id, phase_record.id, '入出力設計書', 'データの入出力仕様を詳細に記述した文書', 'document', 'pending', 3, user_id)
            ON CONFLICT DO NOTHING;
        
        -- 開発準備フェーズのタスクと成果物
        ELSIF phase_record.name = '開発準備' THEN
            -- タスク
            INSERT INTO tasks (project_id, phase_id, title, description, status, priority, order_index, created_by) VALUES
            (project_record.id, phase_record.id, '開発環境の構築', '開発に必要な環境をセットアップする', 'todo', 'high', 1, user_id),
            (project_record.id, phase_record.id, '開発技術の最終決定', '開発言語、フレームワーク、ライブラリの最終決定とセットアップ', 'todo', 'high', 2, user_id),
            (project_record.id, phase_record.id, 'バージョン管理システムの導入', 'Git等のバージョン管理システム導入とルール策定', 'todo', 'high', 3, user_id),
            (project_record.id, phase_record.id, 'コーディング規約の策定', '開発チーム内のコーディング規約を策定する', 'todo', 'medium', 4, user_id),
            (project_record.id, phase_record.id, '開発スケジュールの詳細化', 'より詳細な開発スケジュールを作成する', 'todo', 'medium', 5, user_id),
            (project_record.id, phase_record.id, '課題管理・進捗管理ツールの準備', 'プロジェクト管理ツールのセットアップ', 'todo', 'medium', 6, user_id)
            ON CONFLICT DO NOTHING;
            
            -- 成果物
            INSERT INTO deliverables (project_id, phase_id, name, description, type, status, order_index, created_by) VALUES
            (project_record.id, phase_record.id, '開発環境構築手順書', '開発環境のセットアップ方法を記述', 'document', 'pending', 1, user_id),
            (project_record.id, phase_record.id, 'コーディング規約', '開発チーム内で統一されたコード記述ルール', 'document', 'pending', 2, user_id),
            (project_record.id, phase_record.id, '開発スケジュール詳細', '各タスクの期間、担当、依存関係などを具体化したスケジュール', 'document', 'pending', 3, user_id)
            ON CONFLICT DO NOTHING;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Sample data creation completed';
END $$;

-- 7. 作成後のデータを確認
SELECT 'After creation - Tasks:' as info;
SELECT id, title, phase_id, project_id, status, priority FROM tasks ORDER BY phase_id, order_index;

SELECT 'After creation - Deliverables:' as info;
SELECT id, name, phase_id, project_id, status FROM deliverables ORDER BY phase_id, order_index; 