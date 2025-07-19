-- 無限再帰を修正するための簡素化されたRLSポリシー

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can create their own projects" ON projects;
DROP POLICY IF EXISTS "Users can view projects they own or are members of" ON projects;
DROP POLICY IF EXISTS "Users can update projects they own" ON projects;
DROP POLICY IF EXISTS "Users can delete projects they own" ON projects;
DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Project owners can add members" ON project_members;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Project owners can manage invitations" ON project_invitations;
DROP POLICY IF EXISTS "Users can view tasks in their projects" ON tasks;
DROP POLICY IF EXISTS "Project members can create tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view deliverables in their projects" ON deliverables;
DROP POLICY IF EXISTS "Project members can create deliverables" ON deliverables;

-- 簡素化されたポリシーを作成

-- プロジェクトテーブル（基本的なポリシー）
CREATE POLICY "Enable insert for authenticated users" ON projects
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Enable select for project owners" ON projects
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Enable update for project owners" ON projects
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Enable delete for project owners" ON projects
    FOR DELETE USING (auth.uid() = owner_id);

-- プロジェクトメンバーテーブル（簡素化）
CREATE POLICY "Enable all for project owners" ON project_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_members.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

-- ユーザープロファイルテーブル
CREATE POLICY "Enable all for users based on user_id" ON user_profiles
    FOR ALL USING (auth.uid() = id);

-- プロジェクト招待テーブル
CREATE POLICY "Enable all for project owners" ON project_invitations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_invitations.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

-- タスクテーブル
CREATE POLICY "Enable all for project owners" ON tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = tasks.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

-- 成果物テーブル
CREATE POLICY "Enable all for project owners" ON deliverables
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = deliverables.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

-- 確認メッセージ
SELECT 'RLS policies fixed successfully' as status; 