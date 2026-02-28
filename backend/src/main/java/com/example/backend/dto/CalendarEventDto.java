package com.example.backend.dto;

public record CalendarEventDto( // ひな型、フォーマット
        String id,
        String title,
        String start,
        String end) {
}