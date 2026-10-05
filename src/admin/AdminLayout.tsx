import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, Inbox, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useEffect, useState, type ComponentType } from 'react'
import { Link, NavLink, Outlet, useLoaderData, useNavigate } from 'react-router'
import { cn } from '../lib/cn'
import { supabase } from '../lib/supabase'
import { statusCountsQuery } from './api/enquiries'
import type { AdminSession } from './guard'

type NavItem = { to: string; label: string; icon: ComponentType<{ className?: string }>; end?: boolean }

// Sections are added here as each admin screen is built.
const nav: { heading?: string; items: NavItem[] }[] = [
  { items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }] },
  { heading: 'Leads', items: [{ to: '/admin/enquiries', label: 'Enquiries', icon: Inbox }] },
]

export default function AdminLayout() {
  const { email } = useLoaderData() as AdminSession
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: counts } = useQuery(statusCountsQuery)

  // Session ended elsewhere (sign-out in another tab, expired refresh token).
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        queryClient.removeQueries({ queryKey: ['admin'] })
        navigate('/admin/login', { replace: true })
      }
    })
    return () => data.subscription.unsubscribe()
  }, [navigate, queryClient])

  const signOut = () => void supabase.auth.signOut()

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col gap-6 p-4">
      <Link to="/admin" className="type-display px-2 text-2xl">
        Admin
      </Link>
      {nav.map((group, index) => (
        <div key={group.heading ?? index}>
          {group.heading && <p className="mb-1 px-2 text-xs text-chalk/40">{group.heading}</p>}
          <ul className="space-y-0.5">
            {group.items.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex h-9 items-center gap-3 rounded px-2 text-sm transition-colors',
                      isActive ? 'bg-chalk/10 text-chalk' : 'text-chalk/70 hover:bg-chalk/5 hover:text-chalk',
                    )
                  }
                >
                  <Icon className="size-4" />
                  {label}
                  {to === '/admin/enquiries' && !!counts?.new && (
                    <span className="ml-auto rounded bg-accent px-1.5 text-xs font-semibold text-accent-ink">
                      {counts.new}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="mt-auto space-y-0.5 border-t border-chalk/10 pt-4">
        <p className="truncate px-2 pb-2 text-xs text-chalk/50" title={email}>
          {email}
        </p>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 items-center gap-3 rounded px-2 text-sm text-chalk/70 hover:bg-chalk/5 hover:text-chalk"
        >
          <ExternalLink className="size-4" />
          View website
        </a>
        <button
          type="button"
          onClick={signOut}
          className="flex h-9 w-full items-center gap-3 rounded px-2 text-sm text-chalk/70 hover:bg-chalk/5 hover:text-chalk"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </nav>
  )

  return (
    <div className="min-h-svh md:grid md:grid-cols-[15rem_1fr]">
      <aside className="sticky top-0 hidden h-svh border-r border-chalk/10 md:block">{sidebar}</aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-chalk/10 bg-graphite px-4 md:hidden">
        <Link to="/admin" className="type-display text-xl">
          Admin
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="admin-menu"
          className="-mr-2 flex size-10 items-center justify-center"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </header>
      {menuOpen && (
        <div id="admin-menu" className="fixed inset-x-0 top-14 bottom-0 z-20 bg-graphite md:hidden">
          {sidebar}
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <Outlet />
      </main>
    </div>
  )
}
