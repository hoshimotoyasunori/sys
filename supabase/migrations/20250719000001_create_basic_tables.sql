-- ユーザープロファイルテーブル
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- プロジェクトテーブル
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- プロジェクトメンバーテーブル
CREATE TABLE IF NOT EXISTS project_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- タスクテーブル
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 成果物テーブル
CREATE TABLE IF NOT EXISTS deliverables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'document' CHECK (type IN ('document', 'design', 'code', 'other')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed')),
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ドキュメントテーブル
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT DEFAULT 'general' CHECK (type IN ('requirements', 'design', 'specification', 'general')),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_deliverables_project_id ON deliverables(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 各テーブルにトリガーを設定
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliverables_updated_at 
    BEFORE UPDATE ON deliverables 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS（Row Level Security）の有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_invitations ENABLE ROW LEVEL SECURITY;

-- 基本的なRLSポリシー
-- プロファイル: 自分のプロファイルのみアクセス可能
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- プロジェクト: メンバーのみアクセス可能
CREATE POLICY "Project members can view projects" ON projects FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM project_members 
        WHERE project_id = projects.id AND user_id = auth.uid()
    )
);
CREATE POLICY "Project owners can manage projects" ON projects FOR ALL USING (owner_id = auth.uid());

-- プロジェクトメンバー: プロジェクトメンバーのみアクセス可能
CREATE POLICY "Project members can view project members" ON project_members FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM project_members pm 
        WHERE pm.project_id = project_members.project_id AND pm.user_id = auth.uid()
    )
);

-- タスク: プロジェクトメンバーのみアクセス可能
CREATE POLICY "Project members can manage tasks" ON tasks FOR ALL USING (
    EXISTS (
        SELECT 1 FROM project_members 
        WHERE project_id = tasks.project_id AND user_id = auth.uid()
    )
);

-- 成果物: プロジェクトメンバーのみアクセス可能
CREATE POLICY "Project members can manage deliverables" ON deliverables FOR ALL USING (
    EXISTS (
        SELECT 1 FROM project_members 
        WHERE project_id = deliverables.project_id AND user_id = auth.uid()
    )
);

-- ドキュメント: プロジェクトメンバーのみアクセス可能
CREATE POLICY "Project members can manage documents" ON documents FOR ALL USING (
    EXISTS (
        SELECT 1 FROM project_members 
        WHERE project_id = documents.project_id AND user_id = auth.uid()
    )
);

-- 招待: プロジェクトメンバーのみアクセス可能
CREATE POLICY "Project members can view invitations" ON project_invitations FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM project_members 
        WHERE project_id = project_invitations.project_id AND user_id = auth.uid()
    )
);
CREATE POLICY "Anyone can view invitations by token" ON project_invitations FOR SELECT USING (true); 