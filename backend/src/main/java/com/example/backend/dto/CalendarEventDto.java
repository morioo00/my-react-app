package com.example.backend.dto;

import java.util.List;

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
        String deadline,
        Long attendCount,
        Long absentCount,
        String myAnswer,
        List<AttendeeDto> users
) {}