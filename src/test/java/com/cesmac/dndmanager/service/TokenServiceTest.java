package com.cesmac.dndmanager.service;
import com.cesmac.dndmanager.entity.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class TokenServiceTest {

    private TokenService tokenService;

    @BeforeEach
    void setUp() {
        tokenService = new TokenService();

        ReflectionTestUtils.setField(tokenService, "secret", "chave-secreta-de-teste");
        ReflectionTestUtils.setField(tokenService, "expirationHours", 2);
    }

    @Test
    void deveGerarEValidarTokenComSucesso() {
        var usuario = new Usuario();
        usuario.setEmail("bardo@dnd.com");

        String token = tokenService.gerarToken(usuario);
        assertNotNull(token);

        String emailExtraido = tokenService.validarToken(token);
        assertEquals("bardo@dnd.com", emailExtraido);
    }

    @Test
    void deveRetornarVazioParaTokenInvalido() {
        String resultado = tokenService.validarToken("umTokenCompletamenteFalsoEInvalido");
        assertEquals("", resultado);
    }
}