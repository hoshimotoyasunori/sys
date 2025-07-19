import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Calendar,
  User,
  ArrowRight,
  Settings
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';

export const ProjectSwitcher: React.FC = () => {
  const { projects, currentProject, selectProject, createProject, loading } = useProject();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    const { error } = await createProject(newProjectName, newProjectDescription);
    if (!error) {
      setNewProjectName('');
      setNewProjectDescription('');
      setShowCreateForm(false);
    }
  };

  const handleProjectSelect = (project: any) => {
    selectProject(project);
    setIsOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FolderOpen className="h-4 w-4" />
          {currentProject ? currentProject.name : 'プロジェクトを選択'}
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            プロジェクト管理
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 検索と新規作成 */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="プロジェクトを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              新規作成
            </Button>
          </div>

          {/* 新規プロジェクト作成フォーム */}
          {showCreateForm && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">新規プロジェクト作成</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="project-name">プロジェクト名 *</Label>
                  <Input
                    id="project-name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="プロジェクト名を入力"
                  />
                </div>
                <div>
                  <Label htmlFor="project-description">説明</Label>
                  <Textarea
                    id="project-description"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="プロジェクトの説明を入力"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
                    作成
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    キャンセル
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* プロジェクト一覧 */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">
              プロジェクト一覧 ({filteredProjects.length})
            </h3>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                プロジェクトを読み込み中...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? '検索結果がありません' : 'プロジェクトがありません'}
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredProjects.map((project) => (
                  <Card 
                    key={project.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      currentProject?.id === project.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : ''
                    }`}
                    onClick={() => handleProjectSelect(project)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-lg">{project.name}</h4>
                            {currentProject?.id === project.id && (
                              <Badge variant="secondary">現在のプロジェクト</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {project.description || '説明なし'}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(project.created_at)}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {user?.email}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 