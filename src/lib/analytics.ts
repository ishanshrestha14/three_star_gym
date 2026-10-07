import { siteUrl } from './url'

/*
  Umami Cloud: cookieless analytics, so no consent banner. It only loads when
  VITE_UMAMI_WEBSITE_ID is set, which is done for Vercel's Production
  environment only; local dev and preview deployments send nothing.
  Page views are tracked by the script itself. Never put names, phone numbers
  or emails into events.
*/

type EventData = Record<string, string | number | boolean>
type UmamiPayload = { url?: string } & Record<string, unknown>

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => void }
    umamiBeforeSend?: (type: string, payload: UmamiPayload) => UmamiPayload | false
  }
}

const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID

const isAdmin = (path: string) => path.startsWith('/admin')

export function track(name: string, data?: EventData) {
  if (isAdmin(window.location.pathname)) return
  window.umami?.track(name, data)
}

/** Which part of the page a click came from, so "Call" in the mobile bar and on the Contact page can be told apart. */
function areaOf(element: Element) {
  const area = element.closest('[data-analytics-area]')?.getAttribute('data-analytics-area')
  if (area) return area
  if (element.closest('header')) return 'header'
  if (element.closest('footer')) return 'footer'
  return 'page'
}

/*
  One listener for the whole site: phone, WhatsApp and directions links are
  recognised by their URL wherever they appear, and button-style links
  (CtaLink) by their data-cta attribute.
*/
function onClick(event: MouseEvent) {
  const link = (event.target as Element | null)?.closest?.('a[href]')
  if (!(link instanceof HTMLAnchorElement)) return

  const data = { page: window.location.pathname, area: areaOf(link) }
  if (link.protocol === 'tel:') track('phone_clicked', data)
  else if (link.hostname === 'wa.me') track('whatsapp_clicked', data)
  else if (/(^|\.)google\.[a-z.]+$/.test(link.hostname) && link.pathname.startsWith('/maps')) track('directions_clicked', data)
  else if (link.dataset.cta !== undefined) track('cta_click', { ...data, label: link.textContent?.trim().slice(0, 60) ?? '' })
}

export function initAnalytics() {
  if (!websiteId) return

  // Drop anything from the admin before it leaves the browser.
  window.umamiBeforeSend = (_type, payload) =>
    payload.url && isAdmin(new URL(payload.url, window.location.origin).pathname) ? false : payload

  const script = document.createElement('script')
  script.defer = true
  script.src = 'https://cloud.umami.is/script.js'
  script.dataset.websiteId = websiteId
  script.dataset.beforeSend = 'umamiBeforeSend'
  // Only count the real site, even if the ID ends up on another deployment.
  script.dataset.domains = new URL(siteUrl).hostname
  document.head.append(script)

  document.addEventListener('click', onClick, { capture: true })
}
