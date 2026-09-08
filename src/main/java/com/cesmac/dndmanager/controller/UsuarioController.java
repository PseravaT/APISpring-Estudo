package com.cesmac.dndmanager.controller;
import com.cesmac.dndmanager.dto.UsuarioRequestDTO;
import com.cesmac.dndmanager.dto.UsuarioResponseDTO;
import com.cesmac.dndmanager.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponseDTO criarUsuario(
            @Valid
            @RequestBody
            UsuarioRequestDTO request) {
        return service.criarUsuario(request);
    }

    @GetMapping("/me")
    public ResponseEntity<String> testeAutenticacao() {
        return ResponseEntity.ok("Você está autenticado! Bem-vindo à Taverna, aventureiro!");
    }
}

