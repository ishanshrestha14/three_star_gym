import { useQuery } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { Link } from 'react-router'
import { cn } from '../../../lib/cn'
import { formatRelativeDate } from '../../../lib/date'
import { describeError } from '../../api/content'
import { adminSectionsQuery, useToggleSection } from '../../api/sections'
import { ErrorState, LoadingRows, PageHeader, Panel } from '../../components/ui'
import { toast } from '../../toast'
import { homepageSections } from './sectionList'


export default function HomepageSections() {
  const sections = useQuery(adminSectionsQuery)
  const toggle = useToggleSection()

  return (
    <>
      <PageHeader
        title="Homepage"
        description="Edit the fixed sections of the homepage. Services, trainers, plans and FAQs are edited in their own sections."
      />
      {sections.isPending ? (
        <Panel><LoadingRows /></Panel>
      ) : sections.isError ? (
        <Panel><ErrorState onRetry={() => void sections.refetch()} /></Panel>
      ) : (
        <Panel>
          <ul className="divide-y divide-chalk/10">
            {homepageSections.map(({ key, title, description }) => {
              const row = sections.data.find((s) => s.key === key)
              const visible = row?.is_visible ?? false
              return (
                <li key={key} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4">
                  <Link to={`/admin/homepage/${key}`} className="min-w-0 flex-1 basis-60">
                    <span className="block font-medium hover:underline">{title}</span>
                    <span className="block text-sm text-chalk/55">{description}</span>
                    {row && <span className="mt-1 block text-xs text-chalk/40">Last edited {formatRelativeDate(row.updated_at).toLowerCase()}</span>}
                  </Link>
                  {row && (
                    <button
                      type="button"
                      aria-pressed={visible}
                      disabled={toggle.isPending}
                      onClick={() =>
                        toggle.mutate(
                          { key, isVisible: !visible },
                          {
                            onSuccess: (shown) => toast.success(shown ? `${title} is showing on the homepage.` : `${title} is hidden.`),
                            onError: (error) => toast.error(describeError(error, 'That didn’t change. Try again.')),
                          },
                        )
                      }
                      className={cn(
                        'h-8 rounded-full px-3 text-xs font-medium',
                        visible ? 'bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/25' : 'bg-chalk/10 text-chalk/60 hover:bg-chalk/15',
                      )}
                    >
                      {visible ? 'On website' : 'Hidden'}
                    </button>
                  )}
                  <Link
                    to={`/admin/homepage/${key}`}
                    aria-label={`Edit ${title}`}
                    className="flex size-9 items-center justify-center rounded text-chalk/70 hover:bg-chalk/10 hover:text-chalk"
                  >
                    <Pencil className="size-4" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </Panel>
      )}
    </>
  )
}
