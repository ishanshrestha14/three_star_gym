import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSiteSettings } from '../../api/settings'
import { EnquiryError, submitEnquiry, type EnquirySource } from '../../api/enquiries'
import { whatsappHref } from '../../lib/contact'
import { enquirySchema, type EnquiryInput } from '../../schemas/enquiry'
import { Field, TextArea, TextInput } from './Field'

type EnquiryFormProps = {
  source: EnquirySource
  subject?: string
  membershipPlanId?: string
  submitLabel: string
  messageLabel?: string
  successTitle: string
}

export function EnquiryForm({
  source,
  subject,
  membershipPlanId,
  submitLabel,
  messageLabel = 'Anything we should know? (optional)',
  successTitle,
}: EnquiryFormProps) {
  const site = useSiteSettings()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: '', phone: '', email: '', message: '', website: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      await submitEnquiry(values, { source, subject, membershipPlanId })
    } catch (error) {
      setSubmitError(error instanceof EnquiryError ? error.message : 'Something went wrong. Please try again.')
      throw error // keeps isSubmitSuccessful false
    }
  })

  if (isSubmitSuccessful) {
    return (
      <div role="status" className="border-t border-accent pt-8">
        <h2 className="type-display text-headline">{successTitle}</h2>
        <p className="mt-4 max-w-md text-lg text-chalk/80">
          We’ll call you within one working day. Want an answer sooner? Message us on WhatsApp.
        </p>
        <a
          href={whatsappHref(site)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-sm font-semibold underline decoration-chalk/30 underline-offset-4 hover:decoration-accent"
        >
          Message us on WhatsApp
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={(event) => void onSubmit(event).catch(() => {})} noValidate className="space-y-8">
      <Field label="Your name" error={errors.name?.message}>
        {(a11y) => <TextInput {...a11y} {...register('name')} autoComplete="name" />}
      </Field>
      <Field label="Phone number" hint="We’ll call or WhatsApp you on this number." error={errors.phone?.message}>
        {(a11y) => <TextInput {...a11y} {...register('phone')} type="tel" inputMode="tel" autoComplete="tel" />}
      </Field>
      <Field label="Email (optional)" error={errors.email?.message}>
        {(a11y) => <TextInput {...a11y} {...register('email')} type="email" inputMode="email" autoComplete="email" />}
      </Field>
      <Field label={messageLabel} error={errors.message?.message}>
        {(a11y) => <TextArea {...a11y} {...register('message')} rows={3} />}
      </Field>

      {/* Honeypot: off-screen and skipped by keyboard and autofill; bots fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input {...register('website')} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {submitError && (
        <p role="alert" className="border-l-2 border-accent pl-4 text-chalk/90">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-14 w-full items-center justify-center bg-accent px-8 text-base font-semibold text-accent-ink transition-colors hover:bg-chalk hover:text-graphite disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {isSubmitting ? 'Sending…' : submitLabel}
      </button>
    </form>
  )
}
