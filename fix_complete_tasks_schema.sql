-- tasksテーブルの完全なスキーマを作成し、不足しているカラムを追加するSQLスクリプト

-- まず、tasksテーブルの現在の構造を確認
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;

-- tasksテーブルに不足しているカラムを追加
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT 'Untitled Task';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'medium';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS phase_id UUID REFERENCES phases(id) ON DELETE SET NULL;

-- deliverablesテーブルに不足しているカラムを追加
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT 'Untitled Deliverable';
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS phase_id UUID REFERENCES phases(id) ON DELETE SET NULL;

-- 確認メッセージ
SELECT 'Complete tasks schema fixed successfully' as status; 