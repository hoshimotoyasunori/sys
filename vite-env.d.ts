/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_RESEND_API_KEY?: string;
  readonly VITE_FROM_EMAIL?: string;
  readonly VITE_ENABLE_EMAIL_SENDING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 