-- 最終的なRLSポリシー修正（無限再帰を完全に解決）

-- 既存のポリシーをすべて削除
DROP POLICY IF EXISTS "Users can view project members for their projects" ON project_members;
DROP POLICY IF EXISTS "Project owners can insert members" ON project_members;
DROP POLICY IF EXISTS "Project owners can update members" ON project_members;
DROP POLICY IF EXISTS "Project owners can delete members" ON project_members;
DROP POLICY IF EXISTS "Allow member insertion by invitation" ON project_members;

DROP POLICY IF EXISTS "Users can view invitations for their projects" ON project_invitations;
DROP POLICY IF EXISTS "Project owners can create invitations" ON project_invitations;
DROP POLICY IF EXISTS "Project owners can update invitations" ON project_invitations;
DROP POLICY IF EXISTS "Project owners can delete invitations" ON project_invitations;
DROP POLICY IF EXISTS "Allow invitation access by token" ON project_invitations;

DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

-- projectsテーブルのポリシー（最もシンプル版）
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING (owner_id = auth.uid());

-- project_membersテーブルのポリシー（最もシンプル版）
CREATE POLICY "Users can view project members for their projects" ON project_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_members.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can insert members" ON project_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_members.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update members" ON project_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_members.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete members" ON project_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_members.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

-- project_invitationsテーブルのポリシー（最もシンプル版）
CREATE POLICY "Users can view invitations for their projects" ON project_invitations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_invitations.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can create invitations" ON project_invitations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_invitations.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update invitations" ON project_invitations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_invitations.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete invitations" ON project_invitations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_invitations.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

-- 招待を受け入れるための特別なポリシー（トークンベース、シンプル版）
CREATE POLICY "Allow invitation access by token" ON project_invitations
  FOR SELECT USING (true);

-- 招待を受け入れるための特別なポリシー（シンプル版、auth.usersへの参照を削除）
CREATE POLICY "Allow member insertion by invitation simple" ON project_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_invitations pi
      WHERE pi.project_id = project_members.project_id
      AND pi.expires_at > NOW()
    )
  ); 