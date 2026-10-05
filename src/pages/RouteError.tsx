/*
  Last-resort screen when a route throws while loading or rendering, e.g. the
  database is unreachable. It must not depend on any fetched data.
*/
export function RouteError() {
  return (
    <div className="mx-auto max-w-xl px-4 pt-40 pb-32">
      <h1 className="type-display text-headline">This page didn’t load</h1>
      <p className="mt-6 text-chalk/70">
        Check your connection and reload the page. If it keeps happening, try again in a few minutes.
      </p>
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
