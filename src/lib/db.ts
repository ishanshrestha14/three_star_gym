import { PostgrestClient } from '@supabase/postgrest-js'
import type { Database } from '../types/database'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill them in.')
}

/*
  Read-only data client for the public site. It's just the PostgREST part of
  supabase-js, so visitors don't download auth, storage and realtime code they
  never use. Always anonymous; the admin uses the full client in lib/supabase.
  Its own retries are off: React Query already retries, and stacking both kept
  visitors on a blank screen for ~15 s before the error page during an outage.
*/
export const db = new PostgrestClient<Database>(`${url}/rest/v1`, {
  headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  retry: false,
})
