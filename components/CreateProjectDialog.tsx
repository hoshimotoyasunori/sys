import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus, FolderOpen } from 'lucide-react';

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (name: string, description: string) => Promise<{ error: any }>;
}

export function CreateProjectDialog({
  isOpen,
  onClose,
  onCreateProject
}: CreateProjectDialogProps) {
  const [projectName, setProjectName] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCreate = async () => {
    if (!projectName.trim()) {
      setError('プロジェクト名を入力してください');
      return;
    }

    setIsCreating(true);
    setError(null);
    
    try {
      const { error } = await onCreateProject(projectName.trim(), projectDescription.trim());
      if (error) {
        throw error;
      }
      
      // 成功時はフォームをリセットしてダイアログを閉じる
      setProjectName('');
      setProjectDescription('');
      onClose();
    } catch (error) {
      console.error('プロジェクト作成エラー:', error);
      setError(error instanceof Error ? error.message : 'プロジェクトの作成に失敗しました');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setProjectName('');
    setProjectDescription('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            新規プロジェクト作成
          </DialogTitle>
          <DialogDescription>
            新しいプロジェクトを作成します。プロジェクト名は必須です。
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">
              プロジェクト名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="プロジェクト名を入力"
              className="focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">
              説明（任意）
            </Label>
            <Textarea
              id="project-description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="プロジェクトの説明を入力"
              rows={3}
              className="focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            キャンセル
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!projectName.trim() || isCreating}
            className="gap-2"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                作成中...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                プロジェクトを作成
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 