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
import { AlertTriangle, Trash2, XCircle } from 'lucide-react';

interface DeleteProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  onConfirm: () => Promise<void>;
}

export function DeleteProjectDialog({
  isOpen,
  onClose,
  projectName,
  onConfirm
}: DeleteProjectDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('プロジェクト削除エラー:', error);
      setError(error instanceof Error ? error.message : 'プロジェクトの削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            プロジェクトを削除
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 mt-2">
            プロジェクト「<span className="font-semibold text-red-600">{projectName}</span>」を削除しますか？
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 警告メッセージ */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 text-lg mb-3">この操作は取り消せません</h4>
                <p className="text-red-700 mb-4">
                  プロジェクトとそのすべてのデータが永久に削除されます。
                </p>
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <h5 className="font-medium text-red-900 mb-2">削除されるデータ:</h5>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      プロジェクトの基本情報
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      すべてのタスクと成果物
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      プロジェクトメンバーの権限
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      プロジェクトの履歴データ
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3 pt-6">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isDeleting}
            className="px-6 py-2"
          >
            キャンセル
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isDeleting}
            className="gap-2 px-6 py-2 bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                削除中...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                プロジェクトを削除
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 