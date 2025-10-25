package com.freteja.service;

import com.freteja.dto.ViaCepResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ViaCepService {

    private final RestTemplate restTemplate = new RestTemplate();

    public ViaCepResponse buscarEnderecoPorCep(String cep) {
        String onlyDigits = cep == null ? "" : cep.replaceAll("\\D", "");
        if (!onlyDigits.matches("^\\d{8}$")) {
            throw new RuntimeException("CEP inválido");
        }
        String url = "https://viacep.com.br/ws/" + onlyDigits + "/json/";
        return restTemplate.getForObject(url, ViaCepResponse.class);
    }
}

