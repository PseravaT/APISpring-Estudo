package com.cesmac.dndmanager.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record FieldErrorDTO(
        @Schema(
                description = "Nome do campo que apresentou erro",
                example = "email"
        )
        String field,
        @Schema(
                description = "Mensagem de validação do campo",
                example = "O formato do e-mail é inválido"
        )
        String message) {}