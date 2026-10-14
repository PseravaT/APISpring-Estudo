package com.cesmac.dndmanager.mapper;

import com.cesmac.dndmanager.dto.PersonagemRequestDTO;
import com.cesmac.dndmanager.dto.PersonagemResponseDTO;
import com.cesmac.dndmanager.entity.Personagem;
import org.springframework.stereotype.Component;

@Component
public class PersonagemMapper {
    public Personagem toEntity(PersonagemRequestDTO dto) {
        Personagem p = new Personagem();
        p.setNome(dto.nome());
        p.setRaca(dto.raca());
        p.setClasse(dto.classe());
        p.setSubclasse(dto.subclasse());
        p.setNivel(dto.nivel());
        p.setHp(dto.hp());
        p.setClasseArmadura(dto.classeArmadura());
        p.setForca(dto.forca());
        p.setDestreza(dto.destreza());
        p.setConstituicao(dto.constituicao());
        p.setInteligencia(dto.inteligencia());
        p.setSabedoria(dto.sabedoria());
        p.setCarisma(dto.carisma());
        return p;
    }

    public PersonagemResponseDTO toResponse(Personagem p) {
        return new PersonagemResponseDTO(
                p.getId(), p.getNome(), p.getRaca(), p.getClasse(), p.getSubclasse(),
                p.getNivel(), p.getHp(), p.getClasseArmadura(),
                p.getForca(), p.getDestreza(), p.getConstituicao(),
                p.getInteligencia(), p.getSabedoria(), p.getCarisma()
        );
    }
}