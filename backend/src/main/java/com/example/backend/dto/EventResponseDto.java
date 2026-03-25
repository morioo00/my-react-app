package com.example.backend.dto;

import java.time.LocalDateTime;

public record EventResponseDto(
        Long id,
        String title,
        String memo,
        LocalDateTime startAt,
        LocalDateTime endAt,
        String authorUsername) {
}
