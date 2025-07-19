-- メインコンテンツに表示するタスクと成果物のサンプルデータを作成するSQLスクリプト

-- 要件定義フェーズのIDを取得
WITH requirements_phase AS (
    SELECT id FROM phases 
    WHERE name = '要件定義' 
    AND project_id = (SELECT id FROM projects WHERE name = 'テスト2')
    LIMIT 1
)

-- 要件定義フェーズにタスクを追加
INSERT INTO tasks (project_id, phase_id, name, description, order_index, status, priority)
SELECT 
    p.id as project_id,
    rp.id as phase_id,
    t.name,
    t.description,
    t.order_index,
    t.status,
    t.priority
FROM requirements_phase rp
CROSS JOIN projects p
CROSS JOIN (
    VALUES 
        ('プロジェクト概要の確認', 'プロジェクトの目的、範囲、制約を明確にする', 1, 'pending', 'high'),
        ('ステークホルダーの特定', 'プロジェクトに関係する全ての関係者を特定する', 2, 'pending', 'high'),
        ('機能要件の整理', 'システムが提供すべき機能を詳細に定義する', 3, 'pending', 'medium'),
        ('非機能要件の定義', '性能、セキュリティ、可用性などの要件を定義する', 4, 'pending', 'medium'),
        ('要件の優先度付け', '要件の重要度と緊急度を評価し、優先順位を決定する', 5, 'pending', 'high')
) AS t(name, description, order_index, status, priority)
WHERE p.name = 'テスト2';

-- 要件定義フェーズに成果物を追加
INSERT INTO deliverables (project_id, phase_id, name, description, order_index, status)
SELECT 
    p.id as project_id,
    rp.id as phase_id,
    d.name,
    d.description,
    d.order_index,
    d.status
FROM requirements_phase rp
CROSS JOIN projects p
CROSS JOIN (
    VALUES 
        ('プロジェクト概要書', 'プロジェクトの目的、範囲、制約を記載した文書', 1, 'pending'),
        ('ステークホルダー分析表', '関係者の役割、責任、影響度を整理した表', 2, 'pending'),
        ('機能要件仕様書', 'システムの機能要件を詳細に記述した文書', 3, 'pending'),
        ('非機能要件仕様書', '性能、セキュリティ、可用性要件を定義した文書', 4, 'pending'),
        ('要件定義書', '全ての要件を統合した最終的な要件定義文書', 5, 'pending')
) AS d(name, description, order_index, status)
WHERE p.name = 'テスト2';

-- 確認メッセージ
SELECT 
    'Main content data created successfully' as status,
    (SELECT COUNT(*) FROM tasks WHERE project_id = (SELECT id FROM projects WHERE name = 'テスト2')) as tasks_count,
    (SELECT COUNT(*) FROM deliverables WHERE project_id = (SELECT id FROM projects WHERE name = 'テスト2')) as deliverables_count; 