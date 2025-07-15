import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { 
  CheckCircle, 
  Circle,
  FileText,
  ChevronDown
} from 'lucide-react';
import { Phase } from '../App';

interface DeliverablesChecklistProps {
  phases: Phase[];
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  phaseId: string;
  phaseName: string;
  completed: boolean;
  required: boolean;
}

export function DeliverablesChecklist({ phases }: DeliverablesChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // 全フェーズの成果物を統合したチェックリストを作成
  const allDeliverables: ChecklistItem[] = phases.flatMap(phase => 
    phase.deliverables.map(deliverable => ({
      id: `${phase.id}-${deliverable.id}`,
      title: deliverable.title,
      description: deliverable.description,
      phaseId: phase.id,
      phaseName: phase.title,
      completed: deliverable.status === 'completed',
      required: true
    }))
  );

  // 追加の重要チェック項目
  const additionalChecks: ChecklistItem[] = [
    {
      id: 'stakeholder-approval',
      title: 'ステークホルダー承認',
      description: '各フェーズの成果物についてステークホルダーの承認を得ている',
      phaseId: 'all',
      phaseName: '全フェーズ',
      completed: false,
      required: true
    },
    {
      id: 'risk-assessment',
      title: 'リスク評価',
      description: '各フェーズで特定されたリスクと対策が文書化されている',
      phaseId: 'all',
      phaseName: '全フェーズ',
      completed: false,
      required: true
    },
    {
      id: 'quality-review',
      title: '品質レビュー',
      description: 'すべての成果物について品質レビューが完了している',
      phaseId: 'all',
      phaseName: '全フェーズ',
      completed: false,
      required: true
    },
    {
      id: 'documentation-complete',
      title: '文書化完了',
      description: '設計の背景、理由、制約事項が適切に文書化されている',
      phaseId: 'all',
      phaseName: '全フェーズ',
      completed: false,
      required: true
    }
  ];

  const allItems = [...allDeliverables, ...additionalChecks];

  const handleItemCheck = (itemId: string, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: checked
    }));
  };

  const getItemStatus = (item: ChecklistItem) => {
    if (item.completed) return 'completed';
    if (checkedItems[item.id]) return 'checked';
    return 'pending';
  };

  const completedCount = allItems.filter(item => 
    item.completed || checkedItems[item.id]
  ).length;
  const totalCount = allItems.length;
  const completionRate = (completedCount / totalCount) * 100;

  const phaseGroups = phases.reduce((acc, phase) => {
    acc[phase.id] = allItems.filter(item => item.phaseId === phase.id);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);
  
  const generalItems = allItems.filter(item => item.phaseId === 'all');

  const renderChecklistItem = (item: ChecklistItem) => {
    const status = getItemStatus(item);
    const isCompleted = status === 'completed' || status === 'checked';
    
    return (
      <div 
        key={item.id} 
        className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${
          isCompleted 
            ? 'bg-green-50 border-green-200' 
            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center pt-1">
          {status === 'completed' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Checkbox
              checked={status === 'checked'}
              onCheckedChange={(checked) => 
                handleItemCheck(item.id, checked as boolean)
              }
              className="h-5 w-5 rounded-full border-2"
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium transition-all duration-200 ${
            isCompleted 
              ? 'text-green-800 line-through' 
              : 'text-gray-900'
          }`}>
            {item.title}
          </h4>
          <p className={`text-xs mt-1 transition-all duration-200 ${
            isCompleted 
              ? 'text-green-600' 
              : 'text-gray-500'
          }`}>
            {item.description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 進捗サマリー */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <h3 className="text-lg font-semibold text-gray-900">完了状況</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">{completedCount}/{totalCount} 項目完了</div>
                <div className="text-xs text-gray-500">全体の進捗</div>
              </div>
              <div className="w-14 h-14 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center shadow-sm">
                <span className="text-base font-bold text-blue-600">
                  {Math.round(completionRate)}%
                </span>
              </div>
            </div>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* フェーズ別チェックリスト（アコーディオン） */}
      <Card>
        <CardHeader>
          <CardTitle>フェーズ別成果物</CardTitle>
          <CardDescription>各フェーズで作成すべき成果物の一覧</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-2">
            {phases.map(phase => {
              const phaseItems = phaseGroups[phase.id] || [];
              const phaseCompleted = phaseItems.filter(item => 
                item.completed || checkedItems[item.id]
              ).length;
              
              return (
                <AccordionItem 
                  key={phase.id} 
                  value={phase.id}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium text-gray-900">{phase.title}</h3>
                      </div>
                      <Badge 
                        variant={phaseCompleted === phaseItems.length ? "default" : "outline"}
                        className="rounded-full"
                      >
                        {phaseCompleted}/{phaseItems.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-4">
                    <div className="space-y-3">
                      {phaseItems.map(renderChecklistItem)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
      
      {/* 全般的なチェック項目（アコーディオン） */}
      {generalItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-900">重要な確認項目</CardTitle>
            <CardDescription>プロジェクト全体を通して確認すべき必須項目</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="general-items" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-orange-900">プロジェクト全体の確認事項</h3>
                    </div>
                    <Badge variant="outline" className="rounded-full border-orange-300 text-orange-700">
                      必須
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-4">
                  <div className="space-y-3">
                    {generalItems.map(item => {
                      const status = getItemStatus(item);
                      const isCompleted = status === 'checked';
                      
                      return (
                        <div 
                          key={item.id} 
                          className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                            isCompleted 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                          }`}
                        >
                          <div className="flex items-center pt-1">
                            <Checkbox
                              checked={isCompleted}
                              onCheckedChange={(checked) => 
                                handleItemCheck(item.id, checked as boolean)
                              }
                              className="h-5 w-5 rounded-full border-2"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium transition-all duration-200 ${
                              isCompleted 
                                ? 'text-green-800 line-through' 
                                : 'text-orange-900'
                            }`}>
                              {item.title}
                            </h4>
                            <p className={`text-xs mt-1 transition-all duration-200 ${
                              isCompleted 
                                ? 'text-green-600' 
                                : 'text-orange-700'
                            }`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
      
      {/* 完了時のメッセージ */}
      {completionRate === 100 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-900">
                おめでとうございます！
              </h3>
              <p className="text-sm text-green-700">
                すべての項目が完了しました。開発フェーズに進む準備が整いました。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}