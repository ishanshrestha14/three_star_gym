import { useSiteSettings } from '../../api/settings'
import { absoluteUrl, siteUrl } from '../../lib/url'
import { JsonLd } from './JsonLd'

/* The gym as a local business (schema.org HealthClub), for Google's map and knowledge panel. */
export function GymJsonLd() {
  const site = useSiteSettings()

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'HealthClub',
        '@id': `${siteUrl}/#gym`,
        name: site.name,
        description: site.description,
        url: `${siteUrl}/`,
        image: absoluteUrl('/og-default.jpg'),
        telephone: site.phone,
        email: site.email || undefined,
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address,
          addressLocality: site.city,
          addressCountry: 'NP',
        },
        hasMap: site.googleMapsUrl || undefined,
        sameAs: [site.instagramUrl, site.facebookUrl, site.tiktokUrl].filter(Boolean),
      }}
    />
  )
}
