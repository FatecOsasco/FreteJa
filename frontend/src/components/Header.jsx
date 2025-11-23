import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App'
import logo from '../assets/logo-freteja.svg'

export default function Header() {
  const { isAuthenticated, userEmail, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isLoginPage = location.pathname === '/login'

  return (
    <header
      style={{
        padding: '0.8rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(148, 163, 184, 0.35)',
        backdropFilter: 'blur(12px)',
        background: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(244, 244, 255, 0.96))',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #EA7500, #EAA957 40%, #3440B2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(15,23,42,0.35)',
          }}
        >
          <img src={logo} alt="Frete Já" style={{ width: 28, height: 28 }} />
        </div>
        <div>
          <div style={{ fontWeight: 800, letterSpacing: '0.06em', fontSize: '0.78rem', textTransform: 'uppercase' }}>
            FRETE <span style={{ color: '#3440B2' }}>JÁ</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Plataforma de cotação de fretes</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {!isLoginPage && (
          <div className="pill">
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '999px',
                background: '#22c55e',
              }}
            />
            <span style={{ fontWeight: 500 }}>Ambiente demo</span>
          </div>
        )}
        {isAuthenticated && (
          <>
            <div
              style={{
                fontSize: '0.8rem',
                color: '#4b5563',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <span style={{ fontWeight: 600 }}>{userEmail}</span>
              <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Usuário autenticado</span>
            </div>
            <button className="btn-secondary" type="button" onClick={handleLogout}>
              Sair
            </button>
          </>
        )}
      </div>
    </header>
  )
}
