package com.cesmac.dndmanager.service;
import com.cesmac.dndmanager.dto.UsuarioRequestDTO;
import com.cesmac.dndmanager.entity.Usuario;
import com.cesmac.dndmanager.mapper.UsuarioMapper;
import com.cesmac.dndmanager.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository repository;

    @Mock
    private UsuarioMapper mapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService service;

    @Test
    void deveCriarUsuarioComSucesso() {

        var request = new UsuarioRequestDTO("Mestre", "mestre@dnd.com", "senha123");
        var usuarioMock = new Usuario();
        usuarioMock.setSenha("senha123");


        when(repository.existsByEmail(request.email())).thenReturn(false);
        when(mapper.toEntity(request)).thenReturn(usuarioMock);
        when(passwordEncoder.encode(request.senha())).thenReturn("hashSeguro");
        when(repository.save(any(Usuario.class))).thenReturn(usuarioMock);


        service.criarUsuario(request);


        verify(passwordEncoder, times(1)).encode("senha123");
        verify(repository, times(1)).save(usuarioMock);
        assertEquals("hashSeguro", usuarioMock.getSenha());
    }

    @Test
    void deveImpedirCadastroComEmailDuplicado() {
        var request = new UsuarioRequestDTO("Mestre", "mestre@dnd.com", "senha123");


        when(repository.existsByEmail(request.email())).thenReturn(true);


        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            service.criarUsuario(request);
        });

        assertEquals("Email já cadastrado na plataforma.", exception.getMessage());

        verify(repository, never()).save(any());
    }
}