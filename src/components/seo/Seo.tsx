import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useSiteSettings } from '../../api/settings'
import { imageFallback } from '../../lib/media'
import { absoluteUrl } from '../../lib/url'
import type { Image } from '../../types/content'

type SeoProps = {
  title?: string
  description?: string
  /** Share image; falls back to the site-wide default. */
  image?: Image | null
  type?: 'website' | 'article'
  /** Keeps the page out of search results (e.g. 404s). */
  noindex?: boolean
}

function setMeta(selector: string, content: string) {
  document.head.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

/* The canonical link is added here rather than in index.html, so crawlers never see "/" as every page's canonical. */
function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.append(link)
  }
  link.href = href
}

/*
  Updates the static tags declared in index.html instead of rendering new ones,
  so the head never ends up with duplicate <title>/<meta> elements.
*/
export function Seo({ title, description: pageDescription, image, type = 'website', noindex = false }: SeoProps) {
  const site = useSiteSettings()
  const { pathname } = useLocation()
  const description = pageDescription ?? site.description
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — Gym in ${site.city}`
  const url = absoluteUrl(pathname)
  const imageHref = absoluteUrl(image ? imageFallback(image) : '/og-default.jpg')

  useEffect(() => {
    document.title = fullTitle
    setCanonical(url)
    setMeta('meta[name="description"]', description)
    setMeta('meta[name="robots"]', noindex ? 'noindex' : 'index, follow')
    setMeta('meta[property="og:title"]', fullTitle)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:url"]', url)
    setMeta('meta[property="og:image"]', imageHref)
    setMeta('meta[property="og:type"]', type)
  }, [fullTitle, description, url, imageHref, type, noindex])

  return null
}
