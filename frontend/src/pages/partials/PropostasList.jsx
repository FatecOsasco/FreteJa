import React from 'react'

export default function PropostasList({ cotacao, propostas, onAprovar, onReprovarCotacao, loading }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div
            style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#9CA3AF',
              marginBottom: 2,
            }}
          >
            Cotação selecionada
          </div>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>
            {cotacao.origemCep} → {cotacao.destinoCep}
          </h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#6B7280' }}>
            Peso: <strong>{cotacao.pesoKg} kg</strong> · Dimensões: <strong>{cotacao.dimensoes || '—'}</strong> ·
            Status:{' '}
            <span className={`status-badge status-${cotacao.status || 'ABERTA'}`}>
              {cotacao.status || 'ABERTA'}
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onReprovarCotacao}
            disabled={loading}
            style={{ fontSize: '0.78rem', paddingInline: '0.7rem' }}
          >
            Marcar cotação como reprovada
          </button>
          {cotacao.propostaAprovadaId && (
            <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>
              Proposta aprovada: <strong>{cotacao.propostaAprovadaId}</strong>
            </span>
          )}
        </div>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <h4 style={{ margin: '0 0 0.3rem', fontSize: '0.9rem' }}>Propostas recebidas</h4>
        {propostas.length === 0 ? (
          <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>
            Ainda não há propostas para esta cotação. As transportadoras podem enviar propostas informando o ID da
            cotação no formulário lateral.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.6rem',
              marginTop: '0.4rem',
            }}
          >
            {propostas.map((p) => (
              <article
                key={p.id}
                style={{
                  borderRadius: 14,
                  border: '1px solid rgba(209,213,219,0.9)',
                  padding: '0.6rem 0.7rem',
                  background: 'rgba(255,255,255,0.9)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: 4,
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>Proposta</div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{p.id}</div>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>R$ {p.valor}</div>
                <div style={{ fontSize: '0.8rem', color: '#4B5563', marginBottom: 4 }}>
                  Prazo estimado:{' '}
                  <strong>
                    {p.prazoDias} dia{p.prazoDias === 1 ? '' : 's'}
                  </strong>
                </div>
                {p.observacao && (
                  <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '0 0 0.4rem' }}>{p.observacao}</p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => onAprovar(p.id)}
                    disabled={loading}
                    style={{ fontSize: '0.78rem', paddingInline: '0.7rem' }}
                  >
                    Aprovar proposta
                  </button>
                  <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Transportadora: {p.transportadoraUserId}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
