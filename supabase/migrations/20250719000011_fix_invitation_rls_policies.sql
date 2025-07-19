-- 招待受け入れ時のRLSポリシー修正

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view project members for their projects" ON project_members;
DROP POLICY IF EXISTS "Project owners and admins can insert members" ON project_members;
DROP POLICY IF EXISTS "Project owners and admins can update members" ON project_members;
DROP POLICY IF EXISTS "Project owners and admins can delete members" ON project_members;

DROP POLICY IF EXISTS "Users can view invitations for their projects" ON project_invitations;
DROP POLICY IF EXISTS "Project owners and admins can create invitations" ON project_invitations;
DROP POLICY IF EXISTS "Project owners and admins can update invitations" ON project_invitations;
DROP POLICY IF EXISTS "Project owners and admins can delete invitations" ON project_invitations;

-- project_membersテーブルのポリシー（修正版）
-- プロジェクトメンバーは自分のプロジェクトメンバー情報を閲覧可能
CREATE POLICY "Users can view project members for their projects" ON project_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_members pm 
      WHERE pm.project_id = project_members.project_id 
      AND pm.user_id = auth.uid()
    )
  );

-- プロジェクトオーナーと管理者はメンバーを追加可能
CREATE POLICY "Project owners and admins can insert members" ON project_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_members pm 
      WHERE pm.project_id = project_members.project_id 
      AND pm.user_id = auth.uid()
      AND pm.role IN ('owner', 'admin')
    )
  );

-- 招待を受け入れる際のメンバー追加を許可
CREATE POLICY "Allow invitation acceptance" ON project_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_invitations pi
      WHERE pi.project_id = project_members.project_id
      AND pi.email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
      AND pi.expires_at > NOW()
    )
  );

-- プロジェクトオーナーと管理者はメンバーを更新可能
CREATE POLICY "Project owners and admins can update members" ON project_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM project_members pm 
      WHERE pm.project_id = project_members.project_id 
      AND pm.user_id = auth.uid()
      AND pm.role IN ('owner', 'admin')
    )
  );

-- プロジェクトオーナーと管理者はメンバーを削除可能（自分以外）
CREATE POLICY "Project owners and admins can delete members" ON project_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM project_members pm 
      WHERE pm.project_id = project_members.project_id 
      AND pm.user_id = auth.uid()
      AND pm.role IN ('owner', 'admin')
    )
    AND project_members.user_id != auth.uid()
  );

-- project_invitationsテーブルのポリシー（修正版）
-- プロジェクトメンバーは招待を閲覧可能
CREATE POLICY "Users can view invitations for their projects" ON project_invitations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_members pm 
      WHERE pm.project_id = project_invitations.project_id 
      AND pm.user_id = auth.uid()
    )
  );

-- トークンによる招待の閲覧を許可（招待受け入れ時に必要）
CREATE POLICY "Allow invitation access by token" ON project_invitations
  FOR SELECT USING (true);

-- プロジェクトオーナーと管理者は招待を作成可能
CREATE POLICY "Project owners and admins can create invitations" ON project_invitations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_members pm 
      WHERE pm.project_id = project_invitations.project_id 
      AND pm.user_id = auth.uid()
      AND pm.role IN ('owner', 'admin')
    )
  );

-- プロジェクトオーナーと管理者は招待を更新可能
CREATE POLICY "Project owners and admins can update invitations" ON project_invitations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM project_members pm 
      WHERE pm.project_id = project_invitations.project_id 
      AND pm.user_id = auth.uid()
      AND pm.role IN ('owner', 'admin')
    )
  );

-- プロジェクトオーナーと管理者は招待を削除可能
CREATE POLICY "Project owners and admins can delete invitations" ON project_invitations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM project_members pm 
      WHERE pm.project_id = project_invitations.project_id 
      AND pm.user_id = auth.uid()
      AND pm.role IN ('owner', 'admin')
    )
  );

-- 招待を受け入れたユーザーは自分の招待を削除可能
CREATE POLICY "Allow users to delete their own invitations" ON project_invitations
  FOR DELETE USING (
    email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

-- projectsテーブルのポリシーも修正
DROP POLICY IF EXISTS "Project access policy" ON projects;

CREATE POLICY "Project access policy" ON projects FOR ALL USING (
    owner_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM project_members 
        WHERE project_id = projects.id AND user_id = auth.uid()
    )
);

-- 招待を受け入れる際のプロジェクト閲覧を許可
CREATE POLICY "Allow project access for invitation acceptance" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_invitations pi
      WHERE pi.project_id = projects.id
      AND pi.email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
      AND pi.expires_at > NOW()
    )
  ); 