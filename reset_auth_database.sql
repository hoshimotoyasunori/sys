-- 認証テーブルも含めて完全にデータベースをリセットするSQLスクリプト
-- 注意: このスクリプトはすべてのデータとユーザーを削除します

-- 外部キー制約を無効にする
SET session_replication_role = replica;

-- アプリケーションのテーブルを削除
DROP TABLE IF EXISTS project_invitations CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS deliverables CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Supabase認証テーブルのユーザーを削除
DELETE FROM auth.users WHERE email = 'hoshimotoyasunori@gmail.com';
-- または、すべてのユーザーを削除する場合：
-- DELETE FROM auth.users;

-- 外部キー制約を再有効にする
SET session_replication_role = DEFAULT;

-- 確認メッセージ
SELECT 'Database and auth reset completed successfully' as status; 