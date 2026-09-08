package com.cesmac.dndmanager.entity;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "personagem")
@EntityListeners(AuditingEntityListener.class)
public class Personagem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String raca;

    @Column(nullable = false)
    private String classe;

    private String subclasse;

    @Column(nullable = false)
    private Integer nivel;

    @Column(nullable = false)
    private Integer hp;

    @Column(name = "classe_armadura", nullable = false)
    private Integer classeArmadura;

    @Column(nullable = false)
    private Integer forca;

    @Column(nullable = false)
    private Integer destreza;

    @Column(nullable = false)
    private Integer constituicao;

    @Column(nullable = false)
    private Integer inteligencia;

    @Column(nullable = false)
    private Integer sabedoria;

    @Column(nullable = false)
    private Integer carisma;

    @Column(nullable = false)
    private Boolean ativo = true;

    @CreatedDate
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @LastModifiedDate
    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;


}