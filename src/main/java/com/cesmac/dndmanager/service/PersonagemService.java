package com.cesmac.dndmanager.service;

import com.cesmac.dndmanager.dto.PersonagemRequestDTO;
import com.cesmac.dndmanager.dto.PersonagemResponseDTO;
import com.cesmac.dndmanager.entity.Personagem;
import com.cesmac.dndmanager.entity.Usuario;
import com.cesmac.dndmanager.exception.RegraNegocioException;
import com.cesmac.dndmanager.mapper.PersonagemMapper;
import com.cesmac.dndmanager.repository.PersonagemRepository;
import com.cesmac.dndmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class PersonagemService {

    private final PersonagemRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final PersonagemMapper mapper;
    private final RestTemplate restTemplate;

    @Value("${APIDADO_URL}")
    private String apiDadosUrl;

    public PersonagemService(PersonagemRepository repository,
                             UsuarioRepository usuarioRepository,
                             PersonagemMapper mapper,
                             RestTemplate restTemplate) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.mapper = mapper;
        this.restTemplate = restTemplate;
    }

    public List<Integer> rolarNovosAtributos() {
        Integer[] rolagens = restTemplate.getForObject(apiDadosUrl, Integer[].class);
        return Arrays.asList(rolagens);
    }

    public PersonagemResponseDTO criar(PersonagemRequestDTO request, String emailUsuarioLogado) {
        if (emailUsuarioLogado == null || emailUsuarioLogado.isBlank()) {
            throw new RegraNegocioException("Usuário não autenticado.");
        }

        String emailTratado = emailUsuarioLogado.trim();
        Usuario dono = usuarioRepository.findByEmail(emailTratado)
                .or(() -> usuarioRepository.findByEmailIgnoreCase(emailTratado))
                .orElseThrow(() -> new RegraNegocioException("Usuário não encontrado."));

        Personagem personagem = mapper.toEntity(request);
        personagem.setUsuario(dono);

        Personagem salvo = repository.save(personagem);
        return mapper.toResponse(salvo);
    }

    public List<PersonagemResponseDTO> listarPorUsuario(String emailUsuarioLogado) {
        if (emailUsuarioLogado == null || emailUsuarioLogado.isBlank()) {
            return List.of();
        }
        String emailTratado = emailUsuarioLogado.trim();
        List<Personagem> lista = repository.findAllByUsuarioEmail(emailTratado);
        if (lista.isEmpty()) {
            lista = repository.findAllByUsuarioEmailIgnoreCase(emailTratado);
        }
        return lista.stream()
                .map(mapper::toResponse)
                .toList();
    }
}