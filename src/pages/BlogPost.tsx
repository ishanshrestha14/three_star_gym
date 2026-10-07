import { ArrowLeft } from 'lucide-react'
import { useRef } from 'react'
import Markdown from 'react-markdown'
import { Link, useParams } from 'react-router'
import { gsap } from '../animations/gsap'
import { useMotion } from '../animations/useMotion'
import { usePost, usePosts } from '../api/blog'
import { useSiteSettings } from '../api/settings'
import { PostCard, PostMeta } from '../components/content/PostCard'
import { ResponsiveImage } from '../components/media/ResponsiveImage'
import { JsonLd } from '../components/seo/JsonLd'
import { Seo } from '../components/seo/Seo'
import { Container } from '../components/ui/Container'
import { CtaLink } from '../components/ui/CtaLink'
import { imageFallback } from '../lib/media'
import { absoluteUrl, siteUrl } from '../lib/url'
import NotFound from './NotFound'

const readingMinutes = (text: string) => Math.max(1, Math.round(text.split(/\s+/).length / 200))

export default function BlogPost() {
  const { slug = '' } = useParams()
  const post = usePost(slug)
  const related = usePosts()
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
  const site = useSiteSettings()
  const ref = useRef<HTMLElement>(null)

  useMotion(() => {
    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .from('[data-post-head] > *', { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.07 })
      .from('[data-post-cover]', { clipPath: 'inset(12% 6% 12% 6%)', duration: 1.2, ease: 'expo.out' }, 0.2)
  }, ref)

  if (!post) return <NotFound />

  return (
    <article ref={ref}>
      <Seo
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        image={post.coverImage}
        type="article"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          image: post.coverImage ? absoluteUrl(imageFallback(post.coverImage)) : undefined,
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
          author: { '@type': 'Person', name: post.authorName || site.name },
          publisher: { '@type': 'Organization', name: site.name, url: `${siteUrl}/` },
        }}
      />

      <Container className="pt-32 md:pt-40">
        <div data-post-head className="mx-auto max-w-4xl">
          <Link to="/blog" className="hit-area mb-8 inline-flex items-center gap-2 text-sm text-chalk/60 hover:text-chalk">
            <ArrowLeft aria-hidden className="size-4" />
            All articles
          </Link>
          <PostMeta post={post} />
          <h1 className="type-display mt-5 text-display">{post.title}</h1>
          <p className="mt-6 text-xl leading-relaxed text-chalk/75 md:text-2xl">{post.excerpt}</p>
          <p className="mt-8 text-sm text-chalk/60">
            {post.author ? (
              <>
                By{' '}
                <Link to={`/trainers/${post.author.slug}`} className="text-chalk underline decoration-chalk/30 underline-offset-4 hover:decoration-accent">
                  {post.author.name}
                </Link>
              </>
            ) : (
              post.authorName && `By ${post.authorName}`
            )}
            {post.authorName && ', '}
            {readingMinutes(post.content)} min read
          </p>
        </div>
      </Container>

      {post.coverImage && (
        <Container className="mt-12 md:mt-16">
          <div data-post-cover className="aspect-[16/9] overflow-hidden bg-iron">
            <ResponsiveImage image={post.coverImage} sizes="(min-width: 1440px) 1360px, 100vw" priority className="h-full w-full object-cover" />
          </div>
        </Container>
      )}

      <Container className="py-16 md:py-24">
        <div className="article mx-auto max-w-3xl">
          <Markdown>{post.content}</Markdown>
        </div>

        <div className="mx-auto mt-16 max-w-3xl border-t border-accent pt-8">
          <p className="text-xl font-semibold">Want a coach to help you put this into practice?</p>
          <CtaLink to="/free-trial" className="mt-6">
            Book a free trial
          </CtaLink>
        </div>
      </Container>

      {related.length > 0 && (
        <section className="border-t border-chalk/15 py-16 md:py-24">
          <Container>
            <h2 className="type-display text-headline">Keep reading</h2>
            <ul className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <PostCard post={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </article>
  )
}
