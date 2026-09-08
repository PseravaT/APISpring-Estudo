package com.cesmac.dndmanager.service;
import com.cesmac.dndmanager.dto.PersonagemRequestDTO;
import com.cesmac.dndmanager.dto.PersonagemResponseDTO;
import com.cesmac.dndmanager.entity.Personagem;
import com.cesmac.dndmanager.entity.Usuario;
import com.cesmac.dndmanager.exception.RegraNegocioException;
import com.cesmac.dndmanager.mapper.PersonagemMapper;
import com.cesmac.dndmanager.repository.PersonagemRepository;
import com.cesmac.dndmanager.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PersonagemService {

    private final PersonagemRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final PersonagemMapper mapper;

    public PersonagemResponseDTO criar(PersonagemRequestDTO request, String emailUsuarioLogado) {

        Usuario dono = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new RegraNegocioException("Usuário não encontrado."));

        Personagem personagem = mapper.toEntity(request);
        personagem.setUsuario(dono);

        Personagem salvo = repository.save(personagem);
        return mapper.toResponse(salvo);
    }
}