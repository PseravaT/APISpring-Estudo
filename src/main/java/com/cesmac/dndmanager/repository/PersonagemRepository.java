package com.cesmac.dndmanager.repository;
import com.cesmac.dndmanager.entity.Personagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PersonagemRepository extends JpaRepository<Personagem, UUID> {
    List<Personagem> findAllByUsuarioEmail(String email);
    List<Personagem> findAllByUsuarioEmailIgnoreCase(String email);
}