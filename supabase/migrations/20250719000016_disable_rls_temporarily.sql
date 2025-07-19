-- RLSを一時的に無効化して問題を特定

-- すべてのテーブルでRLSを無効化
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE phases DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;

-- 既存のポリシーをすべて削除
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

DROP POLICY IF EXISTS "Users can view project members for their projects" ON project_members;
DROP POLICY IF EXISTS "Project owners can insert members" ON project_members;
DROP POLICY IF EXISTS "Project owners can update members" ON project_members;
DROP POLICY IF EXISTS "Project owners can delete members" ON project_members;
DROP POLICY IF EXISTS "Allow member insertion by invitation simple" ON project_members;

DROP POLICY IF EXISTS "Users can view invitations for their projects" ON project_invitations;
DROP POLICY IF EXISTS "Project owners can create invitations" ON project_invitations;
DROP POLICY IF EXISTS "Project owners can update invitations" ON project_invitations;
DROP POLICY IF EXISTS "Project owners can delete invitations" ON project_invitations;
DROP POLICY IF EXISTS "Allow invitation access by token" ON project_invitations; 