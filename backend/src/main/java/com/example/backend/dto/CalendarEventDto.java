package com.example.backend.dto;

public record CalendarEventDto(
                String id,
                String title,
                String start,
                String end,
                String authorUsername) {
}