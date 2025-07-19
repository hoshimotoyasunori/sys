-- 特定のユーザーを完全に削除するSQLスクリプト
-- 注意: この操作は復元できません

-- 外部キー制約を無効にする
SET session_replication_role = replica;

-- 特定のメールアドレスのユーザーを削除
DELETE FROM auth.users WHERE email = 'hoshimotoyasunori@gmail.com';

-- 関連するアプリケーションデータも削除（存在する場合）
DELETE FROM user_profiles WHERE email = 'hoshimotoyasunori@gmail.com';
DELETE FROM project_members WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'hoshimotoyasunori@gmail.com'
);

-- 外部キー制約を再有効にする
SET session_replication_role = DEFAULT;

-- 確認メッセージ
SELECT 'User hoshimotoyasunori@gmail.com deleted successfully' as status; 