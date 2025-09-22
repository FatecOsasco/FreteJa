package com.freteja.service;

import java.time.Instant;
import java.util.Map;
import java.util.Set;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.freteja.model.Perfil;
import com.freteja.model.User;
import com.freteja.repository.UserRepository;
import com.freteja.security.JwtUtil;

@Service
public class UserService {
  private final UserRepository users;
  private final BCryptPasswordEncoder encoder;
  private final JwtUtil jwt;

  public UserService(UserRepository users, BCryptPasswordEncoder encoder, JwtUtil jwt) {
    this.users = users;
    this.encoder = encoder;
    this.jwt = jwt;
  }

  public User register(String nome, String email, String senha, Set<Perfil> perfis) {
    User u = new User();
    u.setNome(nome);
    u.setEmail(email.toLowerCase());
    u.setSenhaHash(encoder.encode(senha));
    u.setPerfis(perfis);
    u.setLastLoginAt(Instant.now());
    return users.save(u);
  }

  public String login(String email, String senha) {
    User u = users.findByEmail(email.toLowerCase())
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    if (!encoder.matches(senha, u.getSenhaHash())) {
      throw new RuntimeException("Credenciais inválidas");
    }
    u.setLastLoginAt(Instant.now());
    users.save(u);
    return jwt.generate(u.getEmail(), Map.of("perfis", u.getPerfis()));
  }
}

