import { useSyncExternalStore } from 'react'

export type Toast = { id: number; tone: 'success' | 'error'; message: string }

let toasts: Toast[] = []
let nextId = 1
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

function show(tone: Toast['tone'], message: string) {
  const id = nextId++
  toasts = [...toasts, { id, tone, message }]
  emit()
  // Errors stay longer: they usually need reading.
  window.setTimeout(() => dismiss(id), tone === 'error' ? 8000 : 3500)
}

/** Short confirmation messages for admin actions: toast.success('Saved.') */
export const toast = {
  success: (message: string) => show('success', message),
  error: (message: string) => show('error', message),
  dismiss,
}

export function useToasts() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => toasts,
  )
}
