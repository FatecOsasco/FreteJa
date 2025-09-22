package com.freteja.model;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data

@Document("cotacoes")
public class Cotacao {
  @Id
  private String id;

  private String solicitanteUserId;
  private String origemCep;
  private String destinoCep;

  private BigDecimal pesoKg;
  private String dimensoes; // ex.: "30x20x15"

  private String status; // ABERTA, EM_ANALISE, APROVADA, REPROVADA
  private String propostaAprovadaId;

  private Instant createdAt = Instant.now();

  // TTL histórico 5 anos para aprovadas/reprovadas (índice TTL parcial)
  @Indexed
  private Instant encerradaEm; // setado quando aprova/reprova

  // getters/setters ...
}

