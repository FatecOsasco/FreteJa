import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

const navItems = [
  { key: 'dashboard', label: 'Painel de cotações', description: 'Resumo das suas cotações e propostas' },
  { key: 'nova', label: 'Nova cotação', description: 'Cadastrar um novo pedido de frete' },
  { key: 'proposta', label: 'Enviar proposta', description: 'Transportadora: enviar proposta para um pedido' },
]

export default function Sidebar() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleClick = (key) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate('/', { state: { section: key } })
  }

  if (!isAuthenticated) {
    return (
      <div className="card">
        <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem' }}>Bem-vindo ao Frete Já</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280' }}>
          Faça login para visualizar o painel de cotações, cadastrar pedidos e enviar propostas.
        </p>
      </div>
    )
  }

  const activeSection = location.state?.section || 'dashboard'

  return (
    <nav className="card" aria-label="Navegação principal">
      <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>
          Painel
        </span>
        <span style={{ fontSize: '0.75rem', color: '#93C5FD' }}>v0.1</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {navItems.map((item) => {
          const isActive = activeSection === item.key
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleClick(item.key)}
              style={{
                textAlign: 'left',
                borderRadius: 14,
                padding: '0.55rem 0.7rem',
                border: '1px solid',
                borderColor: isActive ? 'rgba(52,64,178,0.6)' : 'rgba(209,213,219,0.8)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(52,64,178,0.04), rgba(92,229,216,0.12))'
                  : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: isActive ? '#111827' : '#374151',
                }}
              >
                {item.label}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{item.description}</span>
            </button>
          )
        })}
      </div>
      <div
        style={{
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px dashed rgba(209,213,219,0.9)',
          fontSize: '0.75rem',
          color: '#9CA3AF',
        }}
      >
        <div style={{ marginBottom: '0.3rem', fontWeight: 600 }}>Dica rápida</div>
        <div>
          Use o perfil <strong>DEMANDANTE</strong> para registrar pedidos e o perfil{' '}
          <strong>TRANSPORTADORA</strong> para enviar propostas.
        </div>
      </div>
    </nav>
  )
}
