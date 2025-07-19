-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Project members can view projects" ON projects;
DROP POLICY IF EXISTS "Project owners can manage projects" ON projects;
DROP POLICY IF EXISTS "Project members can view project members" ON project_members;
DROP POLICY IF EXISTS "Project members can manage tasks" ON tasks;
DROP POLICY IF EXISTS "Project members can manage deliverables" ON deliverables;
DROP POLICY IF EXISTS "Project members can manage documents" ON documents;
DROP POLICY IF EXISTS "Project members can view invitations" ON project_invitations;
DROP POLICY IF EXISTS "Anyone can view invitations by token" ON project_invitations;

-- 修正されたポリシーを作成
-- プロジェクト: オーナーまたはメンバーのみアクセス可能
CREATE POLICY "Project access policy" ON projects FOR ALL USING (
    owner_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM project_members 
        WHERE project_id = projects.id AND user_id = auth.uid()
    )
);

-- プロジェクトメンバー: プロジェクトのオーナーまたはメンバーのみアクセス可能
CREATE POLICY "Project members access policy" ON project_members FOR ALL USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id = project_members.project_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM project_members pm 
        WHERE pm.project_id = project_members.project_id AND pm.user_id = auth.uid()
    )
);

-- タスク: プロジェクトのオーナーまたはメンバーのみアクセス可能
CREATE POLICY "Tasks access policy" ON tasks FOR ALL USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id = tasks.project_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM project_members 
        WHERE project_id = tasks.project_id AND user_id = auth.uid()
    )
);

-- 成果物: プロジェクトのオーナーまたはメンバーのみアクセス可能
CREATE POLICY "Deliverables access policy" ON deliverables FOR ALL USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id = deliverables.project_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM project_members 
        WHERE project_id = deliverables.project_id AND user_id = auth.uid()
    )
);

-- ドキュメント: プロジェクトのオーナーまたはメンバーのみアクセス可能
CREATE POLICY "Documents access policy" ON documents FOR ALL USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id = documents.project_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM project_members 
        WHERE project_id = documents.project_id AND user_id = auth.uid()
    )
);

-- 招待: プロジェクトのオーナーまたはメンバーのみアクセス可能（トークンによるアクセスは別途）
CREATE POLICY "Invitations access policy" ON project_invitations FOR ALL USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id = project_invitations.project_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM project_members 
        WHERE project_id = project_invitations.project_id AND user_id = auth.uid()
    )
);

-- トークンによる招待アクセス（認証なしでもアクセス可能）
CREATE POLICY "Invitations by token" ON project_invitations FOR SELECT USING (true); 