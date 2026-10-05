import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import type { EnquiryStatus } from '../../api/enquiries'
import { telHref, whatsappChatHref } from '../../lib/contact'
import { formatDateTime, formatRelativeDate } from '../../lib/date'
import {
  enquiryNotesQuery,
  enquiryQuery,
  sourceLabel,
  useAddEnquiryNote,
  useDeleteEnquiry,
  useUpdateEnquiryStatus,
} from '../api/enquiries'
import { StatusBadge } from '../components/StatusBadge'
import { buttonClass } from '../components/buttonClass'
import { Button, EmptyState, ErrorState, LoadingRows, Panel } from '../components/ui'

// The actions from the PRD, in the order an enquiry usually moves.
const actions: { status: EnquiryStatus; label: string }[] = [
  { status: 'contacted', label: 'Mark contacted' },
  { status: 'interested', label: 'Interested' },
  { status: 'follow_up', label: 'Follow up' },
  { status: 'converted', label: 'Converted' },
  { status: 'closed', label: 'Close' },
]

export default function EnquiryDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const enquiry = useQuery(enquiryQuery(id))
  const notes = useQuery(enquiryNotesQuery(id))
  const updateStatus = useUpdateEnquiryStatus(id)
  const addNote = useAddEnquiryNote(id)
  const deleteEnquiry = useDeleteEnquiry(id)
  const [note, setNote] = useState('')

  const back = (
    <Link to="/admin/enquiries" className="mb-6 inline-flex items-center gap-2 text-sm text-chalk/60 hover:text-chalk">
      <ArrowLeft className="size-4" />
      All enquiries
    </Link>
  )

  if (enquiry.isPending) return <>{back}<Panel><LoadingRows rows={6} /></Panel></>
  if (enquiry.isError) return <>{back}<Panel><ErrorState onRetry={() => void enquiry.refetch()} /></Panel></>
  if (!enquiry.data) {
    return (
      <>
        {back}
        <Panel>
          <EmptyState title="This enquiry doesn’t exist.">It may have been deleted.</EmptyState>
        </Panel>
      </>
    )
  }

  const e = enquiry.data

  const submitNote = (event: FormEvent) => {
    event.preventDefault()
    const body = note.trim()
    if (!body) return
    addNote.mutate(body, { onSuccess: () => setNote('') })
  }

  const remove = () => {
    if (!window.confirm(`Delete the enquiry from ${e.name}? This can’t be undone.`)) return
    deleteEnquiry.mutate(undefined, { onSuccess: () => navigate('/admin/enquiries', { replace: true }) })
  }

  return (
    <>
      {back}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{e.name}</h1>
          <p className="mt-1 text-chalk/60">
            {sourceLabel[e.source]}, received {formatRelativeDate(e.created_at).toLowerCase()}
          </p>
        </div>
        <StatusBadge status={e.status} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <a href={telHref(e.phone)} className={buttonClass('primary')}>
          <Phone className="size-4" />
          Call {e.phone}
        </a>
        <a href={whatsappChatHref(e.phone)} target="_blank" rel="noopener noreferrer" className={buttonClass()}>
          <MessageCircle className="size-4" />
          WhatsApp
        </a>
        {e.email && (
          <a href={`mailto:${e.email}`} className={buttonClass()}>
            Email
          </a>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <Panel className="p-5">
            <h2 className="text-sm text-chalk/50">Message</h2>
            {e.subject && <p className="mt-2 font-medium">{e.subject}</p>}
            <p className="mt-2 whitespace-pre-wrap text-chalk/90">{e.message || 'No message was left.'}</p>
          </Panel>

          <Panel>
            <h2 className="border-b border-chalk/10 px-5 py-3 font-medium">Internal notes</h2>
            {notes.isPending ? (
              <LoadingRows rows={2} />
            ) : notes.isError ? (
              <ErrorState onRetry={() => void notes.refetch()} />
            ) : notes.data.length === 0 ? (
              <p className="px-5 py-6 text-sm text-chalk/60">No notes yet. Notes are only visible to admins.</p>
            ) : (
              <ol className="divide-y divide-chalk/10">
                {notes.data.map((n) => (
                  <li key={n.id} className="px-5 py-4">
                    <p className="whitespace-pre-wrap">{n.body}</p>
                    <p className="mt-1 text-xs text-chalk/50">
                      {n.author?.display_name || n.author?.email || 'Former admin'}, {formatRelativeDate(n.created_at)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
            <form onSubmit={submitNote} className="border-t border-chalk/10 p-4">
              <label htmlFor="note" className="sr-only">
                Add a note
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                maxLength={4000}
                placeholder="Add a note, e.g. “Called, coming for a trial on Sunday at 7 am”"
                className="w-full resize-y rounded border border-chalk/15 bg-transparent p-3 text-sm placeholder:text-chalk/40 focus:border-chalk/50 focus:outline-none"
              />
              {addNote.isError && <p role="alert" className="mt-2 text-sm text-accent">The note didn’t save. Try again.</p>}
              <Button type="submit" className="mt-2" disabled={!note.trim() || addNote.isPending}>
                {addNote.isPending ? 'Adding…' : 'Add note'}
              </Button>
            </form>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="p-5">
            <h2 className="text-sm text-chalk/50">Update status</h2>
            <div className="mt-3 grid gap-2">
              {actions.map((action) => (
                <Button
                  key={action.status}
                  variant={e.status === action.status ? 'selected' : 'secondary'}
                  aria-pressed={e.status === action.status}
                  disabled={updateStatus.isPending}
                  onClick={() => updateStatus.mutate(action.status)}
                  className="justify-start"
                >
                  {action.label}
                </Button>
              ))}
              <Button
                variant={e.status === 'spam' ? 'selected' : 'ghost'}
                aria-pressed={e.status === 'spam'}
                disabled={updateStatus.isPending}
                onClick={() => updateStatus.mutate('spam')}
                className="justify-start"
              >
                Mark as spam
              </Button>
            </div>
            {updateStatus.isError && (
              <p role="alert" className="mt-3 text-sm text-accent">
                The status didn’t change. Try again.
              </p>
            )}
          </Panel>

          <Panel className="p-5">
            <dl className="space-y-3 text-sm">
              <Detail label="Phone" value={e.phone} />
              <Detail label="Email" value={e.email ?? 'Not given'} />
              <Detail label="Source" value={sourceLabel[e.source]} />
              {e.plan && <Detail label="Interested in" value={`${e.plan.name} plan`} />}
              {e.page_path && <Detail label="Sent from" value={e.page_path} />}
              <Detail label="Received" value={formatDateTime(e.created_at)} />
            </dl>
          </Panel>

          <Button variant="danger" onClick={remove} disabled={deleteEnquiry.isPending} className="w-full">
            Delete enquiry
          </Button>
          {deleteEnquiry.isError && <p role="alert" className="text-sm text-accent">The enquiry wasn’t deleted. Try again.</p>}
        </div>
      </div>
    </>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-chalk/50">{label}</dt>
      <dd className="mt-0.5 break-words">{value}</dd>
    </div>
  )
}
