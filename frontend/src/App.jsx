import React, { createContext, useContext, useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { login as apiLogin } from './api/auth'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('freteja_token'))
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('freteja_email'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (email, senha) => {
    setLoading(true)
    setError(null)
    try {
      const { token: newToken } = await apiLogin(email, senha)
      setToken(newToken)
      setUserEmail(email)
      localStorage.setItem('freteja_token', newToken)
      localStorage.setItem('freteja_email', email)
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Falha ao autenticar. Verifique suas credenciais.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setToken(null)
    setUserEmail(null)
    localStorage.removeItem('freteja_token')
    localStorage.removeItem('freteja_email')
  }

  const value = {
    token,
    userEmail,
    isAuthenticated: Boolean(token),
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function ProtectedRoute({ children }) {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}
