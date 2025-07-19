-- 重複データを削除するマイグレーション

-- タスクの重複を削除（同じphase_id、title、descriptionの組み合わせで重複を除去）
DELETE FROM tasks 
WHERE id NOT IN (
  SELECT DISTINCT ON (phase_id, title, description) id
  FROM tasks 
  ORDER BY phase_id, title, description, created_at
);

-- 成果物の重複を削除（同じphase_id、name、descriptionの組み合わせで重複を除去）
DELETE FROM deliverables 
WHERE id NOT IN (
  SELECT DISTINCT ON (phase_id, name, description) id
  FROM deliverables 
  ORDER BY phase_id, name, description, created_at
);

-- フェーズの重複を削除（同じproject_id、nameの組み合わせで重複を除去）
DELETE FROM phases 
WHERE id NOT IN (
  SELECT DISTINCT ON (project_id, name) id
  FROM phases 
  ORDER BY project_id, name, created_at
);

-- インデックスを再構築
REINDEX TABLE tasks;
REINDEX TABLE deliverables;
REINDEX TABLE phases; 