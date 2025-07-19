import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailData {
  email: string;
  token: string;
  role: string;
  projectName: string;
  inviterName?: string;
}

serve(async (req) => {
  // CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, token, role, projectName, inviterName } = await req.json() as EmailData;

    // Resend APIキーを環境変数から取得（ローカル環境用のフォールバック）
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_KCXrH7wa_Ey3SspGxAs1uV376hPChzvcn';
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev';

    if (!RESEND_API_KEY) {
      throw new Error('Resend APIキーが設定されていません');
    }

    // メール内容を生成
    const invitationUrl = `${req.headers.get('origin') || 'http://localhost:5173'}/invite?token=${token}`;
    const roleText = role === 'admin' ? '管理者' : role === 'owner' ? 'オーナー' : 'メンバー';

    const emailContent = {
      subject: `プロジェクト「${projectName}」への招待`,
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
              ${inviterName || 'プロジェクトメンバー'}さんが、プロジェクト「<strong>${projectName}</strong>」にあなたを招待しました。
            </p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; border-radius: 4px; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1e40af;">プロジェクト詳細</h3>
              <p style="margin: 8px 0;"><strong>プロジェクト名:</strong> ${projectName}</p>
              <p style="margin: 8px 0;"><strong>役割:</strong> ${roleText}</p>
              <p style="margin: 8px 0;"><strong>招待者:</strong> ${inviterName || 'プロジェクトメンバー'}</p>
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

${inviterName || 'プロジェクトメンバー'}さんが、プロジェクト「${projectName}」にあなたを招待しました。

プロジェクト詳細:
- プロジェクト名: ${projectName}
- 役割: ${roleText}
- 招待者: ${inviterName || 'プロジェクトメンバー'}

以下のリンクをクリックして、プロジェクトに参加してください：
${invitationUrl}

注意: このリンクは7日間有効です。期限が切れた場合は、新しい招待を依頼してください。

このメールに心当たりがない場合は、無視してください。

---
システム設計アシスタント - プロジェクト管理システム
      `
    };

    // Resend APIにメール送信リクエスト
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API Error:', errorData);
      throw new Error(`メール送信に失敗しました: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('メール送信成功:', email);

    return new Response(
      JSON.stringify({ success: true, message: 'メール送信が完了しました', data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'メール送信に失敗しました' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}) 