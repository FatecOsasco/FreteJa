// service/CotacaoService.java
package com.freteja.service;

import com.freteja.dto.ViaCepResponse;
import com.freteja.model.Cotacao;
import com.freteja.repository.CotacaoRepository;
import org.springframework.stereotype.Service;

@Service
public class CotacaoService {

    private final CotacaoRepository cotacoes;
    private final ViaCepService viaCep;

    public CotacaoService(CotacaoRepository cotacoes, ViaCepService viaCep) {
        this.cotacoes = cotacoes;
        this.viaCep = viaCep;
    }

    public Cotacao criar(Cotacao c, String userId) {
        // valida CEP de origem
        ViaCepResponse origem = viaCep.buscarEnderecoPorCep(c.getOrigemCep());
        if (origem == null || origem.localidade() == null) {
            throw new IllegalArgumentException("CEP de origem inválido!");
        }

        // valida CEP de destino
        ViaCepResponse destino = viaCep.buscarEnderecoPorCep(c.getDestinoCep());
        if (destino == null || destino.localidade() == null) {
            throw new IllegalArgumentException("CEP de destino inválido!");
        }

        // seta usuário solicitante
        c.setSolicitanteUserId(userId);
        c.setStatus("ABERTA");

        return cotacoes.save(c);
    }

    // ... métodos minhas, propor, aprovar etc (já existentes)
}
