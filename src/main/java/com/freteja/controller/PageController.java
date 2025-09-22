package com.freteja.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/teste-cep")
    public String testeCep() {
        return "teste-cep"; // procura templates/teste-cep.html
    }
}

