import { Phone } from 'lucide-react'
import { Link } from 'react-router'
import { useSiteSettings } from '../../api/settings'
import { telHref, whatsappHref } from '../../lib/contact'

/** Sticky Call / WhatsApp / Join bar, mobile only. */
export function MobileActionBar() {
  const site = useSiteSettings()
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[1fr_1fr_1.4fr] border-t border-chalk/10 bg-graphite/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <a href={telHref(site.phone)} className="flex h-14 items-center justify-center gap-2 text-sm font-semibold">
        <Phone aria-hidden className="size-4" />
        Call
      </a>
      <a
        href={whatsappHref(site)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 items-center justify-center border-l border-chalk/10 text-sm font-semibold"
      >
        WhatsApp
      </a>
      <Link to="/free-trial" className="flex h-14 items-center justify-center bg-accent text-sm font-semibold text-accent-ink">
        Free trial
      </Link>
    </div>
  )
}
