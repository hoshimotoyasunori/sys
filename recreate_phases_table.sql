-- phasesテーブルを完全に再作成し、スキーマキャッシュを更新するSQLスクリプト

-- 既存のphasesテーブルを削除（もし存在する場合）
DROP TABLE IF EXISTS phases CASCADE;

-- phasesテーブルを新規作成
CREATE TABLE phases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLSを有効にする
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;

-- フェーズテーブルのRLSポリシー
CREATE POLICY "Enable all for project owners" ON phases
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = phases.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

-- デフォルトフェーズを作成する関数
CREATE OR REPLACE FUNCTION create_default_phases(project_uuid UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO phases (project_id, name, description, order_index) VALUES
        (project_uuid, '要件定義', 'プロジェクトの要件を明確にする', 1),
        (project_uuid, '設計', 'システムの設計を行う', 2),
        (project_uuid, '実装', 'システムを実装する', 3),
        (project_uuid, 'テスト', 'システムをテストする', 4),
        (project_uuid, 'デプロイ', 'システムをデプロイする', 5);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 既存のプロジェクトにデフォルトフェーズを作成
SELECT create_default_phases(id) FROM projects WHERE name = 'テスト2';

-- スキーマキャッシュを更新
NOTIFY pgrst, 'reload schema';

-- 確認メッセージ
SELECT 'Phases table recreated successfully' as status; 