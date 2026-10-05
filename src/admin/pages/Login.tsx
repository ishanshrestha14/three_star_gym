import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'
import { z } from 'zod'
import { supabase } from '../../lib/supabase'
import { Field, TextInput } from '../../components/forms/Field'
import { Button } from '../components/ui'
import { safeNext } from '../guard'

const loginSchema = z.object({
  email: z.email('Enter the email address for your admin account'),
  password: z.string().min(1, 'Enter your password'),
})
type LoginInput = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState<'login' | 'reset'>('login')
  const [formMessage, setMessage] = useState<{ tone: 'error' | 'info'; text: string } | null>(null)
  // Read from the URL on every render: the guard redirects here without remounting this page.
  const message =
    formMessage ?? (params.get('denied') ? { tone: 'error' as const, text: 'That account doesn’t have admin access.' } : null)

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })

  const onLogin = handleSubmit(async ({ email, password }) => {
    setMessage(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage({ tone: 'error', text: 'Email or password is incorrect.' })
      return
    }
    navigate(safeNext(params.get('next')), { replace: true })
  })

  const sendReset = async () => {
    if (!(await trigger('email'))) return
    setMessage(null)
    const { error } = await supabase.auth.resetPasswordForEmail(getValues('email'), {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    })
    setMessage(
      error
        ? { tone: 'error', text: 'The reset email didn’t send. Wait a minute and try again.' }
        : { tone: 'info', text: 'If that email has an admin account, a reset link is on its way.' },
    )
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (mode === 'login') return void onLogin(event)
    event.preventDefault()
    void sendReset()
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="type-display text-headline">{mode === 'login' ? 'Admin sign in' : 'Reset password'}</h1>
        <p className="mt-2 text-chalk/60">
          {mode === 'login' ? 'Manage enquiries and website content.' : 'We’ll email you a link to set a new password.'}
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-10 space-y-6">
          <Field label="Email" error={errors.email?.message}>
            {(a11y) => <TextInput {...a11y} {...register('email')} type="email" autoComplete="email" />}
          </Field>
          {mode === 'login' && (
            <Field label="Password" error={errors.password?.message}>
              {(a11y) => <TextInput {...a11y} {...register('password')} type="password" autoComplete="current-password" />}
            </Field>
          )}

          {message && (
            <p role={message.tone === 'error' ? 'alert' : 'status'} className={message.tone === 'error' ? 'text-accent' : 'text-chalk/80'}>
              {message.text}
            </p>
          )}

          <Button type="submit" variant="primary" disabled={isSubmitting} className="h-12 w-full">
            {mode === 'login' ? (isSubmitting ? 'Signing in…' : 'Sign in') : 'Send reset link'}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'reset' : 'login')
            setMessage(null)
          }}
          className="mt-6 text-sm text-chalk/60 underline underline-offset-4 hover:text-chalk"
        >
          {mode === 'login' ? 'Forgot your password?' : 'Back to sign in'}
        </button>
      </div>
    </main>
  )
}
