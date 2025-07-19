-- 既存のフェーズを削除
DELETE FROM phases;

-- プロジェクト作成時にデフォルトフェーズを自動生成する関数を修正
CREATE OR REPLACE FUNCTION create_default_phases()
RETURNS TRIGGER AS $$
BEGIN
    -- 要件定義フェーズ
    INSERT INTO phases (project_id, name, description, order_index) VALUES 
    (NEW.id, '要件定義', '「何を作るのか」を明確にし、システムに求められる機能や非機能要件を具体化する', 1);
    
    -- 基本設計フェーズ
    INSERT INTO phases (project_id, name, description, order_index) VALUES 
    (NEW.id, '基本設計', '要件定義で定義された内容を、システムとしてどう実現するかを具体化する', 2);
    
    -- 外部設計フェーズ
    INSERT INTO phases (project_id, name, description, order_index) VALUES 
    (NEW.id, '外部設計', '基本設計の内容を、ユーザーにとって使いやすい形に落とし込む（主にUI/UX）', 3);
    
    -- 開発準備フェーズ
    INSERT INTO phases (project_id, name, description, order_index) VALUES 
    (NEW.id, '開発準備', '開発をスムーズに開始するための最終準備', 4);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql; 