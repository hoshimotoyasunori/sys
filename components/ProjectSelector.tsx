import React, { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface ProjectSelectorProps {
  children: React.ReactNode;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({ children }) => {
  const { projects, currentProject, loading, createProject, selectProject } = useProject();
  const { signOut, user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setCreateLoading(true);
    setCreateError(null);

    try {
      const { error } = await createProject(newProjectName.trim(), newProjectDescription.trim());
      if (error) {
        setCreateError(error.message);
      } else {
        // プロジェクト作成成功時はダイアログを閉じてフォームをリセット
        setShowCreateDialog(false);
        setNewProjectName('');
        setNewProjectDescription('');
        // プロジェクトが自動的に選択されるため、ここで何もしない
      }
    } catch (err) {
      setCreateError('プロジェクトの作成に失敗しました。');
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">プロジェクトを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              プロジェクトを選択
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              作業するプロジェクトを選択するか、新しいプロジェクトを作成してください
            </p>
          </div>

          {/* デバッグ情報 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              デバッグ情報: プロジェクト数: {projects.length}
            </p>
            {projects.map((project, index) => (
              <p key={project.id} className="text-xs text-blue-600 mt-1">
                {index + 1}. {project.name} (ID: {project.id.slice(0, 8)}...)
              </p>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>プロジェクト一覧</CardTitle>
              <CardDescription>
                あなたのプロジェクトを管理します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">プロジェクトがありません</p>
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button>新しいプロジェクトを作成</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>新しいプロジェクトを作成</DialogTitle>
                        <DialogDescription>
                          プロジェクトの基本情報を入力してください
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateProject} className="space-y-4">
                        {createError && (
                          <Alert variant="destructive">
                            <AlertDescription>{createError}</AlertDescription>
                          </Alert>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="project-name">プロジェクト名</Label>
                          <Input
                            id="project-name"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="プロジェクト名を入力"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="project-description">説明（任意）</Label>
                          <Input
                            id="project-description"
                            value={newProjectDescription}
                            onChange={(e) => setNewProjectDescription(e.target.value)}
                            placeholder="プロジェクトの説明"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowCreateDialog(false)}
                          >
                            キャンセル
                          </Button>
                          <Button type="submit" disabled={createLoading}>
                            {createLoading ? '作成中...' : '作成'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => selectProject(project)}
                    >
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        作成日: {new Date(project.created_at).toLocaleDateString('ja-JP')}
                      </p>
                      <p className="text-xs text-blue-500 mt-1">
                        {project.owner_id === user?.id ? 'オーナー' : 'メンバー'}
                      </p>
                    </div>
                  ))}
                  
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        新しいプロジェクトを作成
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>新しいプロジェクトを作成</DialogTitle>
                        <DialogDescription>
                          プロジェクトの基本情報を入力してください
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateProject} className="space-y-4">
                        {createError && (
                          <Alert variant="destructive">
                            <AlertDescription>{createError}</AlertDescription>
                          </Alert>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="project-name">プロジェクト名</Label>
                          <Input
                            id="project-name"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="プロジェクト名を入力"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="project-description">説明（任意）</Label>
                          <Input
                            id="project-description"
                            value={newProjectDescription}
                            onChange={(e) => setNewProjectDescription(e.target.value)}
                            placeholder="プロジェクトの説明"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowCreateDialog(false)}
                          >
                            キャンセル
                          </Button>
                          <Button type="submit" disabled={createLoading}>
                            {createLoading ? '作成中...' : '作成'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <button
                  onClick={signOut}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ログアウト
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 