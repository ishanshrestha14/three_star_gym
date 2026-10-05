import { redirect, type LoaderFunctionArgs } from 'react-router'
import { supabase } from '../lib/supabase'

export type AdminSession = { email: string }

/*
  Route guard for /admin/*. This only decides what the UI shows; Row Level
  Security is what actually protects the data.
*/
export async function requireAdmin({ request }: LoaderFunctionArgs): Promise<AdminSession> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    const url = new URL(request.url)
    throw redirect(`/admin/login?next=${encodeURIComponent(url.pathname + url.search)}`)
  }

  const { data: isAdmin, error } = await supabase.rpc('is_admin')
  if (error) throw error
  if (!isAdmin) {
    await supabase.auth.signOut()
    throw redirect('/admin/login?denied=1')
  }

  return { email: session.user.email ?? '' }
}

/** Only allow redirects back into the admin, never to another site. */
export function safeNext(next: string | null) {
  return next && next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin'
}
