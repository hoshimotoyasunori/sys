-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Project access policy" ON projects;
DROP POLICY IF EXISTS "Project members access policy" ON project_members;
DROP POLICY IF EXISTS "Tasks access policy" ON tasks;
DROP POLICY IF EXISTS "Deliverables access policy" ON deliverables;
DROP POLICY IF EXISTS "Documents access policy" ON documents;
DROP POLICY IF EXISTS "Invitations access policy" ON project_invitations;
DROP POLICY IF EXISTS "Invitations by token" ON project_invitations;

-- 簡素なポリシーを作成
-- プロジェクト: オーナーのみアクセス可能（シンプルに）
CREATE POLICY "Projects owner only" ON projects FOR ALL USING (owner_id = auth.uid());

-- プロジェクトメンバー: プロジェクトのオーナーのみアクセス可能
CREATE POLICY "Project members owner only" ON project_members FOR ALL USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id = project_members.project_id AND owner_id = auth.uid()
    )
);

-- タスク: プロジェクトのオーナーのみアクセス可能
CREATE POLICY "Tasks owner only" ON tasks FOR ALL USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id = tasks.project_id AND owner_id = auth.uid()
    )
);

-- 成果物: プロジェクトのオーナーのみアクセス可能
CREATE POLICY "Deliverables owner only" ON deliverables FOR ALL USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id = deliverables.project_id AND owner_id = auth.uid()
    )
);

-- ドキュメント: プロジェクトのオーナーのみアクセス可能
CREATE POLICY "Documents owner only" ON documents FOR ALL USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id = documents.project_id AND owner_id = auth.uid()
    )
);

-- 招待: プロジェクトのオーナーのみアクセス可能
CREATE POLICY "Invitations owner only" ON project_invitations FOR ALL USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id = project_invitations.project_id AND owner_id = auth.uid()
    )
);

-- トークンによる招待アクセス（認証なしでもアクセス可能）
CREATE POLICY "Invitations by token" ON project_invitations FOR SELECT USING (true); 