-- フロントエンドの期待するスキーマに合わせてデータベースを統一するSQLスクリプト

-- 既存のテーブルを削除
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS deliverables CASCADE;

-- フロントエンドに合わせたタスクテーブルを作成
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES phases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,  -- フロントエンドが期待するフィールド名
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  order_index INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- フロントエンドに合わせた成果物テーブルを作成
CREATE TABLE deliverables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES phases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,  -- フロントエンドが期待するフィールド名
  description TEXT,
  type TEXT DEFAULT 'document' CHECK (type IN ('document', 'design', 'code', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  order_index INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLSを有効にする
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

-- 寛容なRLSポリシーを作成（認証済みユーザーなら全てアクセス可能）
CREATE POLICY "Enable all for authenticated users" ON tasks
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON deliverables
    FOR ALL USING (auth.role() = 'authenticated');

-- 要件定義フェーズにタスクを追加
INSERT INTO tasks (project_id, phase_id, title, description, order_index, status, priority)
SELECT 
    p.id as project_id,
    ph.id as phase_id,
    t.title,
    t.description,
    t.order_index,
    t.status,
    t.priority
FROM projects p
JOIN phases ph ON ph.project_id = p.id
CROSS JOIN (
    VALUES 
        ('プロジェクト概要の確認', 'プロジェクトの目的、範囲、制約を明確にする', 1, 'todo', 'high'),
        ('ステークホルダーの特定', 'プロジェクトに関係する全ての関係者を特定する', 2, 'todo', 'high'),
        ('機能要件の整理', 'システムが提供すべき機能を詳細に定義する', 3, 'todo', 'medium'),
        ('非機能要件の定義', '性能、セキュリティ、可用性などの要件を定義する', 4, 'todo', 'medium'),
        ('要件の優先度付け', '要件の重要度と緊急度を評価し、優先順位を決定する', 5, 'todo', 'high')
) AS t(title, description, order_index, status, priority)
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

-- 確認メッセージ
SELECT 
    'Schema unified successfully' as status,
    (SELECT COUNT(*) FROM tasks WHERE project_id = (SELECT id FROM projects WHERE name = 'テスト2')) as tasks_count,
    (SELECT COUNT(*) FROM deliverables WHERE project_id = (SELECT id FROM projects WHERE name = 'テスト2')) as deliverables_count;

-- 作成されたデータの詳細確認
SELECT 
    'Tasks Details' as info,
    t.id,
    t.title,
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