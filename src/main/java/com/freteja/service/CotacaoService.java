// service/CotacaoService.java
package com.freteja.service;

import com.freteja.model.Cotacao;
import com.freteja.model.Proposta;
import com.freteja.repository.CotacaoRepository;
import com.freteja.repository.PropostaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CotacaoService {

    private final CotacaoRepository cotacoes;
    private final PropostaRepository propostas;
    private final ViaCepService viaCep; // já criamos antes

    public CotacaoService(CotacaoRepository cotacoes, PropostaRepository propostas, ViaCepService viaCep) {
        this.cotacoes = cotacoes;
        this.propostas = propostas;
        this.viaCep = viaCep;
    }

    public Cotacao criar(Cotacao c, String userId) {
        // validação de CEP (já mostrei antes)
        viaCep.buscarEnderecoPorCep(c.getOrigemCep());
        viaCep.buscarEnderecoPorCep(c.getDestinoCep());

        c.setSolicitanteUserId(userId);
        c.setStatus("ABERTA");
        return cotacoes.save(c);
    }

    public List<Cotacao> minhas(String userId) {
        return cotacoes.findBySolicitanteUserId(userId);
    }

    public Proposta propor(Proposta p, String userId) {
        p.setTransportadoraUserId(userId);
        return propostas.save(p);
    }

    public Cotacao aprovar(String cotacaoId, String propostaId) {
        Cotacao c = cotacoes.findById(cotacaoId).orElseThrow();
        c.setStatus("APROVADA");
        c.setPropostaAprovadaId(propostaId);
        c.setEncerradaEm(java.time.Instant.now());
        return cotacoes.save(c);
    }

    public Cotacao reprovar(String cotacaoId) {
        Cotacao c = cotacoes.findById(cotacaoId).orElseThrow();
        c.setStatus("REPROVADA");
        c.setEncerradaEm(java.time.Instant.now());
        return cotacoes.save(c);
    }

    public List<Proposta> listarPropostas(String cotacaoId) {
        return propostas.findByCotacaoId(cotacaoId);
    }
}

