package com.cesmac.dndmanager.service;

import com.cesmac.dndmanager.dto.UsuarioRequestDTO;
import com.cesmac.dndmanager.dto.UsuarioResponseDTO;
import com.cesmac.dndmanager.entity.Usuario;
import com.cesmac.dndmanager.exception.RegraNegocioException;
import com.cesmac.dndmanager.mapper.UsuarioMapper;
import com.cesmac.dndmanager.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final UsuarioMapper mapper;
    private final PasswordEncoder passwordEncoder;


    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO request) {
        String emailTratado = request.email() != null ? request.email().trim().toLowerCase() : "";
        if (repository.existsByEmail(emailTratado) || repository.existsByEmailIgnoreCase(emailTratado)) {
            throw new RegraNegocioException("Email já cadastrado na plataforma.");
        }

        Usuario usuario = mapper.toEntity(request);
        usuario.setEmail(emailTratado);
        usuario.setSenha(passwordEncoder.encode(request.senha()));

        Usuario usuarioSalvo = repository.save(usuario);

        return mapper.toResponse(usuarioSalvo);
    }
}