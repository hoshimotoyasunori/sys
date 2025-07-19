-- Row Level Securityポリシーを設定するSQLスクリプト

-- プロジェクトテーブルのRLSポリシー
CREATE POLICY "Users can create their own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can view projects they own or are members of" ON projects
    FOR SELECT USING (
        auth.uid() = owner_id OR 
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = projects.id
        )
    );

CREATE POLICY "Users can update projects they own" ON projects
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete projects they own" ON projects
    FOR DELETE USING (auth.uid() = owner_id);

-- プロジェクトメンバーテーブルのRLSポリシー
CREATE POLICY "Users can view project members" ON project_members
    FOR SELECT USING (
        auth.uid() IN (
            SELECT owner_id FROM projects WHERE id = project_members.project_id
        ) OR
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = project_members.project_id
        )
    );

CREATE POLICY "Project owners can add members" ON project_members
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT owner_id FROM projects WHERE id = project_members.project_id
        )
    );

-- ユーザープロファイルテーブルのRLSポリシー
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- プロジェクト招待テーブルのRLSポリシー
CREATE POLICY "Project owners can manage invitations" ON project_invitations
    FOR ALL USING (
        auth.uid() IN (
            SELECT owner_id FROM projects WHERE id = project_invitations.project_id
        )
    );

-- タスクテーブルのRLSポリシー
CREATE POLICY "Users can view tasks in their projects" ON tasks
    FOR SELECT USING (
        auth.uid() IN (
            SELECT owner_id FROM projects WHERE id = tasks.project_id
        ) OR
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = tasks.project_id
        )
    );

CREATE POLICY "Project members can create tasks" ON tasks
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT owner_id FROM projects WHERE id = tasks.project_id
        ) OR
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = tasks.project_id
        )
    );

-- 成果物テーブルのRLSポリシー
CREATE POLICY "Users can view deliverables in their projects" ON deliverables
    FOR SELECT USING (
        auth.uid() IN (
            SELECT owner_id FROM projects WHERE id = deliverables.project_id
        ) OR
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = deliverables.project_id
        )
    );

CREATE POLICY "Project members can create deliverables" ON deliverables
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT owner_id FROM projects WHERE id = deliverables.project_id
        ) OR
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = deliverables.project_id
        )
    );

-- 確認メッセージ
SELECT 'RLS policies created successfully' as status; 