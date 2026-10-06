import { CheckCircle2, X, XCircle } from 'lucide-react'
import { cn } from '../../lib/cn'
import { toast, useToasts } from '../toast'

export function Toaster() {
  const toasts = useToasts()

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 md:inset-x-auto md:right-6 md:bottom-6 md:items-end"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.tone === 'error' ? 'alert' : 'status'}
          className={cn(
            'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border bg-iron px-4 py-3 text-sm shadow-lg shadow-black/30',
            t.tone === 'error' ? 'border-accent/60' : 'border-chalk/15',
          )}
        >
          {t.tone === 'error' ? (
            <XCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
          ) : (
            <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-emerald-300" />
          )}
          <p className="flex-1">{t.message}</p>
          <button type="button" onClick={() => toast.dismiss(t.id)} className="-m-1 p-1 text-chalk/50 hover:text-chalk">
            <X aria-hidden className="size-4" />
            <span className="sr-only">Dismiss</span>
          </button>
        </div>
      ))}
    </div>
  )
}
