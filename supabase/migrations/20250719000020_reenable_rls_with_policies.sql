-- RLSを再有効化し、適切なポリシーを設定

-- すべてのテーブルでRLSを有効化
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- プロジェクトのポリシー
CREATE POLICY "Users can view their own projects" ON projects
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = projects.id
        )
    );

CREATE POLICY "Users can create projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM project_members 
            WHERE project_id = projects.id AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (
        auth.uid() IN (
            SELECT user_id FROM project_members 
            WHERE project_id = projects.id AND role = 'owner'
        )
    );

-- プロジェクトメンバーのポリシー
CREATE POLICY "Users can view project members for their projects" ON project_members
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = project_members.project_id
        )
    );

CREATE POLICY "Project owners can insert members" ON project_members
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM project_members 
            WHERE project_id = project_members.project_id AND role = 'owner'
        )
    );

CREATE POLICY "Project owners can update members" ON project_members
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM project_members 
            WHERE project_id = project_members.project_id AND role = 'owner'
        )
    );

CREATE POLICY "Project owners can delete members" ON project_members
    FOR DELETE USING (
        auth.uid() IN (
            SELECT user_id FROM project_members 
            WHERE project_id = project_members.project_id AND role = 'owner'
        )
    );

-- フェーズのポリシー
CREATE POLICY "Users can view phases for their projects" ON phases
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = phases.project_id
        )
    );

CREATE POLICY "Project owners can create phases" ON phases
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM project_members 
            WHERE project_id = phases.project_id AND role = 'owner'
        )
    );

CREATE POLICY "Project owners can update phases" ON phases
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM project_members 
            WHERE project_id = phases.project_id AND role = 'owner'
        )
    );

CREATE POLICY "Project owners can delete phases" ON phases
    FOR DELETE USING (
        auth.uid() IN (
            SELECT user_id FROM project_members 
            WHERE project_id = phases.project_id AND role = 'owner'
        )
    );

-- タスクのポリシー
CREATE POLICY "Users can view tasks for their projects" ON tasks
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = tasks.project_id
        )
    );

CREATE POLICY "Project members can create tasks" ON tasks
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = tasks.project_id
        )
    );

CREATE POLICY "Project members can update tasks" ON tasks
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = tasks.project_id
        )
    );

CREATE POLICY "Project owners can delete tasks" ON tasks
    FOR DELETE USING (
        auth.uid() IN (
            SELECT user_id FROM project_members 
            WHERE project_id = tasks.project_id AND role = 'owner'
        )
    );

-- 成果物のポリシー
CREATE POLICY "Users can view deliverables for their projects" ON deliverables
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = deliverables.project_id
        )
    );

CREATE POLICY "Project members can create deliverables" ON deliverables
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = deliverables.project_id
        )
    );

CREATE POLICY "Project members can update deliverables" ON deliverables
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = deliverables.project_id
        )
    );

CREATE POLICY "Project owners can delete deliverables" ON deliverables
    FOR DELETE USING (
        auth.uid() IN (
            SELECT user_id FROM project_members 
            WHERE project_id = deliverables.project_id AND role = 'owner'
        )
    );

-- プロジェクト招待のポリシー
CREATE POLICY "Users can view invitations for their projects" ON project_invitations
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = project_invitations.project_id
        )
    );

CREATE POLICY "Project owners can create invitations" ON project_invitations
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM project_members 
            WHERE project_id = project_invitations.project_id AND role = 'owner'
        )
    );

CREATE POLICY "Project owners can update invitations" ON project_invitations
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM project_members 
            WHERE project_id = project_invitations.project_id AND role = 'owner'
        )
    );

CREATE POLICY "Project owners can delete invitations" ON project_invitations
    FOR DELETE USING (
        auth.uid() IN (
            SELECT user_id FROM project_members 
            WHERE project_id = project_invitations.project_id AND role = 'owner'
        )
    );

-- 招待トークンによるアクセスを許可
CREATE POLICY "Allow invitation access by token" ON project_invitations
    FOR SELECT USING (
        token = current_setting('app.invitation_token', true)::text
    );

-- ドキュメントのポリシー
CREATE POLICY "Users can view documents for their projects" ON documents
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = documents.project_id
        )
    );

CREATE POLICY "Project members can create documents" ON documents
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = documents.project_id
        )
    );

CREATE POLICY "Project members can update documents" ON documents
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM project_members WHERE project_id = documents.project_id
        )
    );

CREATE POLICY "Project owners can delete documents" ON documents
    FOR DELETE USING (
        auth.uid() IN (
            SELECT user_id FROM project_members 
            WHERE project_id = documents.project_id AND role = 'owner'
        )
    ); 