package com.cesmac.dndmanager.controller;
import com.cesmac.dndmanager.dto.LoginRequestDTO;
import com.cesmac.dndmanager.dto.LoginResponseDTO;
import com.cesmac.dndmanager.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody
            LoginRequestDTO request) {
        return ResponseEntity.ok(service.autenticar(request));
    }
}