import { ArrowDown, ArrowUp, X } from 'lucide-react'

type RowControlsProps = {
  index: number
  count: number
  onMove: (from: number, to: number) => void
  onRemove: (index: number) => void
  label: string
}

/* Up / down / remove buttons for one row of a repeating group in a form. */
export function RowControls({ index, count, onMove, onRemove, label }: RowControlsProps) {
  const button = 'flex size-9 items-center justify-center rounded border border-chalk/15 text-chalk/70 hover:text-chalk disabled:opacity-30'
  return (
    <div className="flex gap-1.5">
      <button type="button" className={button} disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label={`Move ${label} up`}>
        <ArrowUp className="size-4" />
      </button>
      <button type="button" className={button} disabled={index === count - 1} onClick={() => onMove(index, index + 1)} aria-label={`Move ${label} down`}>
        <ArrowDown className="size-4" />
      </button>
      <button type="button" className={button} onClick={() => onRemove(index)} aria-label={`Remove ${label}`}>
        <X className="size-4" />
      </button>
    </div>
  )
}
