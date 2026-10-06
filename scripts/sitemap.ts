import type { Plugin } from 'vite'

/*
  Writes robots.txt and sitemap.xml into the build. Blog posts, services and
  trainers are read from Supabase at build time, so the sitemap is as fresh as
  the last deploy. Google also finds new pages through internal links.
*/

const staticPaths = ['/', '/about', '/services', '/membership', '/trainers', '/gallery', '/blog', '/faq', '/contact', '/free-trial']

type Entry = { path: string; lastmod?: string }
type Row = { slug: string; updated_at: string }

async function fetchRows(env: Record<string, string>, query: string): Promise<Row[]> {
  const res = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/${query}`, {
    headers: { apikey: env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}` },
  })
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  return (await res.json()) as Row[]
}

async function dynamicEntries(env: Record<string, string>): Promise<Entry[]> {
  const now = new Date().toISOString()
  const [posts, services, trainers] = await Promise.all([
    fetchRows(env, `blog_posts?select=slug,updated_at&status=eq.published&published_at=lte.${now}`),
    fetchRows(env, 'services?select=slug,updated_at&published=eq.true'),
    fetchRows(env, 'trainers?select=slug,updated_at&published=eq.true'),
  ])
  const toEntries = (base: string, rows: Row[]) =>
    rows.map((row) => ({ path: `${base}/${row.slug}`, lastmod: row.updated_at.slice(0, 10) }))

  return [...toEntries('/blog', posts), ...toEntries('/services', services), ...toEntries('/trainers', trainers)]
}

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function sitemapXml(siteUrl: string, entries: Entry[]) {
  const urls = entries.map(({ path, lastmod }) => {
    const loc = `<loc>${escapeXml(siteUrl + (path === '/' ? '/' : path))}</loc>`
    return `  <url>${loc}${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
  })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

export function sitemap(): Plugin {
  let env: Record<string, string> = {}

  return {
    name: 'sitemap',
    apply: 'build',
    configResolved(config) {
      env = config.env
    },
    async generateBundle() {
      const siteUrl = (env.VITE_SITE_URL ?? '').replace(/\/+$/, '')
      if (!siteUrl) {
        this.warn('VITE_SITE_URL is not set; skipping robots.txt and sitemap.xml')
        return
      }

      let entries: Entry[] = staticPaths.map((path) => ({ path }))
      try {
        entries = entries.concat(await dynamicEntries(env))
      } catch (error) {
        // Don't fail the deploy over the sitemap; ship the static pages only.
        this.warn(`Couldn't load pages from Supabase, sitemap has static pages only: ${error}`)
      }

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(siteUrl, entries) })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nDisallow: /admin\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
    },
  }
}
