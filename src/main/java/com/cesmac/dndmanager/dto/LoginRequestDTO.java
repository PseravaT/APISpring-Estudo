package com.cesmac.dndmanager.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record LoginRequestDTO(
        @Schema(
                description = "E-mail utilizado para autenticação",
                example = "usuario@email.com"
        )
        String email,

        @Schema(
                description = "Senha utilizada para autenticação",
                example = "Senha@123"
        )
        String senha
) {}