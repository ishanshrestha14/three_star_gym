import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import type { Image } from '../../types/content'
import {
  contentListQuery,
  useDeleteContent,
  useMoveContent,
  useTogglePublished,
  type ContentTable,
  type Row,
} from '../api/content'
import { buttonClass } from './buttonClass'
import { ResourceList, type ResourceItem } from './ResourceList'
import { PageHeader } from './ui'

type ContentListPageProps<T extends ContentTable> = {
  table: T
  /** Route segment, e.g. "faqs" → /admin/faqs/:id */
  path: string
  title: string
  description: string
  addLabel: string
  emptyTitle: string
  emptyBody: ReactNode
  toItem: (row: Row<T>) => Omit<ResourceItem, 'id' | 'published'>
  imagesOf?: (row: Row<T>) => (Image | null | undefined)[]
  /** Extra tools shown between the header and the list */
  children?: ReactNode
}

/* Standard list screen for a content type: header with an add button, then the shared list. */
export function ContentListPage<T extends ContentTable>({
  table,
  path,
  title,
  description,
  addLabel,
  emptyTitle,
  emptyBody,
  toItem,
  imagesOf,
  children,
}: ContentListPageProps<T>) {
  const list = useQuery(contentListQuery(table))
  const toggle = useTogglePublished(table)
  const move = useMoveContent(table)
  const remove = useDeleteContent(table, imagesOf)
  const rows = list.data ?? []
  const idOf = (row: Row<T>) => (row as { id: string }).id

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Link to={`/admin/${path}/new`} className={buttonClass('primary')}>
            <Plus aria-hidden className="size-4" />
            {addLabel}
          </Link>
        }
      />
      {children}
      <ResourceList
        items={list.data?.map((row) => ({
          ...toItem(row),
          id: idOf(row),
          published: (row as { published: boolean }).published,
        }))}
        isPending={list.isPending}
        isError={list.isError}
        onRetry={() => void list.refetch()}
        editPath={(id) => `/admin/${path}/${id}`}
        emptyTitle={emptyTitle}
        emptyBody={emptyBody}
        onTogglePublished={(item) => toggle.mutate({ id: item.id, published: !item.published })}
        onMove={(index, delta) => move.mutate({ ids: rows.map(idOf), index, delta })}
        onDelete={(item) => {
          const row = rows.find((r) => idOf(r) === item.id)
          if (row) remove.mutate(row)
        }}
        busy={toggle.isPending || move.isPending || remove.isPending}
      />
    </>
  )
}
