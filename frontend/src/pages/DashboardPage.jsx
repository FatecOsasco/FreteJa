import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { listarMinhasCotacoes } from '../api/cotacoes'
import CotacaoForm from './partials/CotacaoForm'
import PropostaForm from './partials/PropostaForm'
import PropostasList from './partials/PropostasList'
import { aprovarProposta, listarPropostas, reprovarCotacao } from '../api/cotacoes'

function resumoCotacoes(cotacoes) {
  const total = cotacoes.length
  const porStatus = cotacoes.reduce(
    (acc, c) => {
      acc[c.status || 'ABERTA'] = (acc[c.status || 'ABERTA'] || 0) + 1
      return acc
    },
    {},
  )
  return { total, porStatus }
}

export default function DashboardPage() {
  const location = useLocation()
  const [cotacoes, setCotacoes] = useState([])
  const [selectedCotacao, setSelectedCotacao] = useState(null)
  const [propostas, setPropostas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const section = location.state?.section || 'dashboard'

  const carregarCotacoes = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listarMinhasCotacoes()
      setCotacoes(data)
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar suas cotações. Verifique se a API está em execução.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarCotacoes()
  }, [])

  const handleSelectCotacao = async (cotacao) => {
    setSelectedCotacao(cotacao)
    setLoading(true)
    setError(null)
    try {
      const lista = await listarPropostas(cotacao.id)
      setPropostas(lista)
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar as propostas desta cotação.')
    } finally {
      setLoading(false)
    }
  }

  const handleAprovar = async (propostaId) => {
    if (!selectedCotacao) return
    setLoading(true)
    setError(null)
    try {
      await aprovarProposta(selectedCotacao.id, propostaId)
      await carregarCotacoes()
      await handleSelectCotacao(selectedCotacao)
    } catch (err) {
      console.error(err)
      setError('Não foi possível aprovar esta proposta.')
    } finally {
      setLoading(false)
    }
  }

  const handleReprovar = async () => {
    if (!selectedCotacao) return
    setLoading(true)
    setError(null)
    try {
      await reprovarCotacao(selectedCotacao.id)
      await carregarCotacoes()
      setSelectedCotacao(null)
      setPropostas([])
    } catch (err) {
      console.error(err)
      setError('Não foi possível reprovar esta cotação.')
    } finally {
      setLoading(false)
    }
  }

  const resumo = useMemo(() => resumoCotacoes(cotacoes), [cotacoes])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#9CA3AF',
                marginBottom: 4,
              }}
            >
              Painel de cotações
            </div>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Resumo das suas cotações de frete</h2>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.9rem', color: '#6B7280' }}>
              Visualize rapidamente o volume de pedidos, o status das cotações e os detalhes de propostas enviadas
              pelas transportadoras.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.5rem',
              minWidth: 260,
            }}
          >
            <ResumoKpi label="Total de cotações" value={resumo.total} accent="primary" />
            <ResumoKpi label="Abertas" value={resumo.porStatus.ABERTA || 0} accent="blue" />
            <ResumoKpi label="Aprovadas" value={resumo.porStatus.APROVADA || 0} accent="green" />
            <ResumoKpi label="Reprovadas" value={resumo.porStatus.REPROVADA || 0} accent="red" />
          </div>
        </div>
        {error && (
          <div
            style={{
              marginTop: '0.5rem',
              fontSize: '0.8rem',
              color: '#b91c1c',
              background: 'rgba(248,113,113,0.08)',
              borderRadius: 10,
              padding: '0.45rem 0.6rem',
            }}
          >
            {error}
          </div>
        )}
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '1rem' }}>
        <div className="card" style={{ maxHeight: 420, overflow: 'auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.4rem',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Minhas cotações</h3>
            <button
              type="button"
              className="btn-secondary"
              onClick={carregarCotacoes}
              disabled={loading}
              style={{ fontSize: '0.8rem', paddingInline: '0.8rem' }}
            >
              Atualizar lista
            </button>
          </div>
          {loading && cotacoes.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Carregando cotações...</p>
          ) : cotacoes.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>
              Nenhuma cotação encontrada ainda. Utilize o formulário ao lado para cadastrar seu primeiro pedido de
              frete.
            </p>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.82rem',
                marginTop: '0.5rem',
              }}
            >
              <thead>
                <tr style={{ textAlign: 'left', color: '#6B7280' }}>
                  <th style={{ padding: '0.35rem 0.3rem' }}>Origem</th>
                  <th style={{ padding: '0.35rem 0.3rem' }}>Destino</th>
                  <th style={{ padding: '0.35rem 0.3rem' }}>Peso (kg)</th>
                  <th style={{ padding: '0.35rem 0.3rem' }}>Status</th>
                  <th style={{ padding: '0.35rem 0.3rem' }} />
                </tr>
              </thead>
              <tbody>
                {cotacoes.map((c) => (
                  <tr
                    key={c.id}
                    style={{
                      borderTop: '1px solid rgba(229,231,235,0.9)',
                      cursor: 'pointer',
                      background:
                        selectedCotacao?.id === c.id ? 'rgba(92,229,216,0.06)' : 'transparent',
                    }}
                    onClick={() => handleSelectCotacao(c)}
                  >
                    <td style={{ padding: '0.35rem 0.3rem' }}>{c.origemCep}</td>
                    <td style={{ padding: '0.35rem 0.3rem' }}>{c.destinoCep}</td>
                    <td style={{ padding: '0.35rem 0.3rem' }}>{c.pesoKg}</td>
                    <td style={{ padding: '0.35rem 0.3rem' }}>
                      <span className={`status-badge status-${c.status || 'ABERTA'}`}>{c.status || 'ABERTA'}</span>
                    </td>
                    <td style={{ padding: '0.35rem 0.3rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        onClick={() => handleSelectCotacao(c)}
                        className="btn-secondary"
                        style={{ fontSize: '0.75rem', paddingInline: '0.6rem' }}
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <CotacaoForm onCreated={carregarCotacoes} />
          <PropostaForm />
        </div>
      </section>

      {selectedCotacao && (
        <section className="card" style={{ marginTop: '0.3rem' }}>
          <PropostasList
            cotacao={selectedCotacao}
            propostas={propostas}
            onAprovar={handleAprovar}
            onReprovarCotacao={handleReprovar}
            loading={loading}
          />
        </section>
      )}
    </div>
  )
}

function ResumoKpi({ label, value, accent }) {
  const accentColor =
    accent === 'green'
      ? '#16a34a'
      : accent === 'red'
      ? '#dc2626'
      : accent === 'blue'
      ? '#2563eb'
      : '#EA7500'

  const bgColor =
    accent === 'green'
      ? 'rgba(34,197,94,0.07)'
      : accent === 'red'
      ? 'rgba(248,113,113,0.08)'
      : accent === 'blue'
      ? 'rgba(59,130,246,0.06)'
      : 'rgba(234,117,0,0.08)'

  return (
    <div
      style={{
        borderRadius: 14,
        padding: '0.6rem 0.7rem',
        background: bgColor,
      }}
    >
      <div style={{ fontSize: '0.72rem', color: '#6B7280', marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: accentColor }}>{value}</div>
    </div>
  )
}
