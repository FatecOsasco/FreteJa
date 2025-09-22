package com.freteja.model;

import java.time.Instant;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
public class User {
  @Id
  private String id;

  @Indexed(unique = true)
  private String email;

  private String nome;
  private String senhaHash;
  private Set<Perfil> perfis;
  private boolean ativo = true;

  // Para TTL de 90 dias (Demandante/Transportadora), controlado via índice parcial
  @Indexed // índice TTL criado via configuração programática com partialFilter
  private Instant lastLoginAt;

  private Instant createdAt = Instant.now();

  // getters/setters ...
}

