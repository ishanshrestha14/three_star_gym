import { Link } from 'react-router'
import { formatDate } from '../../lib/date'
import type { BlogPostSummary } from '../../types/content'
import { ResponsiveImage } from '../media/ResponsiveImage'

export function PostMeta({ post }: { post: BlogPostSummary }) {
  return (
    <p className="flex flex-wrap gap-x-3 text-sm">
      {post.category && <span className="font-semibold text-accent">{post.category.name}</span>}
      {post.publishedAt && (
        <time dateTime={post.publishedAt} className="text-chalk/60">
          {formatDate(post.publishedAt)}
        </time>
      )}
    </p>
  )
}

export function PostCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <div className="aspect-[4/3] overflow-hidden bg-iron">
        {post.coverImage && (
          <ResponsiveImage
            image={post.coverImage}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-700 ease-out-strong group-hover:scale-[1.04]"
          />
        )}
      </div>
      <div className="mt-5">
        <PostMeta post={post} />
        <h3 className="mt-3 text-2xl leading-tight font-semibold underline-offset-4 group-hover:underline">{post.title}</h3>
        <p className="mt-3 line-clamp-3 leading-relaxed text-chalk/65">{post.excerpt}</p>
      </div>
    </Link>
  )
}
