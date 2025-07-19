-- データの問題を特定するためのデバッグSQLスクリプト

-- 1. プロジェクト情報を確認
SELECT 
    'Project Info' as info,
    p.id as project_id,
    p.name as project_name,
    p.owner_id
FROM projects p
WHERE p.name = 'テスト2';

-- 2. フェーズ情報を確認
SELECT 
    'Phases Info' as info,
    ph.id as phase_id,
    ph.name as phase_name,
    ph.project_id,
    ph.order_index
FROM phases ph
JOIN projects p ON p.id = ph.project_id
WHERE p.name = 'テスト2'
ORDER BY ph.order_index;

-- 3. タスク情報を確認（phase_idフィルタなし）
SELECT 
    'All Tasks Info' as info,
    t.id as task_id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.phase_id,
    t.project_id,
    ph.name as phase_name,
    p.name as project_name
FROM tasks t
LEFT JOIN phases ph ON ph.id = t.phase_id
LEFT JOIN projects p ON p.id = t.project_id
WHERE p.name = 'テスト2'
ORDER BY t.order_index;

-- 4. 成果物情報を確認（phase_idフィルタなし）
SELECT 
    'All Deliverables Info' as info,
    d.id as deliverable_id,
    d.name,
    d.description,
    d.status,
    d.phase_id,
    d.project_id,
    ph.name as phase_name,
    p.name as project_name
FROM deliverables d
LEFT JOIN phases ph ON ph.id = d.phase_id
LEFT JOIN projects p ON p.id = d.project_id
WHERE p.name = 'テスト2'
ORDER BY d.order_index;

-- 5. 要件定義フェーズのタスクを確認
SELECT 
    'Requirements Phase Tasks' as info,
    t.id as task_id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.phase_id,
    ph.name as phase_name
FROM tasks t
JOIN phases ph ON ph.id = t.phase_id
JOIN projects p ON p.id = t.project_id
WHERE p.name = 'テスト2' AND ph.name = '要件定義'
ORDER BY t.order_index;

-- 6. 要件定義フェーズの成果物を確認
SELECT 
    'Requirements Phase Deliverables' as info,
    d.id as deliverable_id,
    d.name,
    d.description,
    d.status,
    d.phase_id,
    ph.name as phase_name
FROM deliverables d
JOIN phases ph ON ph.id = d.phase_id
JOIN projects p ON p.id = d.project_id
WHERE p.name = 'テスト2' AND ph.name = '要件定義'
ORDER BY d.order_index;

-- 7. フロントエンドが期待するクエリをシミュレート
WITH project_phases AS (
    SELECT ph.id as phase_id
    FROM phases ph
    JOIN projects p ON p.id = ph.project_id
    WHERE p.name = 'テスト2'
)
SELECT 
    'Frontend Query Simulation - Tasks' as info,
    t.id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.phase_id
FROM tasks t
WHERE t.phase_id IN (SELECT phase_id FROM project_phases)
ORDER BY t.order_index;

WITH project_phases AS (
    SELECT ph.id as phase_id
    FROM phases ph
    JOIN projects p ON p.id = ph.project_id
    WHERE p.name = 'テスト2'
)
SELECT 
    'Frontend Query Simulation - Deliverables' as info,
    d.id,
    d.name,
    d.description,
    d.status,
    d.phase_id
FROM deliverables d
WHERE d.phase_id IN (SELECT phase_id FROM project_phases)
ORDER BY d.order_index; 