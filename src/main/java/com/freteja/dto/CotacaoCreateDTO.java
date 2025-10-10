package com.freteja.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CotacaoCreateDTO(
  @NotBlank String origemCep,
  @NotBlank String destinoCep,
  @NotNull @Min(1) Integer quantidade,
  @NotNull @Min(1) BigDecimal pesoKg,
  @NotBlank @Pattern(regexp = "^[0-9]+x[0-9]+x[0-9]+$", message="dimensoes no formato LxAxP") String dimensoes
) {}
