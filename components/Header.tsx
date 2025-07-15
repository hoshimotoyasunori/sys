import React from 'react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  LayoutDashboard, 
  CheckCircle, 
  FileText, 
  Target, 
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  User
} from 'lucide-react';

interface HeaderProps {
  totalTasks: number;
  completedTasks: number;
  totalDeliverables: number;
  completedDeliverables: number;
}

export function Header({
  totalTasks,
  completedTasks,
  totalDeliverables,
  completedDeliverables
}: HeaderProps) {
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const deliverableProgress = totalDeliverables > 0 ? (completedDeliverables / totalDeliverables) * 100 : 0;
  const overallProgress = (taskProgress + deliverableProgress) / 2;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm w-full">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ・アプリ名 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">システム設計アシスタント</h1>
                <p className="text-sm text-gray-500">プロジェクト管理ツール</p>
              </div>
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
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}