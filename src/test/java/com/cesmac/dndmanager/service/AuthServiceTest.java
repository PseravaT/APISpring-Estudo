package com.cesmac.dndmanager.service;
import com.cesmac.dndmanager.dto.LoginRequestDTO;
import com.cesmac.dndmanager.entity.Usuario;
import com.cesmac.dndmanager.mapper.AuthMapper;
import com.cesmac.dndmanager.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UsuarioRepository repository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private TokenService tokenService;
    @Mock private AuthMapper authMapper;

    @InjectMocks private AuthService service;

    @Test
    void deveFalharQuandoUsuarioNaoExistir() {
        var request = new LoginRequestDTO("fantasma@dnd.com", "senha123");

        // Simula que o banco não achou o email
        when(repository.findByEmail(request.email())).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> service.autenticar(request));
        assertEquals("Credenciais inválidas", exception.getMessage());
    }

    @Test
    void deveFalharQuandoSenhaEstiverIncorreta() {
        var request = new LoginRequestDTO("mestre@dnd.com", "senhaErrada");
        var usuario = new Usuario();
        usuario.setSenha("hashVerdadeiro");

        when(repository.findByEmail(request.email())).thenReturn(Optional.of(usuario));
        // Simula que o encriptador reprovou a senha
        when(passwordEncoder.matches("senhaErrada", "hashVerdadeiro")).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> service.autenticar(request));
        assertEquals("Credenciais inválidas", exception.getMessage());
    }
}