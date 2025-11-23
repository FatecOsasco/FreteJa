import React, { useState } from 'react'
import { criarCotacao } from '../../api/cotacoes'

const initialState = {
  origemCep: '',
  destinoCep: '',
  quantidade: '1',
  pesoKg: '',
  dimensoes: '',
}

export default function CotacaoForm({ onCreated }) {
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
      const payload = {
        origemCep: form.origemCep,
        destinoCep: form.destinoCep,
        quantidade: form.quantidade ? Number(form.quantidade) : 1,
        pesoKg: form.pesoKg ? Number(form.pesoKg) : null,
        dimensoes: form.dimensoes,
      }
      await criarCotacao(payload)
      setSuccess('Cotação criada com sucesso! Ela aparecerá na lista de cotações.')
      setForm(initialState)
      onCreated?.()
    } catch (err) {
      console.error(err)
      setError('Não foi possível criar a cotação. Verifique os dados e se a API está em execução.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem' }}>Nova cotação</h3>
      <p style={{ margin: '0 0 0.7rem', fontSize: '0.82rem', color: '#6B7280' }}>
        Informe origem, destino, quantidade de volumes, peso total e dimensões. Os CEPs podem ser validados pela API
        interna de consulta de CEP em uma próxima iteração.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.5rem' }}>
          <div>
            <label htmlFor="origemCep" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563' }}>
              CEP de origem
            </label>
            <input
              id="origemCep"
              name="origemCep"
              className="input-field"
              value={form.origemCep}
              onChange={handleChange}
              placeholder="Ex.: 01001000"
              required
            />
          </div>
          <div>
            <label htmlFor="destinoCep" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563' }}>
              CEP de destino
            </label>
            <input
              id="destinoCep"
              name="destinoCep"
              className="input-field"
              value={form.destinoCep}
              onChange={handleChange}
              placeholder="Ex.: 20040002"
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.5rem' }}>
          <div>
            <label htmlFor="quantidade" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563' }}>
              Quantidade de volumes
            </label>
            <input
              id="quantidade"
              name="quantidade"
              type="number"
              min="1"
              step="1"
              className="input-field"
              value={form.quantidade}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="pesoKg" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563' }}>
              Peso total (kg)
            </label>
            <input
              id="pesoKg"
              name="pesoKg"
              type="number"
              step="0.01"
              min="1"
              className="input-field"
              value={form.pesoKg}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="dimensoes" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563' }}>
              Dimensões (LxAxP)
            </label>
            <input
              id="dimensoes"
              name="dimensoes"
              className="input-field"
              placeholder="Ex.: 30x20x15"
              value={form.dimensoes}
              onChange={handleChange}
              required
            />
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: '#9CA3AF' }}>
              Use apenas números e o formato LxAxP, sem espaços. Ex.: 30x20x15
            </p>
          </div>
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
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar cotação'}
          </button>
        </div>
      </form>
    </div>
  )
}
