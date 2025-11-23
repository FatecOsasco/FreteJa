import api from './client'

export async function listarMinhasCotacoes() {
  const { data } = await api.get('/cotacoes/minhas')
  return data
}

export async function criarCotacao(payload) {
  const { data } = await api.post('/cotacoes', payload)
  return data
}

export async function listarPropostas(cotacaoId) {
  const { data } = await api.get(`/cotacoes/${cotacaoId}/propostas`)
  return data
}

export async function criarProposta(cotacaoId, payload) {
  const { data } = await api.post(`/cotacoes/${cotacaoId}/propostas`, payload)
  return data
}

export async function aprovarProposta(cotacaoId, propostaId) {
  const { data } = await api.post(`/cotacoes/${cotacaoId}/aprovar/${propostaId}`)
  return data
}

export async function reprovarCotacao(cotacaoId) {
  const { data } = await api.post(`/cotacoes/${cotacaoId}/reprovar`)
  return data
}
