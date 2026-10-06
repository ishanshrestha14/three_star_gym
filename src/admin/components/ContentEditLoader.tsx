import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useParams } from 'react-router'
import { contentItemQuery, type ContentTable, type Row } from '../api/content'
import { EmptyState, ErrorState, LoadingRows, Panel } from './ui'

/*
  Loads the record for /admin/<type>/:id, or passes null for /admin/<type>/new.
  The form only mounts once data is ready, so its default values are correct.
*/
export function ContentEditLoader<T extends ContentTable>({
  table,
  children,
}: {
  table: T
  children: (row: Row<T> | null) => ReactNode
}) {
  const { id = 'new' } = useParams()
  const isNew = id === 'new'
  const item = useQuery({ ...contentItemQuery(table, id), enabled: !isNew })

  if (isNew) return children(null)
  if (item.isPending) return <Panel><LoadingRows rows={6} /></Panel>
  if (item.isError) return <Panel><ErrorState onRetry={() => void item.refetch()} /></Panel>
  if (!item.data)
    return (
      <Panel>
        <EmptyState title="This item doesn’t exist.">It may have been deleted.</EmptyState>
      </Panel>
    )
  return children(item.data)
}
