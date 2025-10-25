package com.freteja.service;

import com.freteja.model.Cotacao;
import com.freteja.dto.CotacaoCreateDTO;
import com.freteja.dto.PropostaCreateDTO;
import com.freteja.model.User;
import com.freteja.model.Perfil;
import com.freteja.model.Proposta;
import com.freteja.repository.CotacaoRepository;
import com.freteja.repository.PropostaRepository;
import com.freteja.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class CotacaoService {

    private final CotacaoRepository cotacoes;
    private final PropostaRepository propostas;
    private final UserRepository users;

    public CotacaoService(CotacaoRepository cotacoes, PropostaRepository propostas, UserRepository users) {
        this.cotacoes = cotacoes;
        this.propostas = propostas;
        this.users = users;
    }

    public Cotacao criar(String solicitanteEmail, CotacaoCreateDTO dto) {
        User u = users.findByEmail(solicitanteEmail).orElseThrow();
        Cotacao c = new Cotacao();
        c.setSolicitanteUserId(u.getId());
        c.setOrigemCep(dto.origemCep());
        c.setDestinoCep(dto.destinoCep());
        c.setQuantidade(dto.quantidade());
        c.setPesoKg(dto.pesoKg());
        c.setDimensoes(dto.dimensoes());
        c.setStatus("ABERTA");
        c.setCreatedAt(Instant.now());
        return cotacoes.save(c);
    }

    public List<Cotacao> minhas(String userId) {
        return cotacoes.findBySolicitanteUserId(userId);
    }

    public Proposta adicionarProposta(String cotacaoId, String email, PropostaCreateDTO dto) {
        User u = users.findByEmail(email).orElseThrow();
        if (u.getPerfis() == null || u.getPerfis().stream().noneMatch(p -> p == Perfil.TRANSPORTADORA)) {
            throw new RuntimeException("Apenas perfil TRANSPORTADORA pode cadastrar propostas");
        }
        Cotacao c = cotacoes.findById(cotacaoId).orElseThrow();
        Proposta p = new Proposta();
        p.setCotacaoId(c.getId());
        p.setTransportadoraUserId(u.getId());
        p.setValor(dto.valor());
        p.setPrazoEntregaDias(dto.prazoEntregaDias());
        p.setObservacoes(dto.observacoes());
        return propostas.save(p);
    }

    public Cotacao aprovar(String cotacaoId, String propostaId) {
        Cotacao c = cotacoes.findById(cotacaoId).orElseThrow();
        c.setStatus("APROVADA");
        c.setPropostaAprovadaId(propostaId);
        c.setEncerradaEm(Instant.now());
        return cotacoes.save(c);
    }

    public Cotacao reprovar(String cotacaoId) {
        Cotacao c = cotacoes.findById(cotacaoId).orElseThrow();
        c.setStatus("REPROVADA");
        c.setEncerradaEm(Instant.now());
        return cotacoes.save(c);
    }

    public List<Proposta> listarPropostas(String cotacaoId) {
        return propostas.findByCotacaoId(cotacaoId);
    }
}
