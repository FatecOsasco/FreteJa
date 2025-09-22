// controller/ViaCepController.java
package com.freteja.controller;

import com.freteja.dto.ViaCepResponse;
import com.freteja.service.ViaCepService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cep")
public class ViaCepController {

    private final ViaCepService viaCepService;

    public ViaCepController(ViaCepService viaCepService) {
        this.viaCepService = viaCepService;
    }

    @GetMapping("/{cep}")
    public ResponseEntity<ViaCepResponse> consultar(@PathVariable String cep) {
        return ResponseEntity.ok(viaCepService.buscarEnderecoPorCep(cep));
    }
}
