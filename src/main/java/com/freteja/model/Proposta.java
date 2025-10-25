package com.freteja.model;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document("propostas")
public class Proposta {
  @Id
  private String id;

  private String cotacaoId;
  private String transportadoraUserId;

  private BigDecimal valor;
  private String prazoEntregaDias;
  private String observacoes;

  private Instant createdAt = Instant.now();
}
