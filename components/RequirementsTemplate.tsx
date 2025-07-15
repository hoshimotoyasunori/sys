import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Download, Save, Eye } from 'lucide-react';

export interface RequirementsData {
  projectOverview: {
    projectName: string;
    projectDescription: string;
    projectManager: string;
    startDate: string;
    endDate: string;
  };
  objectives: {
    purpose: string;
    goals: string[];
    successCriteria: string;
  };
  scope: {
    inScope: string[];
    outOfScope: string[];
    assumptions: string[];
  };
  stakeholders: {
    name: string;
    role: string;
    responsibilities: string;
    contactInfo: string;
  }[];
  functionalRequirements: {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }[];
  nonFunctionalRequirements: {
    performance: string;
    security: string;
    usability: string;
    reliability: string;
    scalability: string;
    maintainability: string;
  };
  constraints: string[];
  risks: {
    id: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    probability: 'high' | 'medium' | 'low';
    mitigation: string;
  }[];
  schedule: {
    phases: {
      name: string;
      startDate: string;
      endDate: string;
      deliverables: string[];
    }[];
  };
}

const initialRequirementsData: RequirementsData = {
  projectOverview: {
    projectName: '',
    projectDescription: '',
    projectManager: '',
    startDate: '',
    endDate: ''
  },
  objectives: {
    purpose: '',
    goals: [],
    successCriteria: ''
  },
  scope: {
    inScope: [],
    outOfScope: [],
    assumptions: []
  },
  stakeholders: [],
  functionalRequirements: [],
  nonFunctionalRequirements: {
    performance: '',
    security: '',
    usability: '',
    reliability: '',
    scalability: '',
    maintainability: ''
  },
  constraints: [],
  risks: [],
  schedule: {
    phases: []
  }
};

export function RequirementsTemplate() {
  const [data, setData] = useState<RequirementsData>(initialRequirementsData);
  const [activeTab, setActiveTab] = useState('overview');

  const updateProjectOverview = (field: keyof RequirementsData['projectOverview'], value: string) => {
    setData(prev => ({
      ...prev,
      projectOverview: {
        ...prev.projectOverview,
        [field]: value
      }
    }));
  };

  const updateObjectives = (field: keyof RequirementsData['objectives'], value: any) => {
    setData(prev => ({
      ...prev,
      objectives: {
        ...prev.objectives,
        [field]: value
      }
    }));
  };

  const addGoal = (goal: string) => {
    if (goal.trim()) {
      setData(prev => ({
        ...prev,
        objectives: {
          ...prev.objectives,
          goals: [...prev.objectives.goals, goal.trim()]
        }
      }));
    }
  };

  const removeGoal = (index: number) => {
    setData(prev => ({
      ...prev,
      objectives: {
        ...prev.objectives,
        goals: prev.objectives.goals.filter((_, i) => i !== index)
      }
    }));
  };

  const addFunctionalRequirement = () => {
    const newReq = {
      id: `FR-${Date.now()}`,
      title: '',
      description: '',
      priority: 'medium' as const,
      category: ''
    };
    setData(prev => ({
      ...prev,
      functionalRequirements: [...prev.functionalRequirements, newReq]
    }));
  };

  const updateFunctionalRequirement = (index: number, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      functionalRequirements: prev.functionalRequirements.map((req, i) => 
        i === index ? { ...req, [field]: value } : req
      )
    }));
  };

  const removeFunctionalRequirement = (index: number) => {
    setData(prev => ({
      ...prev,
      functionalRequirements: prev.functionalRequirements.filter((_, i) => i !== index)
    }));
  };

  const generateDocument = () => {
    const doc = `
# 要件定義書

## 1. プロジェクト概要
**プロジェクト名:** ${data.projectOverview.projectName}
**プロジェクト概要:** ${data.projectOverview.projectDescription}
**プロジェクトマネージャー:** ${data.projectOverview.projectManager}
**開始予定日:** ${data.projectOverview.startDate}
**終了予定日:** ${data.projectOverview.endDate}

## 2. 目的・目標
**目的:** ${data.objectives.purpose}

**目標:**
${data.objectives.goals.map(goal => `- ${goal}`).join('\n')}

**成功基準:** ${data.objectives.successCriteria}

## 3. 機能要件
${data.functionalRequirements.map(req => `
### ${req.id}: ${req.title}
**優先度:** ${req.priority}
**カテゴリ:** ${req.category}
**説明:** ${req.description}
`).join('\n')}

## 4. 非機能要件
**性能要件:** ${data.nonFunctionalRequirements.performance}
**セキュリティ要件:** ${data.nonFunctionalRequirements.security}
**ユーザビリティ要件:** ${data.nonFunctionalRequirements.usability}
**信頼性要件:** ${data.nonFunctionalRequirements.reliability}
**拡張性要件:** ${data.nonFunctionalRequirements.scalability}
**保守性要件:** ${data.nonFunctionalRequirements.maintainability}
    `;
    
    return doc.trim();
  };

  const downloadDocument = () => {
    const doc = generateDocument();
    const blob = new Blob([doc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.projectOverview.projectName || '要件定義書'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            要件定義書テンプレート
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadDocument}>
                <Download className="h-4 w-4 mr-2" />
                ダウンロード
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            システム開発の要件定義書を構造化して作成できます
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="objectives">目的・目標</TabsTrigger>
          <TabsTrigger value="functional">機能要件</TabsTrigger>
          <TabsTrigger value="non-functional">非機能要件</TabsTrigger>
          <TabsTrigger value="preview">プレビュー</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>プロジェクト概要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">プロジェクト名</Label>
                  <Input
                    id="projectName"
                    value={data.projectOverview.projectName}
                    onChange={(e) => updateProjectOverview('projectName', e.target.value)}
                    placeholder="プロジェクト名を入力"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectManager">プロジェクトマネージャー</Label>
                  <Input
                    id="projectManager"
                    value={data.projectOverview.projectManager}
                    onChange={(e) => updateProjectOverview('projectManager', e.target.value)}
                    placeholder="担当者名を入力"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">開始予定日</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={data.projectOverview.startDate}
                    onChange={(e) => updateProjectOverview('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">終了予定日</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={data.projectOverview.endDate}
                    onChange={(e) => updateProjectOverview('endDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectDescription">プロジェクト概要</Label>
                <Textarea
                  id="projectDescription"
                  value={data.projectOverview.projectDescription}
                  onChange={(e) => updateProjectOverview('projectDescription', e.target.value)}
                  placeholder="プロジェクトの概要、背景、現状の課題などを記述してください"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objectives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>目的・目標</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">目的</Label>
                <Textarea
                  id="purpose"
                  value={data.objectives.purpose}
                  onChange={(e) => updateObjectives('purpose', e.target.value)}
                  placeholder="このプロジェクトの目的を記述してください"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>目標</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="目標を入力してEnterキーを押してください"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addGoal((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.objectives.goals.map((goal, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeGoal(index)}>
                      {goal} ✕
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="successCriteria">成功基準</Label>
                <Textarea
                  id="successCriteria"
                  value={data.objectives.successCriteria}
                  onChange={(e) => updateObjectives('successCriteria', e.target.value)}
                  placeholder="プロジェクトの成功をどのように測定するかを記述してください"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="functional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                機能要件
                <Button onClick={addFunctionalRequirement} size="sm">
                  要件を追加
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.functionalRequirements.map((req, index) => (
                <div key={req.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{req.id}</span>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removeFunctionalRequirement(index)}
                    >
                      削除
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label>タイトル</Label>
                      <Input
                        value={req.title}
                        onChange={(e) => updateFunctionalRequirement(index, 'title', e.target.value)}
                        placeholder="機能名"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>カテゴリ</Label>
                      <Input
                        value={req.category}
                        onChange={(e) => updateFunctionalRequirement(index, 'category', e.target.value)}
                        placeholder="例：ユーザー管理"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>優先度</Label>
                      <select
                        value={req.priority}
                        onChange={(e) => updateFunctionalRequirement(index, 'priority', e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="high">高</option>
                        <option value="medium">中</option>
                        <option value="low">低</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>説明</Label>
                    <Textarea
                      value={req.description}
                      onChange={(e) => updateFunctionalRequirement(index, 'description', e.target.value)}
                      placeholder="機能の詳細な説明を記述してください"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              {data.functionalRequirements.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  機能要件を追加してください
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="non-functional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>非機能要件</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries({
                performance: '性能要件',
                security: 'セキュリティ要件',
                usability: 'ユーザビリティ要件',
                reliability: '信頼性要件',
                scalability: '拡張性要件',
                maintainability: '保守性要件'
              }).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{label}</Label>
                  <Textarea
                    id={key}
                    value={data.nonFunctionalRequirements[key as keyof typeof data.nonFunctionalRequirements]}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      nonFunctionalRequirements: {
                        ...prev.nonFunctionalRequirements,
                        [key]: e.target.value
                      }
                    }))}
                    placeholder={`${label}について記述してください`}
                    rows={2}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                要件定義書プレビュー
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border overflow-auto max-h-96">
                {generateDocument()}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}