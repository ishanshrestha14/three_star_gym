import { useQuery } from '@tanstack/react-query'
import { Plus, Star, Tags } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { ResponsiveImage } from '../../../components/media/ResponsiveImage'
import { cn } from '../../../lib/cn'
import { formatDateTime, formatRelativeDate } from '../../../lib/date'
import { imageSchema, parseOrNull } from '../../../schemas/content'
import { adminPostsQuery, postState, type PostState } from '../../api/blog'
import { buttonClass } from '../../components/buttonClass'
import { EmptyState, ErrorState, LoadingRows, PageHeader, Panel } from '../../components/ui'

const stateStyle: Record<PostState, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-chalk/10 text-chalk/70' },
  published: { label: 'Published', className: 'bg-emerald-400/15 text-emerald-200' },
  scheduled: { label: 'Scheduled', className: 'bg-sky-400/15 text-sky-200' },
  archived: { label: 'Archived', className: 'bg-chalk/5 text-chalk/40' },
}
const filters: (PostState | null)[] = [null, 'draft', 'scheduled', 'published', 'archived']

export default function PostList() {
  const posts = useQuery(adminPostsQuery)
  const [params, setParams] = useSearchParams()
  const active = filters.find((f) => f === params.get('status')) ?? null
  const rows = (posts.data ?? []).map((post) => ({ ...post, state: postState(post) }))
  const visible = active ? rows.filter((post) => post.state === active) : rows

  return (
    <>
      <PageHeader
        title="Blog"
        description="Articles for the blog. Drafts and scheduled posts stay hidden until their publish date."
        actions={
          <>
            <Link to="/admin/blog/categories" className={buttonClass()}>
              <Tags aria-hidden className="size-4" />
              Categories
            </Link>
            <Link to="/admin/blog/new" className={buttonClass('primary')}>
              <Plus aria-hidden className="size-4" />
              New post
            </Link>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter posts">
        {filters.map((filter) => (
          <button
            key={filter ?? 'all'}
            type="button"
            aria-pressed={active === filter}
            onClick={() => setParams(filter ? { status: filter } : {}, { replace: true })}
            className={cn(
              'h-8 rounded-full border px-3 text-sm',
              active === filter ? 'border-chalk bg-chalk text-graphite' : 'border-chalk/20 text-chalk/80 hover:border-chalk/50',
            )}
          >
            {filter ? stateStyle[filter].label : 'All'}
            {filter && posts.data && <span className="ml-1.5 opacity-60">{rows.filter((r) => r.state === filter).length}</span>}
          </button>
        ))}
      </div>

      <Panel>
        {posts.isPending ? (
          <LoadingRows />
        ) : posts.isError ? (
          <ErrorState onRetry={() => void posts.refetch()} />
        ) : visible.length === 0 ? (
          <EmptyState title={active ? 'No posts here.' : 'No posts yet.'}>
            {active ? 'Try a different filter.' : 'Write about training, nutrition or gym news. Helpful articles bring people in from Google.'}
          </EmptyState>
        ) : (
          <ul className="divide-y divide-chalk/10">
            {visible.map((post) => {
              const cover = parseOrNull(imageSchema, post.cover_image, 'cover')
              const style = stateStyle[post.state]
              return (
                <li key={post.id}>
                  <Link to={`/admin/blog/${post.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-chalk/5">
                    <div className="hidden size-14 shrink-0 overflow-hidden rounded bg-graphite sm:block">
                      {cover && <ResponsiveImage image={cover} sizes="56px" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 font-medium">
                        <span className="truncate">{post.title}</span>
                        {post.is_featured && <Star aria-label="Featured" className="size-4 shrink-0 fill-accent text-accent" />}
                      </p>
                      <p className="truncate text-sm text-chalk/55">
                        {post.category?.name ?? 'No category'},{' '}
                        {post.state === 'scheduled' && post.published_at
                          ? `goes live ${formatDateTime(post.published_at)}`
                          : post.state === 'published' && post.published_at
                            ? `published ${formatRelativeDate(post.published_at).toLowerCase()}`
                            : `edited ${formatRelativeDate(post.updated_at).toLowerCase()}`}
                      </p>
                    </div>
                    <span className={cn('shrink-0 rounded px-2 py-0.5 text-xs font-medium', style.className)}>{style.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </Panel>
    </>
  )
}
