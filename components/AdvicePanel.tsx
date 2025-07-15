import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Lightbulb } from 'lucide-react';
import { Phase } from '../App';

interface AdvicePanelProps {
  phase: Phase;
}

export function AdvicePanel({ phase }: AdvicePanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          アドバイス &amp; ベストプラクティス
        </CardTitle>
        <CardDescription>
          このフェーズで重要なポイントです
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {phase.advice.map((advice, index) => (
          <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs mt-1">
                TIP
              </Badge>
              <p className="text-sm text-blue-800">{advice}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}