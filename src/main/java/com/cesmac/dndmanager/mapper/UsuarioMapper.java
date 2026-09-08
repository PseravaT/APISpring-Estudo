package com.cesmac.dndmanager.mapper;

import com.cesmac.dndmanager.dto.UsuarioRequestDTO;
import com.cesmac.dndmanager.dto.UsuarioResponseDTO;
import com.cesmac.dndmanager.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public Usuario toEntity(UsuarioRequestDTO request) {
        Usuario usuario = new Usuario();
        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setSenha(request.senha());
        return usuario;
    }

    public UsuarioResponseDTO toResponse(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail()
        );
    }
}