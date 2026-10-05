import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { Field, TextInput } from '../../components/forms/Field'
import { supabase } from '../../lib/supabase'
import { Button } from '../components/ui'

const schema = z
  .object({
    password: z.string().min(8, 'Use at least 8 characters'),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords don’t match' })
type Input = z.infer<typeof schema>

/* Landing page for the emailed reset link. Supabase signs the user in from the URL. */
export default function ResetPassword() {
  const navigate = useNavigate()
  const [linkState, setLinkState] = useState<'checking' | 'ready' | 'invalid'>('checking')
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Input>({ resolver: zodResolver(schema), defaultValues: { password: '', confirm: '' } })

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setLinkState('ready')
    })
    // Give the client a moment to read the token from the URL before giving up.
    const timeout = window.setTimeout(() => setLinkState((s) => (s === 'checking' ? 'invalid' : s)), 3000)
    return () => {
      data.subscription.unsubscribe()
      window.clearTimeout(timeout)
    }
  }, [])

  const onSubmit = handleSubmit(async ({ password }) => {
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('The password didn’t save. Request a new reset link and try again.')
      return
    }
    navigate('/admin', { replace: true })
  })

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="type-display text-headline">Set a new password</h1>

        {linkState === 'checking' && <p className="mt-6 text-chalk/60">Checking your reset link…</p>}

        {linkState === 'invalid' && (
          <div className="mt-6">
            <p className="text-chalk/80">This reset link has expired or was already used.</p>
            <Link to="/admin/login" className="mt-4 inline-block text-sm underline underline-offset-4">
              Request a new link
            </Link>
          </div>
        )}

        {linkState === 'ready' && (
          <form onSubmit={(e) => void onSubmit(e)} noValidate className="mt-10 space-y-6">
            <Field label="New password" error={errors.password?.message}>
              {(a11y) => <TextInput {...a11y} {...register('password')} type="password" autoComplete="new-password" />}
            </Field>
            <Field label="Repeat new password" error={errors.confirm?.message}>
              {(a11y) => <TextInput {...a11y} {...register('confirm')} type="password" autoComplete="new-password" />}
            </Field>
            {error && (
              <p role="alert" className="text-accent">
                {error}
              </p>
            )}
            <Button type="submit" variant="primary" disabled={isSubmitting} className="h-12 w-full">
              {isSubmitting ? 'Saving…' : 'Save password'}
            </Button>
          </form>
        )}
      </div>
    </main>
  )
}
