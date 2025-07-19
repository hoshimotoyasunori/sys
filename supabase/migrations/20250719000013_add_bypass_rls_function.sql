-- RLSを回避するための安全な関数を作成

-- 招待を受け入れる際にRLSを回避する関数
CREATE OR REPLACE FUNCTION insert_project_member_bypass_rls(
  p_project_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'member'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 招待の存在を確認
  IF NOT EXISTS (
    SELECT 1 FROM project_invitations 
    WHERE project_id = p_project_id 
    AND email = (SELECT email FROM auth.users WHERE id = p_user_id)
    AND expires_at > NOW()
  ) THEN
    RAISE EXCEPTION '有効な招待が見つかりません';
  END IF;

  -- 既にメンバーかチェック
  IF EXISTS (
    SELECT 1 FROM project_members 
    WHERE project_id = p_project_id 
    AND user_id = p_user_id
  ) THEN
    RAISE EXCEPTION '既にプロジェクトのメンバーです';
  END IF;

  -- メンバーとして追加
  INSERT INTO project_members (project_id, user_id, role, joined_at)
  VALUES (p_project_id, p_user_id, p_role, NOW());

  -- 招待を削除
  DELETE FROM project_invitations 
  WHERE project_id = p_project_id 
  AND email = (SELECT email FROM auth.users WHERE id = p_user_id);
END;
$$;

-- 関数の実行権限を設定
GRANT EXECUTE ON FUNCTION insert_project_member_bypass_rls(UUID, UUID, TEXT) TO authenticated; 