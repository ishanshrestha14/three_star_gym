import { Outlet, ScrollRestoration } from 'react-router'
import { Footer } from './Footer'
import { MobileActionBar } from './MobileActionBar'
import { Navbar } from './Navbar'

export function PublicLayout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
      <ScrollRestoration />
    </>
  )
}
