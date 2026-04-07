package com.example.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record EventResponseDto(
        Long id,
        String title,
        String memo,
        LocalDateTime startAt,
        LocalDateTime endAt,
        String authorUsername,
        Boolean isSurvey,
        String surveyContent,
        String surveyOptions,
        LocalDateTime deadline,
        Integer attendCount,
        Integer absentCount,
        String myAnswer,
        List<UserAnswerDto> users
) {}