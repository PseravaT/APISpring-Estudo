package com.cesmac.dndmanager.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

public record PersonagemResponseDTO(

        @Schema(
                description = "Identificador único do personagem",
                example = "550e8400-e29b-41d4-a716-446655440000"
        )
        UUID id,

        @Schema(description = "Nome do personagem", example = "Aragorn")
        String nome,

        @Schema(description = "Raça do personagem", example = "Humano")
        String raca,

        @Schema(description = "Classe do personagem", example = "Guerreiro")
        String classe,

        @Schema(description = "Subclasse do personagem", example = "Mestre de Batalha")
        String subclasse,

        @Schema(description = "Nível do personagem", example = "5")
        Integer nivel,

        @Schema(description = "Pontos de vida do personagem", example = "45")
        Integer hp,

        @Schema(description = "Classe de armadura do personagem", example = "16")
        Integer classeArmadura,

        @Schema(description = "Valor de Força", example = "16")
        Integer forca,

        @Schema(description = "Valor de Destreza", example = "14")
        Integer destreza,

        @Schema(description = "Valor de Constituição", example = "15")
        Integer constituicao,

        @Schema(description = "Valor de Inteligência", example = "10")
        Integer inteligencia,

        @Schema(description = "Valor de Sabedoria", example = "12")
        Integer sabedoria,

        @Schema(description = "Valor de Carisma", example = "8")
        Integer carisma
) {}