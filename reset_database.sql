-- データベースをリセットするSQLスクリプト
-- 注意: このスクリプトはすべてのデータを削除します

-- 外部キー制約を無効にする
SET session_replication_role = replica;

-- すべてのテーブルを削除（存在する場合）
DROP TABLE IF EXISTS project_invitations CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS deliverables CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 外部キー制約を再有効にする
SET session_replication_role = DEFAULT;

-- 確認メッセージ
SELECT 'Database reset completed successfully' as status; 