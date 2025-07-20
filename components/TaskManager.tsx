import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Phase, Task } from './MainApp';

interface TaskManagerProps {
  phase: Phase;
  onTaskUpdate: (taskId: string, completed: boolean) => void;
  onCreateTasks?: () => void;
}

export function TaskManager({ phase, onTaskUpdate, onCreateTasks }: TaskManagerProps) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '低';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>主要タスク</CardTitle>
        <CardDescription>このフェーズで実行すべきタスクです</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {phase.tasks.length > 0 ? (
          phase.tasks.map(task => {
            const isCompleted = task.status === 'completed';
            return (
              <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={(checked) => onTaskUpdate(task.id, !!checked)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </h4>
                    <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </div>
                  <p className={`text-xs text-gray-600 ${isCompleted ? 'line-through' : ''}`}>
                    {task.description}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <p className="text-sm">このフェーズにはタスクが設定されていません</p>
            </div>
            {onCreateTasks && (
              <Button 
                onClick={onCreateTasks}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                タスクを作成
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}