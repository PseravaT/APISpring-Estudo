package com.cesmac.dndmanager.controller;
import com.cesmac.dndmanager.dto.LoginRequestDTO;
import com.cesmac.dndmanager.dto.UsuarioRequestDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UsuarioControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void deveCriarUsuarioELogarComSucesso() throws Exception {

        var cadastroRequest = new UsuarioRequestDTO("Bárbaro Golias", "dimios@dnd.com", "furia123");
        String jsonCadastro = objectMapper.writeValueAsString(cadastroRequest);


        mockMvc.perform(post("/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonCadastro))

                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("dimios@dnd.com"));


        var loginRequest = new LoginRequestDTO("dimios@dnd.com", "furia123");
        String jsonLogin = objectMapper.writeValueAsString(loginRequest);


        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonLogin))

                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }
}
