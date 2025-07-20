// メール送信機能のテストスクリプト
// 使用方法: node test-email.js

import { checkEmailSettings } from './lib/email.ts';

console.log('=== メール送信設定の確認 ===');
const settings = checkEmailSettings();
console.log('APIキー設定:', settings.hasApiKey ? '✅ 設定済み' : '❌ 未設定');
console.log('送信元メール:', settings.fromEmail);
console.log('メール送信有効:', settings.enableSending ? '✅ 有効' : '❌ 無効');
console.log('開発環境:', settings.isDev ? '✅ 開発環境' : '❌ 本番環境');
console.log('========================');

if (!settings.hasApiKey) {
  console.log('\n⚠️  Resend APIキーが設定されていません');
  console.log('1. https://resend.com/api-keys で新しいAPIキーを生成');
  console.log('2. .env.localファイルの VITE_RESEND_API_KEY を更新');
  console.log('3. このスクリプトを再実行');
} else {
  console.log('\n✅ メール送信設定は正常です');
  console.log('アプリケーションでメール送信機能をテストできます');
} 