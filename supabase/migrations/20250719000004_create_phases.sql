-- フェーズテーブルを作成
CREATE TABLE IF NOT EXISTS phases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- フェーズテーブルにインデックスを作成
CREATE INDEX IF NOT EXISTS idx_phases_project_id ON phases(project_id);
CREATE INDEX IF NOT EXISTS idx_phases_order_index ON phases(order_index);

-- フェーズテーブルにRLSを有効化
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;

-- フェーズのRLSポリシーを作成
CREATE POLICY "Phases owner only" ON phases FOR ALL USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id = phases.project_id AND owner_id = auth.uid()
    )
);

-- フェーズテーブルにトリガーを設定
CREATE TRIGGER update_phases_updated_at 
    BEFORE UPDATE ON phases 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- プロジェクト作成時にデフォルトフェーズを自動生成する関数を作成
CREATE OR REPLACE FUNCTION create_default_phases()
RETURNS TRIGGER AS $$
BEGIN
    -- 要件定義フェーズ
    INSERT INTO phases (project_id, name, description, order_index) VALUES 
    (NEW.id, '要件定義', 'プロジェクトの要件を整理し、要件定義書を作成するフェーズ', 1);
    
    -- 基本設計フェーズ
    INSERT INTO phases (project_id, name, description, order_index) VALUES 
    (NEW.id, '基本設計', 'システムの基本設計とアーキテクチャを決定するフェーズ', 2);
    
    -- 詳細設計フェーズ
    INSERT INTO phases (project_id, name, description, order_index) VALUES 
    (NEW.id, '詳細設計', 'システムの詳細設計と実装仕様を決定するフェーズ', 3);
    
    -- 実装フェーズ
    INSERT INTO phases (project_id, name, description, order_index) VALUES 
    (NEW.id, '実装', 'システムの実装とコーディングを行うフェーズ', 4);
    
    -- テストフェーズ
    INSERT INTO phases (project_id, name, description, order_index) VALUES 
    (NEW.id, 'テスト', 'システムのテストと品質保証を行うフェーズ', 5);
    
    -- 運用フェーズ
    INSERT INTO phases (project_id, name, description, order_index) VALUES 
    (NEW.id, '運用', 'システムの運用と保守を行うフェーズ', 6);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- プロジェクト作成時にデフォルトフェーズを自動生成するトリガーを作成
CREATE TRIGGER create_default_phases_trigger
    AFTER INSERT ON projects
    FOR EACH ROW
    EXECUTE FUNCTION create_default_phases(); 