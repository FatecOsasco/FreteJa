import api from './client'

export async function login(email, senha) {
  const { data } = await api.post('/auth/login', { email, senha })
  return data
}

export async function register({ nome, email, senha, perfis }) {
  const { data } = await api.post('/auth/register', {
    nome,
    email,
    senha,
    perfis,
  })
  return data
}
