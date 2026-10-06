import { useQuery } from '@tanstack/react-query'
import Markdown from 'react-markdown'
import { Link, useParams } from 'react-router'
import { PostMeta } from '../../../components/content/PostCard'
import { ResponsiveImage } from '../../../components/media/ResponsiveImage'
import { Container } from '../../../components/ui/Container'
import { formatDateTime } from '../../../lib/date'
import { imageSchema, parseOrNull } from '../../../schemas/content'
import { adminCategoriesQuery, adminPostQuery, postState } from '../../api/blog'
import { EmptyState, ErrorState, LoadingRows } from '../../components/ui'

const stateText = {
  draft: 'Draft: only admins can see this.',
  scheduled: 'Scheduled: not public yet.',
  published: 'Published: this is live on the blog.',
  archived: 'Archived: hidden from the blog.',
}

/* The saved version of a post, rendered like the public article. Admin-only. */
export default function PostPreview() {
  const { id = '' } = useParams()
  const post = useQuery(adminPostQuery(id))
  const categories = useQuery(adminCategoriesQuery)

  if (post.isPending) return <div className="p-8"><LoadingRows rows={6} /></div>
  if (post.isError) return <div className="p-8"><ErrorState onRetry={() => void post.refetch()} /></div>
  if (!post.data) return <div className="p-8"><EmptyState title="This post doesn’t exist." /></div>

  const p = post.data
  const state = postState(p)
  const cover = parseOrNull(imageSchema, p.cover_image, 'cover')
  const category = categories.data?.find((c) => c.id === p.category_id)
  const summary = {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverImage: cover,
    authorName: p.author_name,
    publishedAt: p.published_at ?? p.updated_at,
    isFeatured: p.is_featured,
    category: category ? { name: category.name, slug: category.slug } : null,
  }

  return (
    <>
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink">
        <p>
          Preview. {stateText[state]}
          {state === 'scheduled' && p.published_at && ` Goes live ${formatDateTime(p.published_at)}.`}
        </p>
        <Link to={`/admin/blog/${p.id}`} className="underline underline-offset-4">
          Back to editor
        </Link>
      </div>

      <article>
        <Container className="pt-16 md:pt-24">
          <div className="mx-auto max-w-4xl">
            <PostMeta post={summary} />
            <h1 className="type-display mt-5 text-display">{p.title || 'Untitled post'}</h1>
            {p.excerpt && <p className="mt-6 text-xl leading-relaxed text-chalk/75 md:text-2xl">{p.excerpt}</p>}
            {p.author_name && <p className="mt-8 text-sm text-chalk/60">By {p.author_name}</p>}
          </div>
        </Container>
        {cover && (
          <Container className="mt-12">
            <div className="aspect-[16/9] overflow-hidden bg-iron">
              <ResponsiveImage image={cover} sizes="100vw" priority className="h-full w-full object-cover" />
            </div>
          </Container>
        )}
        <Container className="py-16 md:py-24">
          <div className="article mx-auto max-w-3xl">
            <Markdown>{p.content || '*No article text yet.*'}</Markdown>
          </div>
        </Container>
      </article>
    </>
  )
}
