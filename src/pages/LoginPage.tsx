import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

type LoginPageProps = {
  onLogin: (email: string, password: string) => Promise<void>
  loading: boolean
  error: string | null
}

function LoginPage({ onLogin, loading, error }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim() || !password.trim()) {
      return
    }
    await onLogin(email.trim(), password)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-3xl font-bold text-slate-800">TaskFlow</h1>
        <p className="mb-6 text-sm text-slate-500">Sign in to manage your tasks</p>

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
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-md transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
        </form>
        <p className="mt-6 text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Register
          </Link>
        </p>
      </div>
    </main>
  )
}

export default LoginPage
