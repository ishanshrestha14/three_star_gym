import { loadEnv, type Plugin } from 'vite'

type ContactFallback = { name: string; phone: string; whatsappNumber: string; whatsappMessage: string }

/*
  Captures the gym's name and contact numbers from Supabase when the site is
  built and exposes them as __CONTACT_FALLBACK__. The error page uses them, so
  visitors can still call or WhatsApp the gym when the database is unreachable.
*/
export function contactFallback(): Plugin {
  return {
    name: 'contact-fallback',
    async config(config, { mode }) {
      const env = loadEnv(mode, config.envDir || config.root || process.cwd(), 'VITE_')
      let contact: ContactFallback | null = null
      try {
        const res = await fetch(
          `${env.VITE_SUPABASE_URL}/rest/v1/site_settings?select=gym_name,phone,whatsapp_number,whatsapp_message`,
          { headers: { apikey: env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}` } },
        )
        if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
        const [row] = (await res.json()) as Record<string, string>[]
        if (row) {
          contact = {
            name: row.gym_name,
            phone: row.phone,
            whatsappNumber: row.whatsapp_number,
            whatsappMessage: row.whatsapp_message,
          }
        }
      } catch (error) {
        // The error page still works without it, just with no contact buttons.
        console.warn(`[contact-fallback] Couldn't load contact details from Supabase: ${error}`)
      }
      return { define: { __CONTACT_FALLBACK__: JSON.stringify(contact) } }
    },
  }
}
