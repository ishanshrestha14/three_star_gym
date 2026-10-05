import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'outline'

type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-[2px] font-semibold tracking-wide transition-colors duration-200'

const sizes: Record<Size, string> = {
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-chalk hover:text-graphite',
  outline: 'border border-chalk/40 text-chalk hover:border-chalk hover:bg-chalk hover:text-graphite',
}

type CtaLinkProps = {
  to: string
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  onClick?: () => void
}

/** Button-styled link. External URLs (tel:, wa.me, https:) render a plain anchor. */
export function CtaLink({ to, children, variant = 'primary', size = 'md', className, onClick }: CtaLinkProps) {
  const classes = cn(base, sizes[size], variants[variant], className)

  if (/^(https?:|tel:|mailto:)/.test(to)) {
    const external = to.startsWith('http')
    return (
      <a
        href={to}
        className={classes}
        onClick={onClick}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {children}
      </a>
    )
  }

  return (
    <Link to={to} className={classes} onClick={onClick}>
      {children}
    </Link>
  )
}
