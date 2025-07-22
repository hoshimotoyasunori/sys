import React, { useState } from 'react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

import { 
  LayoutDashboard, 
  CheckCircle, 
  FileText, 
  Target, 
  TrendingUp,
  Calendar,
  Bell,
  User,
  LogOut,
  Settings,
  HelpCircle,
  Users,
  Trash2,
  Plus,
  ChevronRight,
  Check
} from 'lucide-react';
import { ProjectMembersDialog } from './ProjectMembersDialog';
import { DeleteProjectDialog } from './DeleteProjectDialog';
import { ProjectSwitchDialog } from './ProjectSwitchDialog';
import { CreateProjectDialog } from './CreateProjectDialog';

import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext';

interface HeaderProps {
  totalTasks: number;
  completedTasks: number;
  totalDeliverables: number;
  completedDeliverables: number;
  currentProject?: {
    id: string;
    name: string;
    description: string;
  } | null;
}

export function Header({
  totalTasks,
  completedTasks,
  totalDeliverables,
  completedDeliverables,
  currentProject: propCurrentProject
}: HeaderProps) {
  const { signOut, user } = useAuth();
  const { projects, currentProject, selectProject, deleteProject, createProject } = useProject();
  
  // propsのcurrentProjectを優先し、なければuseProjectのcurrentProjectを使用
  const displayProject = propCurrentProject || currentProject;
  
  const [showProjectMembers, setShowProjectMembers] = useState(false);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [showProjectSwitch, setShowProjectSwitch] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const deliverableProgress = totalDeliverables > 0 ? (completedDeliverables / totalDeliverables) * 100 : 0;
  
  // タスクと成果物の合計数に基づく全体進捗計算
  const totalItems = totalTasks + totalDeliverables;
  const completedItems = completedTasks + completedDeliverables;
  const overallProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleLogout = async () => {
    await signOut();
  };

  const handleProjectMembers = () => {
    setShowProjectMembers(true);
  };

  const handleDeleteProject = () => {
    setShowDeleteProject(true);
  };

  const confirmDeleteProject = async () => {
    if (!displayProject) {
      throw new Error('プロジェクトが選択されていません');
    }

    try {
      const { error } = await deleteProject(displayProject.id);
      if (error) {
        throw error;
      }
      
      // 削除成功後の処理
      console.log('プロジェクトを削除しました:', displayProject.name);
      
      // プロジェクトが削除された場合、プロジェクト選択画面に戻る
      // ProjectSelectorコンポーネントが自動的に表示される
    } catch (error) {
      console.error('プロジェクト削除エラー:', error);
      throw error;
    }
  };

  const handleProjectSwitch = () => {
    setShowProjectSwitch(true);
  };

  const handleProjectSelect = (project: any) => {
    selectProject(project);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm w-full">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ・アプリ名 */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
            onClick={handleProjectSwitch}
            title="プロジェクトを切り替え"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {displayProject ? displayProject.name : 'プロジェクトを選択'}
              </h1>
              <p className="text-sm text-gray-500">
                {displayProject ? displayProject.description : 'プロジェクトを選択してください'}
              </p>
            </div>
          </div>

          {/* 進捗情報 */}
          <div className="flex items-center gap-6">
            {/* 全体進捗 */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">全体進捗</div>
                <div className="text-xs text-gray-500">プロジェクト全体</div>
              </div>
              <div className="w-24">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">{Math.round(overallProgress)}%</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-600">+5%</span>
                  </div>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
            </div>

            {/* タスク進捗 */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">タスク</div>
                <div className="text-xs text-gray-500">{completedTasks}/{totalTasks} 完了</div>
              </div>
              <div className="w-20">
                <div className="text-xs text-gray-600 mb-1 text-right">{Math.round(taskProgress)}%</div>
                <Progress value={taskProgress} className="h-2" />
              </div>
            </div>

            {/* 成果物進捗 */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">成果物</div>
                <div className="text-xs text-gray-500">{completedDeliverables}/{totalDeliverables} 完了</div>
              </div>
              <div className="w-20">
                <div className="text-xs text-gray-600 mb-1 text-right">{Math.round(deliverableProgress)}%</div>
                <Progress value={deliverableProgress} className="h-2" />
              </div>
            </div>

            {/* モバイル用コンパクト表示 */}
            <div className="md:hidden flex items-center gap-2">
              <div className="text-sm">
                <div className="font-medium text-gray-900">{Math.round(overallProgress)}%</div>
                <div className="text-xs text-gray-500">進捗</div>
              </div>
              <div className="w-16">
                <Progress value={overallProgress} className="h-2" />
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="通知"
              >
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              
              {/* 設定メニュー */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="設定"
                  >
                    <Settings className="h-5 w-5 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">プロジェクト設定</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {displayProject ? displayProject.name : 'プロジェクト管理'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProjectMembers}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>参加メンバー一覧</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProjectSwitch}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>プロジェクトを切り替え</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowCreateProject(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>新規プロジェクト作成</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDeleteProject} variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>プロジェクトを削除</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* ユーザーメニュー */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="ユーザーメニュー"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        システム設計アシスタント
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>ヘルプ</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>ログアウト</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      
      {/* プロジェクトメンバー一覧ダイアログ */}
      <ProjectMembersDialog
        isOpen={showProjectMembers}
        onClose={() => setShowProjectMembers(false)}
      />
      
      {/* プロジェクト切り替えダイアログ */}
      <ProjectSwitchDialog
        isOpen={showProjectSwitch}
        onClose={() => setShowProjectSwitch(false)}
        projects={projects}
        currentProject={displayProject}
        onProjectSelect={handleProjectSelect}
      />
      
      {/* プロジェクト削除確認ダイアログ */}
      <DeleteProjectDialog
        isOpen={showDeleteProject}
        onClose={() => setShowDeleteProject(false)}
        projectName={displayProject?.name || 'プロジェクト'}
        onConfirm={confirmDeleteProject}
      />

      {/* 新規プロジェクト作成ダイアログ */}
      <CreateProjectDialog
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        onCreateProject={async (name: string, description: string) => {
          const { error } = await createProject(name, description);
          if (!error) {
            // プロジェクトが作成され、自動的に選択される
            // ダイアログは自動的に閉じられる
          }
          return { error };
        }}
      />
    </header>
  );
}