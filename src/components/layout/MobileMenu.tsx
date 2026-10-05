import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { gsap, MOTION_OK, useGSAP } from '../../animations/gsap'
import { useSiteSettings } from '../../api/settings'
import { primaryNav, secondaryNav } from '../../content/navigation'
import { telHref, whatsappHref } from '../../lib/contact'

type MobileMenuProps = {
  onClose: () => void
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const site = useSiteSettings()
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from(ref.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.45, ease: 'power3.inOut' })
          .from('[data-menu-item]', { yPercent: 110, duration: 0.55, stagger: 0.04 }, '-=0.15')
          .from('[data-menu-footer]', { autoAlpha: 0, duration: 0.3 }, '-=0.3')
      })
    },
    { scope: ref },
  )

  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector<HTMLAnchorElement>('a')?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-graphite px-4 pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 md:hidden"
    >
      <nav aria-label="Mobile" className="flex flex-col">
        {primaryNav.map((item) => (
          <span key={item.to} className="overflow-hidden">
            <Link
              to={item.to}
              onClick={onClose}
              data-menu-item
              className="type-display block py-1 text-[clamp(3rem,15vw,5rem)] leading-[0.95]"
            >
              {item.label}
            </Link>
          </span>
        ))}
      </nav>

      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-lg text-chalk/70">
        {secondaryNav.map((item) => (
          <li key={item.to} className="overflow-hidden">
            <Link to={item.to} onClick={onClose} data-menu-item className="block py-1 hover:text-chalk">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div data-menu-footer className="mt-auto grid grid-cols-2 gap-2 pt-10">
        <a href={telHref(site.phone)} className="flex h-12 items-center justify-center border border-chalk/30 text-sm font-semibold">
          Call
        </a>
        <a
          href={whatsappHref(site)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center border border-chalk/30 text-sm font-semibold"
        >
          WhatsApp
        </a>
        <Link
          to="/free-trial"
          onClick={onClose}
          className="col-span-2 flex h-12 items-center justify-center bg-accent text-sm font-semibold text-accent-ink"
        >
          Book a free trial
        </Link>
      </div>
    </div>
  )
}
