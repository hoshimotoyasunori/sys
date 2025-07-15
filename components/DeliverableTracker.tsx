import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Phase, Deliverable } from '../App';

interface DeliverableTrackerProps {
  phase: Phase;
  onStatusUpdate: (deliverableId: string, status: Deliverable['status']) => void;
}

export function DeliverableTracker({ phase, onStatusUpdate }: DeliverableTrackerProps) {
  const getStatusColor = (status: Deliverable['status']) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'not-started': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: Deliverable['status']) => {
    switch (status) {
      case 'completed': return '完了';
      case 'in-progress': return '進行中';
      case 'not-started': return '未着手';
      default: return '未着手';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>主要成果物</CardTitle>
        <CardDescription>このフェーズで作成すべき成果物です</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {phase.deliverables.map(deliverable => (
          <div key={deliverable.id} className="p-3 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm">{deliverable.title}</h4>
              <Badge variant={getStatusColor(deliverable.status)}>
                {getStatusLabel(deliverable.status)}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">{deliverable.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">ステータス:</span>
              <Select
                value={deliverable.status}
                onValueChange={(value: Deliverable['status']) => 
                  onStatusUpdate(deliverable.id, value)
                }
              >
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">未着手</SelectItem>
                  <SelectItem value="in-progress">進行中</SelectItem>
                  <SelectItem value="completed">完了</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}