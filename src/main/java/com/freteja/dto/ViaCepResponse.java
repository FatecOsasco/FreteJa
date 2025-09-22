package com.freteja.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ViaCepResponse(
    @JsonProperty("cep") String cep,
    @JsonProperty("logradouro") String logradouro,
    @JsonProperty("complemento") String complemento,
    @JsonProperty("bairro") String bairro,
    @JsonProperty("localidade") String localidade,
    @JsonProperty("uf") String uf,
    @JsonProperty("ibge") String ibge,
    @JsonProperty("gia") String gia,
    @JsonProperty("ddd") String ddd,
    @JsonProperty("siafi") String siafi
) {}

