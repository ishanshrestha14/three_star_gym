import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { z } from 'zod'
import { formatDateTime } from '../../../lib/date'
import { imageSchema } from '../../../schemas/content'
import type { Image } from '../../../types/content'
import type { Tables } from '../../../types/database'
import { adminCategoriesQuery, adminPostQuery, postState, useDeletePost, useSavePost } from '../../api/blog'
import { contentListQuery, describeError } from '../../api/content'
import { EditPage } from '../../components/EditPage'
import { AdminField, FormSection, Input, Select, Textarea, Toggle } from '../../components/form'
import { ImageField } from '../../components/ImageField'
import { ListField } from '../../components/ListField'
import { MarkdownField } from '../../components/MarkdownField'
import { SeoFields } from '../../components/SeoFields'
import { SlugField } from '../../components/SlugField'
import { Button, EmptyState, ErrorState, LoadingRows, Panel } from '../../components/ui'
import { SLUG_PATTERN } from '../../lib/slug'
import { toast } from '../../toast'
import { onInvalid } from '../../useSaveAndReturn'
import { useUnsavedChanges } from '../../useUnsavedChanges'

type Publish = 'draft' | 'publish' | 'schedule' | 'archived'

const schema = z
  .object({
    title: z.string().trim().min(1, 'Give the post a title').max(200),
    slug: z.string().regex(SLUG_PATTERN, 'Use lowercase letters, numbers and dashes only'),
    excerpt: z.string().trim().max(300, 'Keep the summary under 300 characters'),
    cover_image: imageSchema.nullable(),
    content: z.string(),
    category_id: z.string(),
    trainer_id: z.string(),
    author_name: z.string().trim().max(100),
    tags: z.array(z.string()),
    publish: z.enum(['draft', 'publish', 'schedule', 'archived']),
    publish_at: z.string(),
    is_featured: z.boolean(),
    seo_title: z.string().trim().max(70),
    seo_description: z.string().trim().max(200),
  })
  .refine((v) => v.publish !== 'schedule' || (v.publish_at && new Date(v.publish_at) > new Date()), {
    path: ['publish_at'],
    message: 'Choose a date and time in the future',
  })
  .refine((v) => v.publish === 'draft' || v.content.trim().length > 0, {
    path: ['content'],
    message: 'Write the article before publishing it',
  })
type Values = z.infer<typeof schema>
type Post = Tables<'blog_posts'>

/** ISO timestamp → value for <input type="datetime-local"> in the viewer's time zone. */
function toLocalInput(iso: string | null) {
  if (!iso) return ''
  const date = new Date(iso)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

function initialPublish(post: Post | null): Publish {
  if (!post) return 'draft'
  const state = postState(post)
  return state === 'scheduled' ? 'schedule' : state === 'published' ? 'publish' : state
}

export default function PostEdit() {
  const { id = 'new' } = useParams()
  const isNew = id === 'new'
  const post = useQuery({ ...adminPostQuery(id), enabled: !isNew })

  if (isNew) return <PostForm post={null} />
  if (post.isPending) return <Panel><LoadingRows rows={8} /></Panel>
  if (post.isError) return <Panel><ErrorState onRetry={() => void post.refetch()} /></Panel>
  if (!post.data) return <Panel><EmptyState title="This post doesn’t exist.">It may have been deleted.</EmptyState></Panel>
  return <PostForm post={post.data} />
}

function PostForm({ post }: { post: Post | null }) {
  const navigate = useNavigate()
  const save = useSavePost()
  const remove = useDeletePost()
  const categories = useQuery(adminCategoriesQuery).data ?? []
  const trainers = useQuery(contentListQuery('trainers')).data ?? []
  const initialCover = (post?.cover_image as Image | null) ?? null

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      excerpt: post?.excerpt ?? '',
      cover_image: initialCover,
      content: post?.content ?? '',
      category_id: post?.category_id ?? '',
      trainer_id: post?.trainer_id ?? '',
      author_name: post?.author_name ?? '',
      tags: post?.tags ?? [],
      publish: initialPublish(post),
      publish_at: toLocalInput(post?.published_at ?? null),
      is_featured: post?.is_featured ?? false,
      seo_title: post?.seo_title ?? '',
      seo_description: post?.seo_description ?? '',
    },
  })
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = form
  const [publish, title, excerpt] = useWatch({ control, name: ['publish', 'title', 'excerpt'] })
  const { allowNavigation } = useUnsavedChanges(isDirty)

  const onSubmit = handleSubmit(async ({ publish, publish_at, category_id, trainer_id, tags, ...values }) => {
    const wasLive = post && postState(post) === 'published'
    const status = publish === 'draft' ? 'draft' : publish === 'archived' ? 'archived' : 'published'
    const published_at =
      publish === 'schedule'
        ? new Date(publish_at).toISOString()
        : publish === 'publish'
          ? wasLive
            ? post.published_at // keep the original date when re-saving a live post
            : new Date().toISOString()
          : publish === 'archived'
            ? (post?.published_at ?? null)
            : null

    try {
      await save.mutateAsync({
        id: post?.id,
        values: {
          ...values,
          status,
          published_at,
          category_id: category_id || null,
          trainer_id: trainer_id || null,
          tags: tags.map((t) => t.trim()).filter(Boolean),
        },
        images: { before: [initialCover], after: [values.cover_image] },
      })
      toast.success(
        publish === 'schedule'
          ? `Scheduled for ${formatDateTime(published_at!)}.`
          : publish === 'publish'
            ? 'Published. It’s live on the blog.'
            : publish === 'archived'
              ? 'Archived. It’s hidden from the blog.'
              : 'Draft saved.',
      )
      allowNavigation()
      navigate('/admin/blog')
    } catch (error) {
      toast.error(describeError(error, 'The post didn’t save. Try again.'))
    }
  }, onInvalid)

  // mutateAsync, not mutate(..., { onSuccess }): the refetch after deleting unmounts this
  // form, and per-call callbacks don't run once the caller has unmounted.
  const deletePost = async () => {
    if (!post || !window.confirm(`Delete “${post.title}”? This can’t be undone.`)) return
    try {
      await remove.mutateAsync({ id: post.id, cover: initialCover })
      toast.success('Post deleted.')
      allowNavigation()
      navigate('/admin/blog')
    } catch (error) {
      toast.error(describeError(error, 'The post wasn’t deleted. Try again.'))
    }
  }

  const submitLabel = { draft: 'Save draft', publish: post && postState(post) === 'published' ? 'Save changes' : 'Publish', schedule: 'Schedule', archived: 'Archive' }[publish]

  return (
    <EditPage
      title={post ? 'Edit post' : 'New post'}
      backTo="/admin/blog"
      backLabel="All posts"
      onSubmit={(event) => void onSubmit(event)}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
      submitLabel={submitLabel}
      aside={
        post && (
          <a
            href={`/admin/blog/${post.id}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-chalk/60 hover:text-chalk"
          >
            <Eye aria-hidden className="size-4" />
            Preview last saved version
          </a>
        )
      }
    >
      <FormSection title="Article">
        <AdminField label="Title" error={errors.title?.message}>
          {(a11y) => <Input {...a11y} {...register('title')} className="text-lg font-semibold" />}
        </AdminField>
        <SlugField form={form} name="slug" source="title" prefix="/blog/" isNew={!post || postState(post) === 'draft'} />
        <AdminField label="Summary" hint="One or two sentences. Shown on the blog page and when the link is shared." error={errors.excerpt?.message}>
          {(a11y) => <Textarea {...a11y} {...register('excerpt')} rows={2} />}
        </AdminField>
        <Controller
          control={control}
          name="cover_image"
          render={({ field, fieldState }) => (
            <ImageField label="Cover photo" folder="blog" aspect="aspect-video" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <Controller
          control={control}
          name="content"
          render={({ field, fieldState }) => (
            <MarkdownField label="Article" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
      </FormSection>

      <FormSection title="Details">
        <AdminField label="Category">
          {(a11y) => (
            <Select {...a11y} {...register('category_id')}>
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          )}
        </AdminField>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField label="Written by a trainer" hint="Links the byline to their profile.">
            {(a11y) => (
              <Select
                {...a11y}
                {...register('trainer_id', {
                  onChange: (event) => {
                    const trainer = trainers.find((t) => t.id === event.target.value)
                    if (trainer) setValue('author_name', trainer.name, { shouldDirty: true })
                  },
                })}
              >
                <option value="">Not a trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.name}
                  </option>
                ))}
              </Select>
            )}
          </AdminField>
          <AdminField label="Author name" hint="Shown as “By …”. Leave blank to hide the byline." error={errors.author_name?.message}>
            {(a11y) => <Input {...a11y} {...register('author_name')} />}
          </AdminField>
        </div>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => <ListField label="Tags (optional)" value={field.value} onChange={field.onChange} placeholder="beginners" addLabel="Add tag" />}
        />
      </FormSection>

      <FormSection title="Publishing">
        <fieldset className="space-y-3">
          <legend className="sr-only">When should this post appear?</legend>
          {(
            [
              ['draft', 'Draft', 'Only visible here in the admin.'],
              ['publish', 'Published', 'Live on the blog.'],
              ['schedule', 'Scheduled', 'Goes live automatically at the date and time you choose.'],
              ['archived', 'Archived', 'Taken down from the blog but kept here.'],
            ] as const
          ).map(([value, label, description]) => (
            <label key={value} className="flex gap-3 text-sm">
              <input type="radio" value={value} {...register('publish')} className="mt-1 accent-[var(--color-accent)]" />
              <span>
                <span className="font-medium">{label}</span>
                <span className="block text-chalk/50">{description}</span>
              </span>
            </label>
          ))}
        </fieldset>
        {publish === 'schedule' && (
          <AdminField label="Go live at" error={errors.publish_at?.message}>
            {(a11y) => <Input {...a11y} {...register('publish_at')} type="datetime-local" className="sm:max-w-64" />}
          </AdminField>
        )}
        <Toggle {...register('is_featured')} label="Feature at the top of the blog" description="Only one post is featured. Featuring this one replaces the current one." />
      </FormSection>

      <SeoFields
        form={form}
        titleName="seo_title"
        descriptionName="seo_description"
        titleFallback={title || 'Post title'}
        descriptionFallback={excerpt || 'Summary'}
      />

      {post && (
        <FormSection title="Delete">
          <Button variant="danger" onClick={() => void deletePost()} disabled={remove.isPending}>
            Delete this post
          </Button>
        </FormSection>
      )}
    </EditPage>
  )
}
