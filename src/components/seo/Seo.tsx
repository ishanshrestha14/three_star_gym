import { useEffect } from 'react'
import { site } from '../../content/site'

type SeoProps = {
  title?: string
  description?: string
}

function setMeta(selector: string, content: string) {
  document.head.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

/*
  Updates the static tags declared in index.html instead of rendering new ones,
  so the head never ends up with duplicate <title>/<meta> elements.
*/
export function Seo({ title, description = site.description }: SeoProps) {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — Gym in ${site.city}`

  useEffect(() => {
    document.title = fullTitle
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', fullTitle)
    setMeta('meta[property="og:description"]', description)
  }, [fullTitle, description])

  return null
}
