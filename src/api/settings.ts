import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { openingHoursSchema, parseOrNull } from '../schemas/content'
import type { SiteSettings } from '../types/content'

async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from('site_settings').select('*').single()
  if (error) throw error

  return {
    name: data.gym_name,
    shortName: data.short_name,
    city: data.city,
    area: data.area,
    description: data.description,
    phone: data.phone,
    whatsappNumber: data.whatsapp_number,
    whatsappMessage: data.whatsapp_message,
    email: data.email,
    address: data.address,
    googleMapsUrl: data.google_maps_url,
    instagramUrl: data.instagram_url,
    facebookUrl: data.facebook_url,
    tiktokUrl: data.tiktok_url,
    openingHours: parseOrNull(openingHoursSchema, data.opening_hours, 'opening hours') ?? [],
  }
}

export const siteSettingsQuery = queryOptions({
  queryKey: ['site-settings'],
  queryFn: fetchSiteSettings,
})

/** Site settings are loaded by the root route before anything renders. */
export function useSiteSettings() {
  return useSuspenseQuery(siteSettingsQuery).data
}
