-- Step 1: tokenカラムを追加（存在しない場合のみ）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'project_invitations' 
        AND column_name = 'token'
    ) THEN
        ALTER TABLE project_invitations ADD COLUMN token TEXT;
    END IF;
END $$;

-- Step 2: 既存のレコードにトークンを生成
UPDATE project_invitations 
SET token = gen_random_uuid()::text 
WHERE token IS NULL;

-- Step 3: tokenカラムをUNIQUEに設定
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'project_invitations' 
        AND constraint_name = 'project_invitations_token_unique'
    ) THEN
        ALTER TABLE project_invitations 
        ADD CONSTRAINT project_invitations_token_unique UNIQUE (token);
    END IF;
END $$;

-- Step 4: tokenカラムをNOT NULLに設定
ALTER TABLE project_invitations 
ALTER COLUMN token SET NOT NULL;

-- Step 5: tokenカラムのインデックスを作成
CREATE INDEX IF NOT EXISTS idx_project_invitations_token ON project_invitations(token);

-- Step 6: expires_atカラムを追加（存在しない場合のみ）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'project_invitations' 
        AND column_name = 'expires_at'
    ) THEN
        ALTER TABLE project_invitations 
        ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days');
    END IF;
END $$;

-- Step 7: scopesカラムを追加（存在しない場合のみ）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'project_invitations' 
        AND column_name = 'scopes'
    ) THEN
        ALTER TABLE project_invitations 
        ADD COLUMN scopes TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Step 8: roleカラムのデフォルト値を設定
ALTER TABLE project_invitations 
ALTER COLUMN role SET DEFAULT 'member';

-- Step 9: roleカラムの制約を追加（安全に）
DO $$
BEGIN
    -- 既存の制約がある場合は削除
    IF EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'check_role'
    ) THEN
        ALTER TABLE project_invitations DROP CONSTRAINT check_role;
    END IF;
    
    -- 新しい制約を追加
    ALTER TABLE project_invitations 
    ADD CONSTRAINT check_role CHECK (role IN ('admin', 'member', 'owner'));
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$; 