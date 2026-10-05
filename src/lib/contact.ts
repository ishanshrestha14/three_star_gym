import type { SiteSettings } from '../types/content'

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export function whatsappHref(settings: Pick<SiteSettings, 'whatsappNumber' | 'whatsappMessage'>) {
  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`
}

/*
  WhatsApp link for a number typed into a form. Local Nepali mobiles
  (98XXXXXXXX / 97XXXXXXXX) get the 977 country code added.
*/
export function whatsappChatHref(phone: string) {
  const digits = phone.replace(/\D/g, '')
  const international = digits.length === 10 && digits.startsWith('9') ? `977${digits}` : digits
  return `https://wa.me/${international}`
}
