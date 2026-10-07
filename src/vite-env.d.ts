/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SITE_URL?: string
  readonly VITE_UMAMI_WEBSITE_ID?: string
}

/** Gym name and contact numbers captured at build time for the error page; null if Supabase was unreachable. */
declare const __CONTACT_FALLBACK__: {
  name: string
  phone: string
  whatsappNumber: string
  whatsappMessage: string
} | null

interface ImportMeta {
  readonly env: ImportMetaEnv
}
