import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { testEmailSending, checkEmailSettings } from '../lib/email';

export function EmailTestDialog() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // メール送信設定を確認
  const emailSettings = checkEmailSettings();

  const handleTestEmail = async () => {
    if (!email) {
      setResult({ success: false, message: 'メールアドレスを入力してください' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { error } = await testEmailSending(email);
      
      if (error) {
        setResult({ success: false, message: `エラー: ${error.message || 'メール送信に失敗しました'}` });
      } else {
        const message = emailSettings.enableSending 
          ? 'テストメールの送信が完了しました。実際のメールを確認してください。'
          : 'テストメールの送信が完了しました。コンソールを確認してください。';
        setResult({ success: true, message });
      }
    } catch (error) {
      setResult({ success: false, message: `予期しないエラー: ${error}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          メール送信テスト
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>メール送信テスト</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 設定状況の表示 */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-800">設定状況</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-700">APIキー:</span>
                <Badge variant={emailSettings.hasApiKey ? "default" : "destructive"} className="text-xs">
                  {emailSettings.hasApiKey ? "設定済み" : "未設定"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-700">送信元メール:</span>
                <span className="text-xs text-blue-700">{emailSettings.fromEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-700">メール送信:</span>
                <Badge variant={emailSettings.enableSending ? "default" : "secondary"} className="text-xs">
                  {emailSettings.enableSending ? "有効" : "無効"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-700">環境:</span>
                <Badge variant="outline" className="text-xs">
                  {emailSettings.isDev ? "開発環境" : "本番環境"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div>
            <Label htmlFor="email">テスト用メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleTestEmail} 
            disabled={isLoading || !email || !emailSettings.hasApiKey}
            className="w-full"
          >
            {isLoading ? '送信中...' : 'テストメールを送信'}
          </Button>

          {result && (
            <Card className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success ? '成功' : 'エラー'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={result.success ? 'text-green-700' : 'text-red-700'}>
                  {result.message}
                </CardDescription>
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-gray-500 space-y-2">
            <p><strong>開発環境:</strong> コンソールログにメール内容が表示されます</p>
            <p><strong>メール送信有効時:</strong> 実際のメールが送信されます</p>
            <p><strong>設定変更:</strong> .env.localのVITE_ENABLE_EMAIL_SENDINGを変更してください</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 