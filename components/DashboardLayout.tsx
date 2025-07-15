import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Users,
  Calendar,
  Target
} from 'lucide-react';

interface DashboardMetric {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<any>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface DashboardLayoutProps {
  totalTasks: number;
  completedTasks: number;
  totalDeliverables: number;
  completedDeliverables: number;
  currentPhase: string;
  children: React.ReactNode;
}

export function DashboardLayout({
  totalTasks,
  completedTasks,
  totalDeliverables,
  completedDeliverables,
  currentPhase,
  children
}: DashboardLayoutProps) {
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const deliverableProgress = totalDeliverables > 0 ? (completedDeliverables / totalDeliverables) * 100 : 0;
  
  const metrics: DashboardMetric[] = [
    {
      title: 'タスク完了率',
      value: `${Math.round(taskProgress)}%`,
      description: `${completedTasks}/${totalTasks} 完了`,
      icon: CheckCircle,
      trend: {
        value: 12,
        isPositive: true
      }
    },
    {
      title: '成果物進捗',
      value: `${Math.round(deliverableProgress)}%`,
      description: `${completedDeliverables}/${totalDeliverables} 完了`,
      icon: FileText,
      trend: {
        value: 8,
        isPositive: true
      }
    },
    {
      title: '現在のフェーズ',
      value: currentPhase,
      description: '進行中のフェーズ',
      icon: Target,
    },
    {
      title: 'プロジェクト期間',
      value: '45日',
      description: '残り日数',
      icon: Calendar,
      trend: {
        value: 5,
        isPositive: false
      }
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* スクロール可能なメインコンテンツ */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          {/* メトリクス */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <Card key={index} className="rounded-2xl border-gray-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{metric.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                    {metric.trend && (
                      <div className="flex items-center pt-1">
                        <TrendingUp className={`h-3 w-3 mr-1 ${
                          metric.trend.isPositive ? 'text-green-500' : 'text-red-500'
                        }`} />
                        <span className={`text-xs ${
                          metric.trend.isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.trend.isPositive ? '+' : '-'}{metric.trend.value}%
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* 全体進捗 */}
          <Card className="mb-8 rounded-2xl border-gray-200">
            <CardHeader>
              <CardTitle>プロジェクト全体進捗</CardTitle>
              <CardDescription>
                すべてのフェーズを通した進捗状況
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>タスク進捗</span>
                    <span>{Math.round(taskProgress)}%</span>
                  </div>
                  <Progress value={taskProgress} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>成果物進捗</span>
                    <span>{Math.round(deliverableProgress)}%</span>
                  </div>
                  <Progress value={deliverableProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* メインコンテンツ */}
          {children}
        </div>
      </div>
    </div>
  );
}