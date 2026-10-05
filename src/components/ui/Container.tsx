import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn'

/** Page-width wrapper with the site's side gutters. */
export function Container({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10', className)} {...props} />
}
