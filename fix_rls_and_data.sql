-- RLSポリシーを修正し、データが正しく取得できるようにするSQLスクリプト

-- 現在のRLSポリシーを確認
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('tasks', 'deliverables', 'phases', 'projects')
ORDER BY tablename, policyname;

-- 既存のRLSポリシーを削除
DROP POLICY IF EXISTS "Enable all for project owners" ON tasks;
DROP POLICY IF EXISTS "Enable all for project owners" ON deliverables;
DROP POLICY IF EXISTS "Enable all for project owners" ON phases;
DROP POLICY IF EXISTS "Enable all for project owners" ON projects;

-- 新しいRLSポリシーを作成（より寛容な設定）
CREATE POLICY "Enable all for authenticated users" ON tasks
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON deliverables
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON phases
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

-- 既存のデータを削除
DELETE FROM tasks WHERE project_id = (SELECT id FROM projects WHERE name = 'テスト2');
DELETE FROM deliverables WHERE project_id = (SELECT id FROM projects WHERE name = 'テスト2');

-- 要件定義フェーズにタスクを追加
INSERT INTO tasks (project_id, phase_id, name, description, order_index, status, priority)
SELECT 
    p.id as project_id,
    ph.id as phase_id,
    t.name,
    t.description,
    t.order_index,
    t.status,
    t.priority
FROM projects p
JOIN phases ph ON ph.project_id = p.id
CROSS JOIN (
    VALUES 
        ('プロジェクト概要の確認', 'プロジェクトの目的、範囲、制約を明確にする', 1, 'pending', 'high'),
        ('ステークホルダーの特定', 'プロジェクトに関係する全ての関係者を特定する', 2, 'pending', 'high'),
        ('機能要件の整理', 'システムが提供すべき機能を詳細に定義する', 3, 'pending', 'medium'),
        ('非機能要件の定義', '性能、セキュリティ、可用性などの要件を定義する', 4, 'pending', 'medium'),
        ('要件の優先度付け', '要件の重要度と緊急度を評価し、優先順位を決定する', 5, 'pending', 'high')
) AS t(name, description, order_index, status, priority)
WHERE p.name = 'テスト2' AND ph.name = '要件定義';

-- 要件定義フェーズに成果物を追加
INSERT INTO deliverables (project_id, phase_id, name, description, order_index, status)
SELECT 
    p.id as project_id,
    ph.id as phase_id,
    d.name,
    d.description,
    d.order_index,
    d.status
FROM projects p
JOIN phases ph ON ph.project_id = p.id
CROSS JOIN (
    VALUES 
        ('プロジェクト概要書', 'プロジェクトの目的、範囲、制約を記載した文書', 1, 'pending'),
        ('ステークホルダー分析表', '関係者の役割、責任、影響度を整理した表', 2, 'pending'),
        ('機能要件仕様書', 'システムの機能要件を詳細に記述した文書', 3, 'pending'),
        ('非機能要件仕様書', '性能、セキュリティ、可用性要件を定義した文書', 4, 'pending'),
        ('要件定義書', '全ての要件を統合した最終的な要件定義文書', 5, 'pending')
) AS d(name, description, order_index, status)
WHERE p.name = 'テスト2' AND ph.name = '要件定義';

-- データ確認
SELECT 
    'Data Verification' as info,
    (SELECT COUNT(*) FROM tasks WHERE project_id = (SELECT id FROM projects WHERE name = 'テスト2')) as tasks_count,
    (SELECT COUNT(*) FROM deliverables WHERE project_id = (SELECT id FROM projects WHERE name = 'テスト2')) as deliverables_count;

-- 作成されたデータの詳細確認
SELECT 
    'Tasks Details' as info,
    t.id,
    t.name,
    t.description,
    t.status,
    t.priority,
    p.name as project_name,
    ph.name as phase_name
FROM tasks t
JOIN projects p ON p.id = t.project_id
JOIN phases ph ON ph.id = t.phase_id
WHERE p.name = 'テスト2'
ORDER BY t.order_index;

SELECT 
    'Deliverables Details' as info,
    d.id,
    d.name,
    d.description,
    d.status,
    p.name as project_name,
    ph.name as phase_name
FROM deliverables d
JOIN projects p ON p.id = d.project_id
JOIN phases ph ON ph.id = d.phase_id
WHERE p.name = 'テスト2'
ORDER BY d.order_index; 