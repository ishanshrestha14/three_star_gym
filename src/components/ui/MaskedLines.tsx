import type { ElementType } from 'react'
import { splitLines } from '../../lib/format'
import { cn } from '../../lib/cn'

type MaskedLinesProps = {
  text: string
  as?: ElementType
  className?: string
  lineClassName?: string
}

/*
  Renders "\n"-separated text as one masked block per line, ready for
  revealLines(). Screen readers get the full text once, without line splits.
*/
export function MaskedLines({ text, as: Tag = 'h2', className, lineClassName }: MaskedLinesProps) {
  const lines = splitLines(text)
  return (
    <Tag className={className} aria-label={lines.join(' ')}>
      {lines.map((line, index) => (
        <span key={index} aria-hidden className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
          <span data-line className={cn('block', lineClassName)}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
