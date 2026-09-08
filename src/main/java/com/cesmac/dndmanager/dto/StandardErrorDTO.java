package com.cesmac.dndmanager.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.List;

public record StandardErrorDTO(
        @Schema(
                description = "Data e hora em que o erro ocorreu",
                example = "2026-09-08T14:30:00Z"
        )
        Instant timestamp,

        @Schema(
                description = "Código HTTP do erro",
                example = "400"
        )
        Integer status,


        @Schema(
                description = "Descrição do tipo de erro",
                example = "Bad Request"
        )
        String error,

        @Schema(
                description = "Mensagem explicando o erro",
                example = "Erro de validação"
        )
        String message,

        @Schema(
                description = "Endpoint que originou o erro",
                example = "/usuarios"
        )
        String path,

        @Schema(
                description = "Lista de erros específicos dos campos"
        )
        List<FieldErrorDTO> fields
) {}