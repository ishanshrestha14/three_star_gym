import '@fontsource-variable/archivo/wdth.css'
import './styles/globals.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createPath } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { router } from './app/router'
import { initAnalytics } from './lib/analytics'
import { queryClient } from './lib/queryClient'

/*
  After a deploy, a tab that was already open can ask for page chunks that no
  longer exist. Reload once to pick up the new build. The timestamp stops a
  reload loop if a chunk keeps failing for another reason (e.g. offline);
  the route's error page shows instead.
*/
window.addEventListener('vite:preloadError', (event) => {
  try {
    const last = Number(sessionStorage.getItem('chunk-reload-at'))
    if (Date.now() - last < 10_000) return
    sessionStorage.setItem('chunk-reload-at', String(Date.now()))
  } catch {
    return
  }
  event.preventDefault()
  // Mid-navigation the URL hasn't changed yet, so go to the page being opened.
  const next = router.state.navigation.location
  window.location.assign(next ? createPath(next) : window.location.href)
})

initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
