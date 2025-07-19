import { supabase } from './supabase';

interface EmailInvitationData {
  email: string;
  token: string;
  role: string;
  projectName: string;
  inviterName?: string;
}

// 環境変数の型定義
interface ImportMetaEnv {
  readonly VITE_RESEND_API_KEY?: string;
  readonly VITE_FROM_EMAIL?: string;
  readonly VITE_ENABLE_EMAIL_SENDING?: string;
  readonly DEV?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Resend APIキー（環境変数から取得）
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const FROM_EMAIL = import.meta.env.VITE_FROM_EMAIL || 'noreply@yourdomain.com';
const ENABLE_EMAIL_SENDING = import.meta.env.VITE_ENABLE_EMAIL_SENDING === 'true';

export const sendInvitationEmail = async (data: EmailInvitationData): Promise<{ error: any }> => {
  try {
    // 開発環境での処理
    if (import.meta.env.DEV) {
      console.log('=== 招待メール送信（開発環境） ===');
      console.log('送信先:', data.email);
      console.log('プロジェクト:', data.projectName);
      console.log('役割:', data.role);
      console.log('招待者:', data.inviterName);
      console.log('招待URL:', `${window.location.origin}/invite?token=${data.token}`);
      console.log('メール送信有効:', ENABLE_EMAIL_SENDING);
      console.log('===============================');
      
      // メール送信が無効な場合はコンソールログのみ
      if (!ENABLE_EMAIL_SENDING) {
        console.log('メール送信は無効です（コンソールログのみ）');
        console.log('招待URL（コピーして使用）:', `${window.location.origin}/invite?token=${data.token}`);
        return { error: null };
      }

      // 開発環境では自分のメールアドレスにのみテストメールを送信
      const currentUserEmail = 'hoshimotoyasunori@gmail.com'; // 現在のユーザーのメールアドレス
      
      if (data.email === currentUserEmail) {
        console.log('開発環境: 自分のメールアドレスにテストメールを送信中...');
        
        // 実際のメール送信を試行
        try {
          const { data: result, error } = await supabase.functions.invoke('send-email', {
            body: {
              email: data.email,
              token: data.token,
              role: data.role,
              projectName: data.projectName,
              inviterName: data.inviterName
            }
          });

          if (error) {
            console.warn('開発環境: Edge Function呼び出しに失敗しました');
            console.warn('エラー詳細:', error.message);
            console.log('招待URL（手動でテストしてください）:', `${window.location.origin}/invite?token=${data.token}`);
            return { error: null }; // エラーを無視して成功として扱う
          }

          if (result && result.success) {
            console.log('開発環境: テストメール送信成功');
            return { error: null };
          }
        } catch (edgeFunctionError) {
          console.warn('開発環境: Edge Functionエラー:', edgeFunctionError);
          console.log('招待URL（手動でテストしてください）:', `${window.location.origin}/invite?token=${data.token}`);
          return { error: null }; // エラーを無視して成功として扱う
        }
      } else {
        // 他のメールアドレスの場合はコンソールログのみ
        console.log('開発環境: 他のメールアドレスのため、コンソールログのみで対応');
        console.log('招待URL（手動でテストしてください）:', `${window.location.origin}/invite?token=${data.token}`);
        console.log('本番環境では実際のメールが送信されます');
      }

      return { error: null };
    }

    // 本番環境でのみSupabase Edge Functionsを使用してメール送信
    const { data: result, error } = await supabase.functions.invoke('send-email', {
      body: {
        email: data.email,
        token: data.token,
        role: data.role,
        projectName: data.projectName,
        inviterName: data.inviterName
      }
    });

    if (error) {
      console.error('Supabase Edge Functions Error:', error);
      throw new Error(`メール送信に失敗しました: ${error.message}`);
    }

    if (!result.success) {
      throw new Error(result.error || 'メール送信に失敗しました');
    }

    console.log('メール送信成功:', data.email);
    return { error: null };
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return { error };
  }
};

export const generateInvitationEmailContent = (data: EmailInvitationData) => {
  const invitationUrl = `${window.location.origin}/invite?token=${data.token}`;
  const roleText = data.role === 'admin' ? '管理者' : data.role === 'owner' ? 'オーナー' : 'メンバー';
  
  return {
    subject: `プロジェクト「${data.projectName}」への招待`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>プロジェクト招待</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 24px;">プロジェクト招待のお知らせ</h1>
          </div>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            ${data.inviterName || 'プロジェクトメンバー'}さんが、プロジェクト「<strong>${data.projectName}</strong>」にあなたを招待しました。
          </p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; border-radius: 4px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e40af;">プロジェクト詳細</h3>
            <p style="margin: 8px 0;"><strong>プロジェクト名:</strong> ${data.projectName}</p>
            <p style="margin: 8px 0;"><strong>役割:</strong> ${roleText}</p>
            <p style="margin: 8px 0;"><strong>招待者:</strong> ${data.inviterName || 'プロジェクトメンバー'}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationUrl}" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.3s;">
              プロジェクトに参加する
            </a>
          </div>
          
          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 4px; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>注意:</strong> このリンクは7日間有効です。期限が切れた場合は、新しい招待を依頼してください。
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #6b7280; text-align: center; margin: 0;">
            このメールに心当たりがない場合は、無視してください。<br>
            システム設計アシスタント - プロジェクト管理システム
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
プロジェクト招待のお知らせ

${data.inviterName || 'プロジェクトメンバー'}さんが、プロジェクト「${data.projectName}」にあなたを招待しました。

プロジェクト詳細:
- プロジェクト名: ${data.projectName}
- 役割: ${roleText}
- 招待者: ${data.inviterName || 'プロジェクトメンバー'}

以下のリンクをクリックして、プロジェクトに参加してください：
${invitationUrl}

注意: このリンクは7日間有効です。期限が切れた場合は、新しい招待を依頼してください。

このメールに心当たりがない場合は、無視してください。

---
システム設計アシスタント - プロジェクト管理システム
    `
  };
};

// メール送信のテスト用関数
export const testEmailSending = async (email: string): Promise<{ error: any }> => {
  const testData: EmailInvitationData = {
    email,
    token: 'test-token-123',
    role: 'member',
    projectName: 'テストプロジェクト',
    inviterName: 'テストユーザー'
  };
  
  return await sendInvitationEmail(testData);
};

// メール送信設定の確認用関数
export const checkEmailSettings = () => {
  return {
    hasApiKey: !!RESEND_API_KEY,
    fromEmail: FROM_EMAIL,
    enableSending: ENABLE_EMAIL_SENDING,
    isDev: import.meta.env.DEV,
  };
}; 