package com.example.backend.dto;

public record CalendarEventDto(
        String id,
        String title,
        String start,
        String end,
        String authorUsername,
        String memo,
        Boolean isSurvey,
        String surveyContent,
        String surveyOptions,
        String deadline
) {}