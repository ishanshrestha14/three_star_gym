import type { EnquiryStatus } from '../../api/enquiries'
import { cn } from '../../lib/cn'
import { statusLabel } from '../api/enquiries'

const tone: Record<EnquiryStatus, string> = {
  new: 'bg-accent text-accent-ink',
  contacted: 'bg-sky-400/15 text-sky-200',
  interested: 'bg-violet-400/15 text-violet-200',
  follow_up: 'bg-amber-400/15 text-amber-200',
  converted: 'bg-emerald-400/15 text-emerald-200',
  closed: 'bg-chalk/10 text-chalk/60',
  spam: 'bg-chalk/5 text-chalk/40 line-through',
}

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span className={cn('inline-flex rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap', tone[status])}>
      {statusLabel[status]}
    </span>
  )
}
