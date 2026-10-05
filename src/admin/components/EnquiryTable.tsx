import { Link } from 'react-router'
import type { EnquirySource, EnquiryStatus } from '../../api/enquiries'
import { formatRelativeDate } from '../../lib/date'
import { sourceLabel } from '../api/enquiries'
import { StatusBadge } from './StatusBadge'

export type EnquiryRow = {
  id: string
  name: string
  phone: string
  source: EnquirySource
  status: EnquiryStatus
  created_at: string
}

/* Table on desktop, stacked rows on phones. Every row opens the enquiry. */
export function EnquiryTable({ rows }: { rows: EnquiryRow[] }) {
  return (
    <div>
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="text-chalk/50">
          <tr className="border-b border-chalk/10">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Received</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-chalk/10">
          {rows.map((row) => (
            <tr key={row.id} className="group relative hover:bg-chalk/5">
              <td className="px-4 py-3 font-medium">
                {/* Stretched link makes the whole row clickable while staying one tab stop */}
                <Link to={`/admin/enquiries/${row.id}`} className="after:absolute after:inset-0">
                  {row.name}
                </Link>
              </td>
              <td className="px-4 py-3 tabular-nums text-chalk/80">{row.phone}</td>
              <td className="px-4 py-3 text-chalk/80">{sourceLabel[row.source]}</td>
              <td className="px-4 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3 text-right text-chalk/60">{formatRelativeDate(row.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-chalk/10 md:hidden">
        {rows.map((row) => (
          <li key={row.id}>
            <Link to={`/admin/enquiries/${row.id}`} className="block px-4 py-4 active:bg-chalk/5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{row.name}</span>
                <StatusBadge status={row.status} />
              </div>
              <div className="mt-1 flex justify-between gap-3 text-sm text-chalk/60">
                <span className="tabular-nums">{row.phone}</span>
                <span>
                  {sourceLabel[row.source]}, {formatRelativeDate(row.created_at)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
