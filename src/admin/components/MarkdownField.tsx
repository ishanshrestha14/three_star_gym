import { useId, useState } from 'react'
import Markdown from 'react-markdown'
import { cn } from '../../lib/cn'

type MarkdownFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}

/* Plain-text editor with a preview tab that uses the same styles as the published article. */
export function MarkdownField({ label, value, onChange, error }: MarkdownFieldProps) {
  const id = useId()
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const words = value.trim() ? value.trim().split(/\s+/).length : 0

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <div role="tablist" aria-label={`${label} view`} className="flex rounded border border-chalk/15 p-0.5 text-sm">
          {(['write', 'preview'] as const).map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={tab === name}
              onClick={() => setTab(name)}
              className={cn('rounded px-3 py-1 capitalize', tab === name ? 'bg-chalk/15 text-chalk' : 'text-chalk/60 hover:text-chalk')}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {tab === 'write' ? (
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          rows={20}
          className="mt-2 block w-full resize-y rounded border border-chalk/20 bg-graphite px-3 py-3 font-mono text-sm leading-relaxed focus:border-chalk/60 focus:outline-none aria-invalid:border-accent"
        />
      ) : (
        <div className="mt-2 min-h-80 rounded border border-chalk/20 bg-graphite px-5 py-4">
          {value.trim() ? (
            <div className="article max-w-none">
              <Markdown>{value}</Markdown>
            </div>
          ) : (
            <p className="text-chalk/50">Nothing to preview yet.</p>
          )}
        </div>
      )}

      <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-chalk/50">
        <p>
          <code>## Heading</code> &nbsp; <code>**bold**</code> &nbsp; <code>*italic*</code> &nbsp; <code>- list item</code> &nbsp;{' '}
          <code>[link](https://…)</code>. Leave a blank line between paragraphs.
        </p>
        <p>
          {words} words, about {Math.max(1, Math.round(words / 200))} min read
        </p>
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  )
}
