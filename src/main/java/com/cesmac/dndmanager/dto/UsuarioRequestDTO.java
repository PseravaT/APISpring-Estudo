package com.cesmac.dndmanager.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UsuarioRequestDTO(
        @NotBlank(message = "Nome é obrigatório")
        @Schema(
                description = "Nome do usuário",
                example = "Aragorn"
        )
        String nome,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "O formato do e-mail é inválido")
        @Schema(
                description = "E-mail utilizado para acesso ao sistema",
                example = "aragorn@email.com"
        )
        String email,

        @NotBlank(message = "A senha é obrigatória")
        @Schema(
                description = "Senha utilizada para acesso ao sistema",
                example = "Senha@123",
                format = "password"
        )
        String senha
) {}