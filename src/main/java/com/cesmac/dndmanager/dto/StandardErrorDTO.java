package com.cesmac.dndmanager.dto;

import java.time.Instant;
import java.util.List;

public record StandardErrorDTO(
        Instant timestamp,
        Integer status,
        String error,
        String message,
        String path,
        List<FieldErrorDTO> fields
) {}