import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { db } from '../lib/db'
import type { BlogPost, BlogPostSummary } from '../types/content'
import { toImage, unwrap } from './shared'

const summaryColumns =
  'slug, title, excerpt, cover_image, author_name, published_at, is_featured, category:blog_categories(name, slug)'

type SummaryRow = {
  slug: string
  title: string
  excerpt: string
  cover_image: unknown
  author_name: string
  published_at: string | null
  is_featured: boolean
  category: { name: string; slug: string } | null
}

function toSummary(row: SummaryRow): BlogPostSummary {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImage: toImage(row.cover_image, `post ${row.slug} cover`),
    authorName: row.author_name,
    publishedAt: row.published_at ?? '',
    isFeatured: row.is_featured,
    category: row.category,
  }
}

/*
  Published and not scheduled for later. RLS enforces the same rule for
  visitors, but admins can see drafts, so the filter is repeated here.
*/
const publicPosts = () =>
  db
    .from('blog_posts')
    .select(summaryColumns)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })

export const postsQuery = queryOptions({
  queryKey: ['blog', 'posts'],
  queryFn: async () => (await publicPosts().then(unwrap)).map(toSummary),
})

export const usePosts = () => useSuspenseQuery(postsQuery).data

async function fetchPost(slug: string): Promise<BlogPost | null> {
  const { data: row, error } = await db
    .from('blog_posts')
    .select(`${summaryColumns}, content, tags, seo_title, seo_description, author:trainers(slug, name)`)
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle()
  if (error) throw error
  if (!row) return null

  return {
    ...toSummary(row),
    content: row.content,
    tags: row.tags,
    author: row.author,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  }
}

export const postQuery = (slug: string) =>
  queryOptions({ queryKey: ['blog', 'post', slug], queryFn: () => fetchPost(slug) })

export const usePost = (slug: string) => useSuspenseQuery(postQuery(slug)).data
