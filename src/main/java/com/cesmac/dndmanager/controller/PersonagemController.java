package com.cesmac.dndmanager.controller;

import com.cesmac.dndmanager.dto.PersonagemRequestDTO;
import com.cesmac.dndmanager.dto.PersonagemResponseDTO;
import com.cesmac.dndmanager.service.PersonagemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/personagens")
@RequiredArgsConstructor
@Tag(
        name = "Personagens",
        description = "Endpoints para gerenciamento das fichas de personagens de D&D"
)
public class PersonagemController {

    private final PersonagemService service;

    @PostMapping
    @Operation(
            summary = "Criar personagem",
            description = "Cria uma nova ficha de personagem vinculada ao usuário autenticado."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Personagem criado com sucesso"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Dados do personagem inválidos"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Usuário não autenticado"
            )
    })
    public ResponseEntity<PersonagemResponseDTO> criar(
            @RequestBody PersonagemRequestDTO request,
            Authentication authentication
    ) {

        String email = extrairEmail(authentication);
        PersonagemResponseDTO response = service.criar(request, email);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    @Operation(
            summary = "Listar personagens",
            description = "Retorna todas as fichas de personagens do usuário autenticado."
    )
    public ResponseEntity<List<PersonagemResponseDTO>> listar(Authentication authentication) {
        String email = extrairEmail(authentication);
        return ResponseEntity.ok(service.listarPorUsuario(email));
    }

    @GetMapping("/rolagens")
    public ResponseEntity<List<Integer>> obterRolagens() {
        return ResponseEntity.ok(service.rolarNovosAtributos());
    }

    private String extrairEmail(Authentication authentication) {
        if (authentication == null) return null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof com.cesmac.dndmanager.entity.Usuario u) {
            return u.getEmail();
        }
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
            return userDetails.getUsername();
        }
        return authentication.getName();
    }
}