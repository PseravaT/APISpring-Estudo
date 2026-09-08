package com.cesmac.dndmanager.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record LoginResponseDTO(
        @Schema(
                description = "Token JWT utilizado para autenticar as requisições",
                example = "eyJhbGciOiJIUzI1NiJ9..."
        )
        String token) {
}
