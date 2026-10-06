import { Check } from 'lucide-react'
import { useRef } from 'react'
import { fadeUp, revealLines } from '../../animations/reveal'
import { useMotion } from '../../animations/useMotion'
import { cn } from '../../lib/cn'
import { formatNpr } from '../../lib/format'
import type { MembershipPlan } from '../../types/content'
import { Container } from '../ui/Container'
import { CtaLink } from '../ui/CtaLink'
import { MaskedLines } from '../ui/MaskedLines'

type MembershipPlansProps = {
  plans: MembershipPlan[]
  /** Hide the section heading when the page already has one */
  showHeader?: boolean
}

export function MembershipPlans({ plans, showHeader = true }: MembershipPlansProps) {
  const ref = useRef<HTMLElement>(null)

  useMotion(() => {
    revealLines('[data-line]', { trigger: ref.current })
    fadeUp('[data-plan]', { trigger: '[data-plans]' })
  }, ref)

  if (plans.length === 0) return null

  return (
    <section ref={ref} id="membership" className="py-24 md:py-32">
      <Container>
        {showHeader && (
          <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end">
            <MaskedLines text="Membership" className="type-display text-display md:col-span-7" />
            <p className="max-w-sm text-chalk/70 md:col-span-4 md:col-start-9 md:pb-2">
              Every plan includes full gym access. Prices are in Nepali rupees and paid at the front desk.
            </p>
          </div>
        )}

        <ul data-plans className="grid border-t border-chalk/15 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan, index) => (
            <li
              key={plan.id}
              data-plan
              className={cn(
                'relative flex flex-col border-b border-chalk/15 py-10 md:px-8 xl:border-b-0',
                index % 2 === 1 && 'md:border-l md:border-chalk/15',
                index > 0 && 'xl:border-l xl:border-chalk/15',
                plan.isPopular ? 'bg-iron px-5' : 'px-1',
              )}
            >
              {plan.isPopular && <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-accent" />}
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {plan.isPopular && <p className="text-sm font-semibold text-accent">Most popular</p>}
              </div>
              <p className="mt-6 type-display text-headline">{formatNpr(plan.priceNpr)}</p>
              {/* Two lines reserved so features line up across plans */}
              <p className="mt-2 min-h-10 text-sm text-chalk/60">
                for {plan.durationLabel}
                {plan.durationMonths && plan.durationMonths > 1 && (
                  <>
                    <br />
                    about {formatNpr(Math.round(plan.priceNpr / plan.durationMonths))} a month
                  </>
                )}
              </p>

              <ul className="mt-8 mb-10 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-chalk/80">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <CtaLink
                to={`/free-trial?plan=${plan.id}`}
                variant={plan.isPopular ? 'primary' : 'outline'}
                className="mt-auto w-full"
              >
                Choose {plan.name.toLowerCase()}
              </CtaLink>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
