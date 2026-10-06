/*
  Public address of the site, used for canonical links, Open Graph tags and
  structured data. Set VITE_SITE_URL once the real domain is live.
*/
export const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/+$/, '')

/** Turns a site path ("/blog") or an already absolute URL into an absolute URL. */
export const absoluteUrl = (pathOrUrl: string) => new URL(pathOrUrl, `${siteUrl}/`).href
