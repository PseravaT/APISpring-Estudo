package com.cesmac.dndmanager.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

public record UsuarioResponseDTO(

        @Schema(
                description = "Identificador único do usuário",
                example = "550e8400-e29b-41d4-a716-446655440000"
        )
        UUID id,

        @Schema(
                description = "Nome do usuário",
                example = "Aragorn"
        )
        String nome,

        @Schema(
                description = "E-mail do usuário",
                example = "aragorn@email.com"
        )
        String email
) {}