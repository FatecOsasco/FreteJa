package com.freteja.controller;

import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.freteja.model.Perfil;
import com.freteja.model.User;
import com.freteja.security.LoginRequest;
import com.freteja.service.UserService;

record RegisterRequest(String nome, String email, String senha, Set<Perfil> perfis) {}
record TokenResponse(String token) {}

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final UserService users;

  public AuthController(UserService users) {
    this.users = users;
  }

  @PostMapping("/register")
  public ResponseEntity<User> register(@RequestBody RegisterRequest req) {
    return ResponseEntity.ok(users.register(req.nome(), req.email(), req.senha(), req.perfis()));
  }

  @PostMapping("/login")
  public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest req) {
    String token = users.login(req.email(), req.senha());
    return ResponseEntity.ok(new TokenResponse(token));
  }
}

