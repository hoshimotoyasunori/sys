import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Phase, Deliverable } from './MainApp';

interface DeliverableTrackerProps {
  phase: Phase;
  onStatusUpdate: (deliverableId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  onCreateDeliverables?: () => void;
}

export function DeliverableTracker({ phase, onStatusUpdate, onCreateDeliverables }: DeliverableTrackerProps) {
  const getStatusColor = (status: Deliverable['status']) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: Deliverable['status']) => {
    switch (status) {
      case 'completed': return '完了';
      case 'in-progress': return '進行中';
      case 'pending': return '未着手';
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
        {phase.deliverables.length > 0 ? (
          phase.deliverables.map(deliverable => (
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
                  onValueChange={(value: 'pending' | 'in-progress' | 'completed') => 
                    onStatusUpdate(deliverable.id, value)
                  }
                >
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">未着手</SelectItem>
                    <SelectItem value="in-progress">進行中</SelectItem>
                    <SelectItem value="completed">完了</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <p className="text-sm">このフェーズには成果物が設定されていません</p>
            </div>
            {onCreateDeliverables && (
              <Button 
                onClick={onCreateDeliverables}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                成果物を作成
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}