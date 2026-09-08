package com.cesmac.dndmanager.mapper;
import com.cesmac.dndmanager.dto.LoginResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {
    public LoginResponseDTO toResponse(String token) {
        return new LoginResponseDTO(token);
    }
}