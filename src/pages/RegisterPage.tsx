import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedEmail = email.trim()
    const normalizedPassword = password.trim()

    if (!normalizedEmail || !normalizedPassword) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: normalizedPassword,
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Unable to register. Please try again.'

        try {
          const payload = (await response.json()) as { detail?: string }
          if (typeof payload.detail === 'string' && payload.detail.trim()) {
            errorMessage = payload.detail
          }
        } catch {
          // Keep fallback error message when response is not JSON.
        }

        throw new Error(errorMessage)
      }

      setSuccessMessage('Account created successfully. Redirecting to login...')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-3xl font-bold text-slate-800">Create Account</h1>
        <p className="mb-6 text-sm text-slate-500">Register to start managing your tasks</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-md transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}

export default RegisterPage
