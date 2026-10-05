import type { SiteSettings } from '../content/site'

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export function whatsappHref(settings: Pick<SiteSettings, 'whatsappNumber' | 'whatsappMessage'>) {
  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`
}
