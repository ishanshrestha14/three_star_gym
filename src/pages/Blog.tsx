import { ArrowRight } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { usePosts } from '../api/blog'
import { PostCard, PostMeta } from '../components/content/PostCard'
import { ResponsiveImage } from '../components/media/ResponsiveImage'
import { PageHeader } from '../components/sections/PageHeader'
import { Seo } from '../components/seo/Seo'
import { Container } from '../components/ui/Container'
import { pages } from '../content/pages'
import { cn } from '../lib/cn'
import type { BlogCategory } from '../types/content'

export default function Blog() {
  const posts = usePosts()
  const [params, setParams] = useSearchParams()

  // Only categories that have posts, in first-seen order.
  const categories = [...new Map(posts.flatMap((p) => (p.category ? [[p.category.slug, p.category]] : []))).values()] as BlogCategory[]
  const active = categories.find((c) => c.slug === params.get('category')) ?? null
  const filtered = active ? posts.filter((p) => p.category?.slug === active.slug) : posts

  // The featured post leads the unfiltered list; fall back to the newest.
  const featured = active ? null : (posts.find((p) => p.isFeatured) ?? posts[0] ?? null)
  const rest = filtered.filter((p) => p !== featured)

  return (
    <>
      <Seo title="Blog" description={pages.blog.seoDescription} />
      <PageHeader title={pages.blog.title} intro={pages.blog.intro} />

      <Container className="py-12 md:py-20">
        {categories.length > 1 && (
          <div className="mb-12 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {[null, ...categories].map((category) => (
              <button
                key={category?.slug ?? 'all'}
                type="button"
                aria-pressed={active?.slug === category?.slug}
                onClick={() => setParams(category ? { category: category.slug } : {}, { replace: true, preventScrollReset: true })}
                className={cn(
                  'h-10 border px-4 text-sm transition-colors',
                  active?.slug === category?.slug ? 'border-chalk bg-chalk text-graphite' : 'border-chalk/25 hover:border-chalk/60',
                )}
              >
                {category?.name ?? 'All'}
              </button>
            ))}
          </div>
        )}

        {posts.length === 0 && <p className="py-20 text-center text-chalk/60">The first articles are on their way.</p>}

        {featured && (
          <Link to={`/blog/${featured.slug}`} className="group mb-20 grid gap-8 md:mb-28 md:grid-cols-12 md:items-center">
            <div className="aspect-[4/3] overflow-hidden bg-iron md:col-span-7">
              {featured.coverImage && (
                <ResponsiveImage
                  image={featured.coverImage}
                  sizes="(min-width: 768px) 58vw, 100vw"
                  priority
                  className="h-full w-full object-cover transition-transform duration-700 ease-out-strong group-hover:scale-[1.03]"
                />
              )}
            </div>
            <div className="md:col-span-5 md:pl-4">
              <PostMeta post={featured} />
              <h2 className="type-display mt-4 text-headline">{featured.title}</h2>
              <p className="mt-5 text-lg leading-relaxed text-chalk/75">{featured.excerpt}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                <span className="underline decoration-chalk/30 underline-offset-4 group-hover:decoration-accent">Read the article</span>
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  )
}
