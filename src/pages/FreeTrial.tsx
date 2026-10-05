import { useSuspenseQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { useSearchParams } from 'react-router'
import { revealLines } from '../animations/reveal'
import { useMotion } from '../animations/useMotion'
import { plansQuery } from '../api/plans'
import { EnquiryForm } from '../components/forms/EnquiryForm'
import { Seo } from '../components/seo/Seo'
import { Container } from '../components/ui/Container'
import { MaskedLines } from '../components/ui/MaskedLines'
import { formatNpr } from '../lib/format'

const steps = [
  { title: 'Send your details', body: 'Takes under a minute. No payment, no commitment.' },
  { title: 'We call you back', body: 'A coach calls within one working day to pick a time that suits you.' },
  { title: 'Train a full session', body: 'Come in, train with a coach and see if we’re the right fit.' },
]

export default function FreeTrial() {
  const ref = useRef<HTMLDivElement>(null)
  const [params] = useSearchParams()
  const { data: plans } = useSuspenseQuery(plansQuery)
  const plan = plans.find((p) => p.id === params.get('plan'))

  useMotion(() => {
    revealLines('[data-line]')
  }, ref)

  return (
    <>
      <Seo title="Book a free trial" description="Book a free trial session with a coach. No payment, no commitment." />
      <Container className="grid gap-16 pt-32 pb-24 md:pt-40 lg:grid-cols-12 lg:gap-8">
        <div ref={ref} className="lg:col-span-5">
          <MaskedLines as="h1" text={'Book your\nfree trial.'} className="type-display text-display" />

          {plan && (
            <p className="mt-8 border-l-2 border-accent pl-4 text-chalk/85">
              You’re asking about the <strong className="font-semibold text-chalk">{plan.name}</strong> plan,{' '}
              {formatNpr(plan.priceNpr)} for {plan.durationLabel}. We’ll go through it when we call.
            </p>
          )}

          <ol className="mt-12 space-y-8">
            {steps.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-x-2">
                <span className="type-display text-2xl text-accent">{index + 1}</span>
                <div>
                  <h2 className="text-lg font-semibold">{step.title}</h2>
                  <p className="mt-1 text-chalk/70">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
          <EnquiryForm
            source={plan ? 'membership' : 'free_trial'}
            subject={plan ? `Free trial – interested in ${plan.name}` : 'Free trial'}
            membershipPlanId={plan?.id}
            submitLabel="Book my free trial"
            successTitle="Request sent."
          />
        </div>
      </Container>
    </>
  )
}
