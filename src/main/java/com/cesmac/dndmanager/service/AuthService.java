package com.cesmac.dndmanager.service;
import com.cesmac.dndmanager.dto.LoginRequestDTO;
import com.cesmac.dndmanager.dto.LoginResponseDTO;
import com.cesmac.dndmanager.entity.Usuario;
import com.cesmac.dndmanager.mapper.AuthMapper;
import com.cesmac.dndmanager.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final AuthMapper authMapper;


    public LoginResponseDTO autenticar(LoginRequestDTO request) {
        Usuario usuario = repository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenha())) {
            throw new RuntimeException("Credenciais inválidas");
        }

        String token = tokenService.gerarToken(usuario);
        return authMapper.toResponse(token);
    }
}