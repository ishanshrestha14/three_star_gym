import { Link } from 'react-router'
import { useSiteSettings } from '../../api/settings'
import { primaryNav, secondaryNav } from '../../content/navigation'
import { telHref, whatsappHref } from '../../lib/contact'
import { Container } from '../ui/Container'

export function Footer() {
  const site = useSiteSettings()
  const socials = [
    { label: 'Instagram', href: site.instagramUrl },
    { label: 'Facebook', href: site.facebookUrl },
    { label: 'TikTok', href: site.tiktokUrl },
  ].filter((social): social is { label: string; href: string } => Boolean(social.href))

  return (
    <footer className="border-t border-chalk/10 pt-16 pb-28 md:pb-12">
      <Container>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link to="/" className="type-display text-display block">
              {site.shortName}
            </Link>
            <address className="mt-6 max-w-xs text-chalk/70 not-italic">{site.address}</address>
            <a
              href={site.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-semibold underline decoration-chalk/30 underline-offset-4 hover:decoration-chalk"
            >
              Get directions
            </a>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-sm text-steel">Opening hours</h2>
            <dl className="mt-4 space-y-3">
              {site.openingHours.map((row) => (
                <div key={row.days}>
                  <dt className="text-chalk/70">{row.days}</dt>
                  <dd className="font-medium">{row.hours}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-sm text-steel">Contact</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a href={telHref(site.phone)} className="hover:text-accent">{site.phone}</a>
              </li>
              <li>
                <a href={whatsappHref(site)} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="[overflow-wrap:anywhere] hover:text-accent">{site.email}</a>
              </li>
            </ul>
          </div>

          <nav aria-label="Footer" className="md:col-span-2">
            <h2 className="text-sm text-steel">Explore</h2>
            <ul className="mt-4 space-y-2">
              {[...primaryNav, ...secondaryNav].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-chalk/80 hover:text-chalk">{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-chalk/10 pt-6 text-sm text-steel sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}, {site.city}</p>
          {socials.length > 0 && (
            <ul className="flex gap-6">
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-chalk">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </footer>
  )
}
