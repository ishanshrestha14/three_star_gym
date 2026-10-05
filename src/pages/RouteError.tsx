import { isRouteErrorResponse, useRouteError } from 'react-router'
import NotFound from './NotFound'

/* Last-resort screen when a route throws while rendering or loading. */
export function RouteError() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />

  return (
    <div className="mx-auto max-w-xl px-4 pt-40 pb-32">
      <h1 className="type-display text-headline">Something broke on this page</h1>
      <p className="mt-6 text-chalk/70">Reload the page to try again. If it keeps happening, call or WhatsApp the gym directly.</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-8 inline-flex h-12 items-center bg-accent px-6 text-sm font-semibold text-accent-ink"
      >
        Reload page
      </button>
    </div>
  )
}
