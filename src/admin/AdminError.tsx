/* Shown when an admin route fails to load (network down, deploy mid-session). Kept tiny and eager. */
export function AdminError() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="max-w-sm">
        <h1 className="text-2xl font-semibold">The admin didn’t load</h1>
        <p className="mt-2 text-chalk/60">Check your connection and reload. If you were signed out, sign in again.</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="h-10 rounded bg-accent px-4 text-sm font-medium text-accent-ink"
          >
            Reload
          </button>
          <a href="/admin/login" className="flex h-10 items-center rounded border border-chalk/25 px-4 text-sm">
            Sign in
          </a>
        </div>
      </div>
    </main>
  )
}
