import React from 'react';
import { Card, CardContent } from './ui/card';
import { CheckCircle } from 'lucide-react';
import { Phase } from '../App';

interface PhaseOverviewProps {
  phase: Phase;
}

export function PhaseOverview({ phase }: PhaseOverviewProps) {
  const completedTasks = phase.tasks.filter(task => task.completed).length;
  const totalTasks = phase.tasks.length;
  
  const completedDeliverables = phase.deliverables.filter(d => d.status === 'completed').length;
  const totalDeliverables = phase.deliverables.length;

  return (
    <Card className="rounded-2xl border-gray-200">
      <CardContent className="p-4">
        {/* 進捗サマリー */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">タスク進捗</p>
              <p className="text-sm text-gray-500">{completedTasks}/{totalTasks} 完了</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">成果物</p>
              <p className="text-sm text-gray-500">{completedDeliverables}/{totalDeliverables} 完了</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}