package com.freteja.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PropostaCreateDTO(
  @NotNull @Min(1) BigDecimal valor,
  @NotBlank String prazoEntregaDias,
  String observacoes
) {}
