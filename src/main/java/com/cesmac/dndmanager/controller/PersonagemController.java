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

        PersonagemResponseDTO response =
                service.criar(request, authentication.getName());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}