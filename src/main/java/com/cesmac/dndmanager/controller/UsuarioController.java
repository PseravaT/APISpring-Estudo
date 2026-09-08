package com.cesmac.dndmanager.controller;
import com.cesmac.dndmanager.dto.UsuarioRequestDTO;
import com.cesmac.dndmanager.dto.UsuarioResponseDTO;
import com.cesmac.dndmanager.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@Tag(
        name = "Usuários",
        description = "Endpoints para gerenciamento de usuários"
)
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Criar usuário",
            description = "Realiza o cadastro de um novo usuário no sistema."
    )
    public UsuarioResponseDTO criarUsuario(
            @Valid
            @RequestBody
            UsuarioRequestDTO request) {
        return service.criarUsuario(request);
    }

    @GetMapping("/me")
    @Operation(
            summary = "Testar autenticação",
            description = "Verifica se o usuário está autenticado no sistema."
    )
    public ResponseEntity<String> testeAutenticacao() {
        return ResponseEntity.ok("Você está autenticado! Bem-vindo à Taverna, aventureiro!");
    }
}

