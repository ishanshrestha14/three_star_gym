import { MessageCircle, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { useSiteSettings } from '../api/settings'
import { EnquiryForm } from '../components/forms/EnquiryForm'
import { PageHeader } from '../components/sections/PageHeader'
import { GymJsonLd } from '../components/seo/GymJsonLd'
import { Seo } from '../components/seo/Seo'
import { Container } from '../components/ui/Container'
import { pages } from '../content/pages'
import { telHref, whatsappHref } from '../lib/contact'

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-chalk/15 py-6">
      <h2 className="text-sm text-chalk/60">{label}</h2>
      <div className="mt-2 text-lg">{children}</div>
    </div>
  )
}

const linkClass = 'underline decoration-chalk/30 underline-offset-4 transition-colors hover:decoration-accent'

export default function Contact() {
  const site = useSiteSettings()
  // Google's keyless embed: no API key or billing needed for a single pin.
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(`${site.name}, ${site.address}`)}&output=embed`
  const socials = [
    { label: 'Instagram', href: site.instagramUrl },
    { label: 'Facebook', href: site.facebookUrl },
    { label: 'TikTok', href: site.tiktokUrl },
  ].filter((social) => social.href)

  return (
    <>
      <Seo title="Contact" description={pages.contact.seoDescription} />
      <GymJsonLd />
      <PageHeader title={pages.contact.title} intro={pages.contact.intro} />

      <Container className="grid gap-16 py-16 md:grid-cols-12 md:gap-8 md:py-28">
        <div className="md:col-span-5">
          <Detail label="Address">
            <address className="not-italic">{site.address}</address>
            <a href={site.googleMapsUrl} target="_blank" rel="noopener noreferrer" className={`hit-area mt-2 inline-block text-base font-semibold ${linkClass}`}>
              Get directions
            </a>
          </Detail>
          <Detail label="Phone">
            <a href={telHref(site.phone)} className="inline-flex items-center gap-3">
              <Phone aria-hidden="true" className="size-5 shrink-0 text-accent" strokeWidth={1.5} />
              <span className={linkClass}>{site.phone}</span>
            </a>
          </Detail>
          <Detail label="WhatsApp">
            <a href={whatsappHref(site)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3">
              <MessageCircle aria-hidden="true" className="size-5 shrink-0 text-accent" strokeWidth={1.5} />
              <span className={linkClass}>Chat with us</span>
            </a>
          </Detail>
          {site.email && (
            <Detail label="Email">
              <a href={`mailto:${site.email}`} className={`[overflow-wrap:anywhere] ${linkClass}`}>
                {site.email}
              </a>
            </Detail>
          )}
          {site.openingHours.length > 0 && (
            <Detail label="Opening hours">
              <dl className="space-y-2">
                {site.openingHours.map((row) => (
                  <div key={row.days} className="flex flex-wrap justify-between gap-x-6">
                    <dt className="text-chalk/70">{row.days}</dt>
                    <dd>{row.hours}</dd>
                  </div>
                ))}
              </dl>
            </Detail>
          )}
          {socials.length > 0 && (
            <Detail label="Follow us">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Detail>
          )}
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <h2 className="type-display text-headline">Send a message</h2>
          <p className="mt-3 mb-10 text-chalk/70">Questions about membership, training or anything else.</p>
          <EnquiryForm
            source="contact_form"
            subject="Website contact form"
            submitLabel="Send message"
            messageLabel="How can we help?"
            successTitle="Message sent."
          />
        </div>
      </Container>

      <div className="aspect-[4/3] w-full bg-iron md:aspect-[21/8]">
        <iframe
          title={`Map showing ${site.name}`}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0 [filter:grayscale(1)_invert(0.92)_contrast(0.9)]"
        />
      </div>
    </>
  )
}
