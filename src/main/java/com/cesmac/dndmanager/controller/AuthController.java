package com.cesmac.dndmanager.controller;
import com.cesmac.dndmanager.dto.LoginRequestDTO;
import com.cesmac.dndmanager.dto.LoginResponseDTO;
import com.cesmac.dndmanager.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Endpoints para login e acesso ao sistema")
public class AuthController {
    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    @Operation(summary = "Realiza o login", description = "Recebe as credenciais e devolve o passe (JWT)")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody
            LoginRequestDTO request) {
        return ResponseEntity.ok(service.autenticar(request));
    }
}