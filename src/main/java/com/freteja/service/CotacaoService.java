package com.freteja.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import com.freteja.model.Cotacao;
import com.freteja.model.Proposta;
import com.freteja.repository.CotacaoRepository;
import com.freteja.repository.PropostaRepository;

@Service
public class CotacaoService {
  private final CotacaoRepository cotacoes;
  private final PropostaRepository propostas;

  public CotacaoService(CotacaoRepository cRepo, PropostaRepository pRepo) {
    this.cotacoes = cRepo;
    this.propostas = pRepo;
  }

  public Cotacao criar(Cotacao c, String solicitanteUserId) {
    c.setSolicitanteUserId(solicitanteUserId);
    c.setStatus("ABERTA");
    return cotacoes.save(c);
  }

  public List<Cotacao> minhas(String userId) {
    return cotacoes.findBySolicitanteUserId(userId);
  }

  public Proposta propor(Proposta p, String transportadoraUserId) {
    p.setTransportadoraUserId(transportadoraUserId);
    return propostas.save(p);
  }

  public Cotacao aprovar(String cotacaoId, String propostaId) {
    Cotacao c = cotacoes.findById(cotacaoId).orElseThrow();
    c.setPropostaAprovadaId(propostaId);
    c.setStatus("APROVADA");
    c.setEncerradaEm(Instant.now()); // necessário para TTL histórico
    return cotacoes.save(c);
  }

  public Cotacao reprovar(String cotacaoId) {
    Cotacao c = cotacoes.findById(cotacaoId).orElseThrow();
    c.setStatus("REPROVADA");
    c.setEncerradaEm(Instant.now()); // necessário para TTL histórico
    return cotacoes.save(c);
  }

  public List<Proposta> listarPropostas(String cotacaoId) {
    return propostas.findByCotacaoId(cotacaoId);
  }
}

