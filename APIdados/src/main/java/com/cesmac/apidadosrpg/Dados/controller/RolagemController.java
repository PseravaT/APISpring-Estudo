package com.cesmac.apidadosrpg.Dados.controller;

import com.cesmac.apidadosrpg.Dados.dto.AtributosResponseDTO;
import com.cesmac.apidadosrpg.Dados.service.RolagemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rolagens")
public class RolagemController {

    private final RolagemService rolagemService;

    public RolagemController(RolagemService rolagemService) {
        this.rolagemService = rolagemService;
    }

    @GetMapping("/atributos")
    public ResponseEntity<List<Integer>> rolarAtributos() {
        List<Integer> atributosGerados = rolagemService.gerarAtributos();
        return ResponseEntity.ok(atributosGerados);
    }
}