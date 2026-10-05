import { useCallback, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { primaryNav, site } from '../../content/site'
import { useScrolled } from '../../hooks/useScrolled'
import { cn } from '../../lib/cn'
import { Container } from '../ui/Container'
import { CtaLink } from '../ui/CtaLink'
import { MobileMenu } from './MobileMenu'

export function Navbar() {
  const scrolled = useScrolled(24)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const solid = scrolled && !menuOpen

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300',
          solid ? 'border-chalk/10 bg-graphite/80 backdrop-blur-md' : 'border-transparent',
        )}
      >
        <Container className="flex h-16 items-center justify-between md:h-20">
          <Link to="/" onClick={closeMenu} className="type-display text-2xl leading-none md:text-3xl">
            {site.shortName}
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {primaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-chalk',
                    isActive ? 'text-chalk' : 'text-chalk/70',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <CtaLink to="/free-trial" className="h-11">
                Join now
              </CtaLink>
            </div>
            <button
              type="button"
              className="-mr-2 inline-flex h-11 items-center px-2 text-sm font-semibold md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </Container>
      </header>

      {menuOpen && <MobileMenu onClose={closeMenu} />}
    </>
  )
}
