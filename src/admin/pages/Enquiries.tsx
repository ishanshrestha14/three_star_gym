import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useEffect, useState, type ComponentPropsWithoutRef } from 'react'
import { useSearchParams } from 'react-router'
import type { EnquiryStatus } from '../../api/enquiries'
import { cn } from '../../lib/cn'
import { enquiriesQuery, PAGE_SIZE, STATUSES, statusCountsQuery } from '../api/enquiries'
import { EnquiryTable } from '../components/EnquiryTable'
import { Button, EmptyState, ErrorState, LoadingRows, PageHeader, Panel } from '../components/ui'

const isStatus = (value: string | null): value is EnquiryStatus => STATUSES.some((s) => s.value === value)

export default function Enquiries() {
  const [params, setParams] = useSearchParams()
  const statusParam = params.get('status')
  const status = isStatus(statusParam) ? statusParam : null
  const search = params.get('q') ?? ''
  const page = Math.max(0, Number(params.get('page') ?? 0) || 0)

  const [searchDraft, setSearchDraft] = useState(search)
  const counts = useQuery(statusCountsQuery)
  const list = useQuery(enquiriesQuery({ status, search, page }))

  const update = (next: Record<string, string | null>) => {
    const merged = new URLSearchParams(params)
    for (const [key, value] of Object.entries(next)) {
      if (value) merged.set(key, value)
      else merged.delete(key)
    }
    setParams(merged, { replace: true })
  }

  // Search as you type, debounced so each keystroke doesn't hit the database.
  useEffect(() => {
    if (searchDraft === search) return
    const timeout = window.setTimeout(() => update({ q: searchDraft.trim() || null, page: null }), 300)
    return () => window.clearTimeout(timeout)
  })

  const total = list.data?.total ?? 0
  const lastPage = Math.max(0, Math.ceil(total / PAGE_SIZE) - 1)
  const filtered = Boolean(status || search)

  return (
    <>
      <PageHeader title="Enquiries" description="Everyone who has contacted the gym through the website." />

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        <FilterChip active={!status} onClick={() => update({ status: null, page: null })}>
          All
        </FilterChip>
        {STATUSES.map(({ value, label }) => (
          <FilterChip key={value} active={status === value} onClick={() => update({ status: value, page: null })}>
            {label}
            {counts.data && <span className="ml-1.5 tabular-nums opacity-60">{counts.data[value]}</span>}
          </FilterChip>
        ))}
      </div>

      <Panel>
        <div className="border-b border-chalk/10 p-3">
          <label className="relative block">
            <span className="sr-only">Search enquiries</span>
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-chalk/40" />
            <input
              type="search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Search by name, phone or email"
              className="h-10 w-full rounded border border-chalk/15 bg-transparent pr-3 pl-9 text-sm placeholder:text-chalk/40 focus:border-chalk/50 focus:outline-none"
            />
          </label>
        </div>

        {list.isPending ? (
          <LoadingRows />
        ) : list.isError ? (
          <ErrorState onRetry={() => void list.refetch()} />
        ) : list.data.rows.length === 0 ? (
          filtered ? (
            <EmptyState title="No enquiries match.">Try a different status or search term.</EmptyState>
          ) : (
            <EmptyState title="No enquiries yet.">
              When someone contacts the gym through the website, their enquiry will appear here.
            </EmptyState>
          )
        ) : (
          <div className={cn(list.isPlaceholderData && 'opacity-60 transition-opacity')}>
            <EnquiryTable rows={list.data.rows} />
          </div>
        )}

        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-chalk/10 px-4 py-3 text-sm text-chalk/60">
            <span>
              {page * PAGE_SIZE + 1}–{Math.min(total, (page + 1) * PAGE_SIZE)} of {total}
            </span>
            <div className="flex gap-2">
              <Button disabled={page === 0} onClick={() => update({ page: page - 1 ? String(page - 1) : null })}>
                Previous
              </Button>
              <Button disabled={page >= lastPage} onClick={() => update({ page: String(page + 1) })}>
                Next
              </Button>
            </div>
          </div>
        )}
      </Panel>
    </>
  )
}

function FilterChip({ active, ...props }: { active: boolean } & ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'h-8 rounded-full border px-3 text-sm transition-colors',
        active ? 'border-chalk bg-chalk text-graphite' : 'border-chalk/20 text-chalk/80 hover:border-chalk/50',
      )}
      {...props}
    />
  )
}
