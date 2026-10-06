import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Check, Pencil, Trash2, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { describeError } from '../../api/content'
import { adminCategoriesQuery, useDeleteCategory, useSaveCategory } from '../../api/blog'
import { Input } from '../../components/form'
import { Button, EmptyState, ErrorState, LoadingRows, PageHeader, Panel } from '../../components/ui'
import { slugify } from '../../lib/slug'
import { toast } from '../../toast'

export default function Categories() {
  const categories = useQuery(adminCategoriesQuery)
  const save = useSaveCategory()
  const remove = useDeleteCategory()
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null)

  const run = (promise: Promise<unknown>, success: string) =>
    promise.then(
      () => toast.success(success),
      (error) => toast.error(describeError(error, 'That didn’t save. Try again.')),
    )

  const add = (event: FormEvent) => {
    event.preventDefault()
    const name = newName.trim()
    if (!name) return
    const sortOrder = (categories.data?.length ?? 0) + 1
    void run(save.mutateAsync({ name, slug: slugify(name), sort_order: sortOrder }), `Added “${name}”.`).then(() => setNewName(''))
  }

  const rename = (event: FormEvent) => {
    event.preventDefault()
    if (!editing?.name.trim()) return
    void run(save.mutateAsync({ id: editing.id, name: editing.name.trim(), slug: slugify(editing.name) }), 'Category renamed.').then(() => setEditing(null))
  }

  return (
    <>
      <Link to="/admin/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-chalk/60 hover:text-chalk">
        <ArrowLeft aria-hidden className="size-4" />
        All posts
      </Link>
      <PageHeader title="Blog categories" description="Visitors can filter the blog by these. Only categories with published posts are shown." />

      <Panel className="mb-6 p-4">
        <form onSubmit={add} className="flex flex-wrap gap-2">
          <label htmlFor="new-category" className="sr-only">
            New category name
          </label>
          <Input id="new-category" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Recovery" className="max-w-sm flex-1" />
          <Button type="submit" variant="primary" disabled={!newName.trim() || save.isPending}>
            Add category
          </Button>
        </form>
      </Panel>

      <Panel>
        {categories.isPending ? (
          <LoadingRows />
        ) : categories.isError ? (
          <ErrorState onRetry={() => void categories.refetch()} />
        ) : categories.data.length === 0 ? (
          <EmptyState title="No categories yet." />
        ) : (
          <ul className="divide-y divide-chalk/10">
            {categories.data.map((category) => (
              <li key={category.id} className="flex items-center gap-3 px-4 py-3">
                {editing?.id === category.id ? (
                  <form onSubmit={rename} className="flex flex-1 items-center gap-2">
                    <Input
                      autoFocus
                      aria-label="Category name"
                      value={editing.name}
                      onChange={(e) => setEditing({ id: category.id, name: e.target.value })}
                      className="max-w-sm py-2"
                    />
                    <button type="submit" aria-label="Save name" className="flex size-9 items-center justify-center rounded hover:bg-chalk/10">
                      <Check className="size-4" />
                    </button>
                    <button type="button" aria-label="Cancel" onClick={() => setEditing(null)} className="flex size-9 items-center justify-center rounded hover:bg-chalk/10">
                      <X className="size-4" />
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="flex-1 font-medium">{category.name}</span>
                    <button
                      type="button"
                      aria-label={`Rename ${category.name}`}
                      onClick={() => setEditing({ id: category.id, name: category.name })}
                      className="flex size-9 items-center justify-center rounded text-chalk/70 hover:bg-chalk/10 hover:text-chalk"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${category.name}`}
                      onClick={() => {
                        if (window.confirm(`Delete “${category.name}”? Posts in it stay, without a category.`))
                          void run(remove.mutateAsync(category.id), 'Category deleted.')
                      }}
                      className="flex size-9 items-center justify-center rounded text-chalk/70 hover:bg-chalk/10 hover:text-red-300"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  )
}
