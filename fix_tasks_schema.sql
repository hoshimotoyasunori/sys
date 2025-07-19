-- tasksテーブルに不足しているカラムを追加するSQLスクリプト

-- tasksテーブルにorder_indexカラムを追加
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;

-- tasksテーブルにstatusカラムを追加（もし存在しない場合）
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- tasksテーブルにpriorityカラムを追加（もし存在しない場合）
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'medium';

-- tasksテーブルにdue_dateカラムを追加（もし存在しない場合）
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date DATE;

-- tasksテーブルにassigned_toカラムを追加（もし存在しない場合）
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- deliverablesテーブルにorder_indexカラムを追加
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;

-- deliverablesテーブルにstatusカラムを追加（もし存在しない場合）
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- deliverablesテーブルにdue_dateカラムを追加（もし存在しない場合）
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS due_date DATE;

-- 確認メッセージ
SELECT 'Tasks schema fixed successfully' as status; 