import { Link } from 'react-router'
import { MaskedLines } from '../ui/MaskedLines'

type SectionHeaderProps = {
  title: string
  link?: { label: string; to: string }
}

/** Section title with an optional "see all" link aligned to its baseline. */
export function SectionHeader({ title, link }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <MaskedLines text={title} className="type-display text-display" />
      {link && (
        <Link
          to={link.to}
          className="hit-area pb-2 text-sm font-semibold underline decoration-chalk/30 underline-offset-4 transition-colors hover:decoration-accent"
        >
          {link.label}
        </Link>
      )}
    </div>
  )
}
