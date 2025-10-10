package com.freteja.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.freteja.model.Cotacao;
import com.freteja.dto.CotacaoCreateDTO;
import com.freteja.dto.PropostaCreateDTO;
import jakarta.validation.Valid;
import com.freteja.model.Proposta;
import com.freteja.repository.UserRepository;
import com.freteja.service.CotacaoService;

@RestController
@RequestMapping("/cotacoes")
public class CotacaoController {

  private final CotacaoService service;
  private final UserRepository users;

  public CotacaoController(CotacaoService service, UserRepository users) {
    this.service = service;
    this.users = users;
  }

  @PostMapping
  public ResponseEntity<Cotacao> criar(@RequestBody Cotacao c, Principal principal) {
    var user = users.findByEmail(principal.getName()).orElseThrow();
    return ResponseEntity.ok(service.criar(c, user.getId()));
  }

  @GetMapping("/minhas")
  public ResponseEntity<List<Cotacao>> minhas(Principal principal) {
    var user = users.findByEmail(principal.getName()).orElseThrow();
    return ResponseEntity.ok(service.minhas(user.getId()));
  }

  @PostMapping("/{id}/propostas")
  public ResponseEntity<Proposta> propor(@PathVariable String id, @RequestBody Proposta p, Principal principal) {
    var user = users.findByEmail(principal.getName()).orElseThrow();
    p.setCotacaoId(id);
    return ResponseEntity.ok(service.propor(p, user.getId()));
  }

  @PostMapping("/{id}/aprovar/{propostaId}")
  public ResponseEntity<Cotacao> aprovar(@PathVariable String id, @PathVariable String propostaId) {
    return ResponseEntity.ok(service.aprovar(id, propostaId));
  }

  @PostMapping("/{id}/reprovar")
  public ResponseEntity<Cotacao> reprovar(@PathVariable String id) {
    return ResponseEntity.ok(service.reprovar(id));
  }

  @GetMapping("/{id}/propostas")
  public ResponseEntity<List<Proposta>> listarPropostas(@PathVariable String id) {
    return ResponseEntity.ok(service.listarPropostas(id));
  }
}

