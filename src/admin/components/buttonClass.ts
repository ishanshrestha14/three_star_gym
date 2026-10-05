import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'selected' | 'danger' | 'ghost'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-accent/85',
  secondary: 'border border-chalk/25 text-chalk hover:border-chalk/60 hover:bg-chalk/5',
  // The current choice in a set of options (not a call to action)
  selected: 'border border-chalk bg-chalk text-graphite',
  danger: 'border border-red-400/40 text-red-300 hover:bg-red-500/10',
  ghost: 'text-chalk/70 hover:bg-chalk/5 hover:text-chalk',
}

export const buttonClass = (variant: ButtonVariant = 'secondary', className?: string) =>
  cn(
    'inline-flex h-10 items-center justify-center gap-2 rounded px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    buttonVariants[variant],
    className,
  )
