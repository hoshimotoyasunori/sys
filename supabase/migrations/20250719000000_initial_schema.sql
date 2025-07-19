-- プロジェクト招待テーブル
CREATE TABLE IF NOT EXISTS project_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'owner')),
    scopes TEXT[] DEFAULT '{}',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_project_invitations_token ON project_invitations(token);
CREATE INDEX IF NOT EXISTS idx_project_invitations_email ON project_invitations(email);
CREATE INDEX IF NOT EXISTS idx_project_invitations_expires_at ON project_invitations(expires_at);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_invitations_updated_at 
    BEFORE UPDATE ON project_invitations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 