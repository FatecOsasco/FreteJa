import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { register as apiRegister } from '../api/auth'

const PERFIS = ['DEMANDANTE', 'TRANSPORTADORA']

export default function LoginPage() {
  const { login, loading, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    perfis: ['DEMANDANTE'],
  })
  const [localError, setLocalError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const from = location.state?.from?.pathname || '/'

  if (isAuthenticated) {
    navigate(from, { replace: true })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePerfilToggle = (perfil) => {
    setForm((prev) => {
      const perfis = new Set(prev.perfis)
      if (perfis.has(perfil)) {
        perfis.delete(perfil)
      } else {
        perfis.add(perfil)
      }
      if (perfis.size === 0) {
        perfis.add('DEMANDANTE')
      }
      return { ...prev, perfis: Array.from(perfis) }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)
    setSuccessMessage(null)
    try {
      if (isRegisterMode) {
        await apiRegister({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          perfis: form.perfis,
        })
        setSuccessMessage('Cadastro realizado com sucesso! Agora faça login para acessar o painel.')
        setIsRegisterMode(false)
        return
      }

      await login(form.email, form.senha)
      navigate(from, { replace: true })
    } catch (err) {
      setLocalError(err?.response?.data?.message || 'Ocorreu um erro. Tente novamente.')
    }
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: 880,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
          gap: '1.5rem',
        }}
      >
        <section>
          <div className="pill" style={{ marginBottom: '0.9rem' }}>
            <span style={{ background: '#22c55e', width: 6, height: 6, borderRadius: '999px' }} />
            <span>Aplicação web para cotação de fretes</span>
          </div>
          <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.7rem' }}>
            {isRegisterMode ? 'Crie sua conta no Frete Já' : 'Entre para gerenciar suas cotações'}
          </h1>
          <p style={{ margin: '0 0 1.4rem', color: '#6B7280', fontSize: '0.95rem' }}>
            {isRegisterMode
              ? 'Cadastre-se como demandante ou transportadora para começar a registrar cotações de frete e enviar propostas.'
              : 'Acompanhe pedidos de frete, propostas de transportadoras e aprovações em um único painel visual.'}
          </p>

          <ul
            style={{
              paddingLeft: '1.1rem',
              margin: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: '#4B5563',
            }}
          >
            <li>Cadastro de cotações com origem, destino, peso e dimensões</li>
            <li>Envio de propostas com valor, prazo e observações</li>
          </ul>
        </section>

        <section
          style={{
            borderRadius: 18,
            padding: '1.1rem',
            background:
              'linear-gradient(135deg, rgba(52,64,178,0.08), rgba(92,229,216,0.08)), rgba(255,255,255,0.9)',
            border: '1px solid rgba(209,213,219,0.8)',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {isRegisterMode && (
              <div>
                <label htmlFor="nome" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563' }}>
                  Nome completo
                </label>
                <input
                  id="nome"
                  name="nome"
                  className="input-field"
                  value={form.nome}
                  onChange={handleChange}
                  required={isRegisterMode}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563' }}>
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-field"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="senha" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563' }}>
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                className="input-field"
                value={form.senha}
                onChange={handleChange}
                required
                minLength={4}
              />
            </div>

            {isRegisterMode && (
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563', marginBottom: 4 }}>
                  Perfil(s) de acesso
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {PERFIS.map((perfil) => {
                    const selected = form.perfis.includes(perfil)
                    return (
                      <button
                        key={perfil}
                        type="button"
                        onClick={() => handlePerfilToggle(perfil)}
                        style={{
                          borderRadius: 999,
                          padding: '0.25rem 0.7rem',
                          fontSize: '0.78rem',
                          border: '1px solid',
                          borderColor: selected ? '#3440B2' : 'rgba(209,213,219,0.9)',
                          background: selected ? 'rgba(52,64,178,0.08)' : 'rgba(255,255,255,0.8)',
                          cursor: 'pointer',
                        }}
                      >
                        {perfil}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {(error || localError) && (
              <div
                style={{
                  fontSize: '0.78rem',
                  color: '#b91c1c',
                  background: 'rgba(248, 113, 113, 0.08)',
                  borderRadius: 10,
                  padding: '0.45rem 0.6rem',
                }}
              >
                {localError || error}
              </div>
            )}

            {successMessage && (
              <div
                style={{
                  fontSize: '0.78rem',
                  color: '#15803d',
                  background: 'rgba(34, 197, 94, 0.08)',
                  borderRadius: 10,
                  padding: '0.45rem 0.6rem',
                }}
              >
                {successMessage}
              </div>
            )}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Processando...' : isRegisterMode ? 'Cadastrar conta' : 'Entrar no painel'}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setIsRegisterMode((prev) => !prev)
                setLocalError(null)
                setSuccessMessage(null)
              }}
            >
              {isRegisterMode ? 'Já tenho conta, voltar para login' : 'Quero criar uma conta agora'}
            </button>

          </form>
        </section>
      </div>
    </div>
  )
}
