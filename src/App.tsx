import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import {
  ApiError,
  clearStoredToken,
  getCurrentUser,
  getStoredToken,
  loginUser,
  storeToken,
} from './services/api'

function App() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    const bootstrapSession = async () => {
      const storedToken = getStoredToken()
      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        await getCurrentUser(storedToken)
        setToken(storedToken)
      } catch (err) {
        clearStoredToken()
        if (!(err instanceof ApiError && err.status === 401)) {
          setLoginError('Session invalide. Merci de vous reconnecter.')
        }
      } finally {
        setLoading(false)
      }
    }

    void bootstrapSession()
  }, [])

  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true)
    setLoginError(null)
    try {
      const accessToken = await loginUser(email, password)
      storeToken(accessToken)
      setToken(accessToken)
    } catch (err) {
      if (err instanceof ApiError) {
        setLoginError(err.message || 'Identifiants invalides.')
      } else {
        setLoginError('Impossible de se connecter au serveur.')
      }
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    clearStoredToken()
    setToken(null)
    setLoginError(null)
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
        <p className="text-sm text-slate-500">Loading session...</p>
      </main>
    )
  }

  if (token) {
    return <Dashboard token={token} onLogout={handleLogout} />
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} loading={loginLoading} error={loginError} />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
