package com.cesmac.dndmanager.controller;
import com.cesmac.dndmanager.dto.LoginRequestDTO;
import com.cesmac.dndmanager.entity.Usuario;
import com.cesmac.dndmanager.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerIT {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Antes de cada teste, preparamos o banco com um usuário válido
    @BeforeEach
    void setUp() {
        Usuario usuario = new Usuario();
        usuario.setNome("Mestre");
        usuario.setEmail("mestre@rpg.com");
        usuario.setSenha(passwordEncoder.encode("senha123"));
        repository.save(usuario);
    }

    @Test
    @DisplayName("Deve autenticar com sucesso e retornar o token JWT")
    void deveAutenticarComSucesso() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO("mestre@rpg.com", "senha123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    @DisplayName("Deve falhar com 400 Bad Request ao errar a senha")
    void deveFalharComSenhaIncorreta() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO("mestre@rpg.com", "senha_errada");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized()); // <-- ALTERAR AQUI
    }

    @Test
    @DisplayName("Deve falhar com 400 Bad Request se o email não existir")
    void deveFalharComEmailInexistente() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO("fantasma@rpg.com", "senha123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized()); // <-- ALTERAR AQUI
    }
}