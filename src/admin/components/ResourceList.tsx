import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from 'react-router'
import { ResponsiveImage } from '../../components/media/ResponsiveImage'
import { cn } from '../../lib/cn'
import type { Image } from '../../types/content'
import { EmptyState, ErrorState, LoadingRows, Panel } from './ui'

export type ResourceItem = {
  id: string
  title: string
  subtitle?: ReactNode
  image?: Image | null
  published?: boolean
}

type ResourceListProps = {
  items: ResourceItem[] | undefined
  isPending: boolean
  isError: boolean
  onRetry: () => void
  editPath: (id: string) => string
  emptyTitle: string
  emptyBody: ReactNode
  onTogglePublished?: (item: ResourceItem) => void
  onMove?: (index: number, delta: -1 | 1) => void
  onDelete: (item: ResourceItem) => void
  busy?: boolean
}

/*
  The list view shared by every content type: thumbnail, title, a clear
  "On website / Hidden" state, and the actions people need most.
*/
export function ResourceList({
  items,
  isPending,
  isError,
  onRetry,
  editPath,
  emptyTitle,
  emptyBody,
  onTogglePublished,
  onMove,
  onDelete,
  busy,
}: ResourceListProps) {
  if (isPending) return <Panel><LoadingRows /></Panel>
  if (isError || !items) return <Panel><ErrorState onRetry={onRetry} /></Panel>
  if (items.length === 0)
    return (
      <Panel>
        <EmptyState title={emptyTitle}>{emptyBody}</EmptyState>
      </Panel>
    )

  return (
    <Panel>
      <ul className={cn('divide-y divide-chalk/10', busy && 'opacity-70')}>
        {items.map((item, index) => (
          <li key={item.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
            {item.image !== undefined && (
              <div className="size-14 shrink-0 overflow-hidden rounded bg-graphite">
                {item.image && <ResponsiveImage image={item.image} sizes="56px" className="h-full w-full object-cover" />}
              </div>
            )}

            <Link to={editPath(item.id)} className="min-w-0 flex-1 basis-48">
              <span className="block truncate font-medium hover:underline">{item.title}</span>
              {item.subtitle && <span className="block truncate text-sm text-chalk/55">{item.subtitle}</span>}
            </Link>

            <div className="flex items-center gap-1.5">
              {onTogglePublished && item.published !== undefined && (
                <button
                  type="button"
                  onClick={() => onTogglePublished(item)}
                  disabled={busy}
                  aria-pressed={item.published}
                  title={item.published ? 'Click to hide from the website' : 'Click to publish on the website'}
                  className={cn(
                    'mr-1 h-8 rounded-full px-3 text-xs font-medium whitespace-nowrap transition-colors',
                    item.published ? 'bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/25' : 'bg-chalk/10 text-chalk/60 hover:bg-chalk/15',
                  )}
                >
                  {item.published ? 'On website' : 'Hidden'}
                </button>
              )}
              {onMove && (
                <>
                  <ActionButton label="Move up" disabled={busy || index === 0} onClick={() => onMove(index, -1)}>
                    <ArrowUp className="size-4" />
                  </ActionButton>
                  <ActionButton label="Move down" disabled={busy || index === items.length - 1} onClick={() => onMove(index, 1)}>
                    <ArrowDown className="size-4" />
                  </ActionButton>
                </>
              )}
              <Link
                to={editPath(item.id)}
                aria-label={`Edit ${item.title}`}
                title="Edit"
                className="flex size-9 items-center justify-center rounded text-chalk/70 hover:bg-chalk/10 hover:text-chalk"
              >
                <Pencil className="size-4" />
              </Link>
              <ActionButton
                label={`Delete ${item.title}`}
                disabled={busy}
                onClick={() => {
                  if (window.confirm(`Delete “${item.title}”? This can’t be undone.`)) onDelete(item)
                }}
                className="hover:text-red-300"
              >
                <Trash2 className="size-4" />
              </ActionButton>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function ActionButton({
  label,
  className,
  children,
  ...props
}: { label: string; children: ReactNode } & Omit<ComponentPropsWithoutRef<'button'>, 'aria-label'>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn('flex size-9 items-center justify-center rounded text-chalk/70 hover:bg-chalk/10 hover:text-chalk disabled:opacity-30 disabled:hover:bg-transparent', className)}
      {...props}
    >
      {children}
    </button>
  )
}
