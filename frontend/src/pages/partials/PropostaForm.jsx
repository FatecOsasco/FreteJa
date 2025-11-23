import React, { useState } from 'react'
import { criarProposta } from '../../api/cotacoes'

const initialState = {
  cotacaoId: '',
  valor: '',
  prazoEntregaDias: '',
  observacao: '',
}

export default function PropostaForm() {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const { cotacaoId, valor, prazoEntregaDias, observacao } = form
      await criarProposta(cotacaoId, {
        valor: valor ? Number(valor) : null,
        prazoEntregaDias: prazoEntregaDias ? Number(prazoEntregaDias) : null,
        observacao,
      })
      setSuccess('Proposta enviada com sucesso! Ela ficará disponível para o demandante aprovar ou reprovar.')
      setForm(initialState)
    } catch (err) {
      console.error(err)
      setError('Não foi possível enviar a proposta. Verifique o ID da cotação e se a API está em execução.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem' }}>Enviar proposta</h3>
      <p style={{ margin: '0 0 0.7rem', fontSize: '0.82rem', color: '#6B7280' }}>
        Transportadora: informe o ID da cotação, o valor proposto, o prazo e observações opcionais.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem' }}>
        <div>
          <label htmlFor="cotacaoId" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563' }}>
            ID da cotação
          </label>
          <input
            id="cotacaoId"
            name="cotacaoId"
            className="input-field"
            value={form.cotacaoId}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.5rem' }}>
          <div>
            <label htmlFor="valor" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563' }}>
              Valor (R$)
            </label>
            <input
              id="valor"
              name="valor"
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              value={form.valor}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="prazoEntregaDias" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563' }}>
              Prazo (dias)
            </label>
            <input
              id="prazoEntregaDias"
              name="prazoEntregaDias"
              type="number"
              min="0"
              className="input-field"
              value={form.prazoEntregaDias}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="observacao" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563' }}>
            Observações
          </label>
          <textarea
            id="observacao"
            name="observacao"
            rows={3}
            className="input-field"
            value={form.observacao}
            onChange={handleChange}
          />
        </div>

        {error && (
          <div
            style={{
              fontSize: '0.78rem',
              color: '#b91c1c',
              background: 'rgba(248,113,113,0.08)',
              borderRadius: 10,
              padding: '0.35rem 0.55rem',
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              fontSize: '0.78rem',
              color: '#15803d',
              background: 'rgba(34,197,94,0.08)',
              borderRadius: 10,
              padding: '0.35rem 0.55rem',
            }}
          >
            {success}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar proposta'}
          </button>
        </div>
      </form>
    </div>
  )
}
