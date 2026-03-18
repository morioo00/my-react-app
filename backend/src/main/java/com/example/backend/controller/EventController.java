package com.example.backend.controller;

import com.example.backend.dto.CalendarEventDto;
import com.example.backend.dto.EventResponseDto;
import com.example.backend.entity.Event;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventRepository repo;
    private final UserRepository userRepository;

    public EventController(EventRepository repo, UserRepository userRepository) {
        this.repo = repo;
        this.userRepository = userRepository;
    }

    // =========================
    // イベント作成
    // =========================
    @PostMapping
    public EventResponseDto create(@RequestBody Event event, Authentication auth) {

        String username = auth.getName();

        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        event.setAuthor(user);

        Event saved = repo.save(event);

        return new EventResponseDto(
                saved.getId(),
                saved.getTitle(),
                saved.getMemo(),
                saved.getStartAt(),
                saved.getEndAt(),
                saved.getAuthor().getUsername()
        );
    }

    // =========================
    // イベント取得（カレンダー表示）
    // =========================
    @GetMapping
    public List<CalendarEventDto> list(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime from,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime to) {

        return repo.findByStartAtLessThanAndEndAtGreaterThan(to, from)
                .stream()
                .map(e -> new CalendarEventDto(
                        String.valueOf(e.getId()),
                        e.getTitle(),
                        e.getStartAt().toString(),
                        e.getEndAt().toString(),
                        e.getAuthor() != null ? e.getAuthor().getUsername() : null,
                        e.getMemo()
                ))
                .toList();
    }

    // =========================
    // イベント検索
    // =========================
    @GetMapping("/search")
    public List<CalendarEventDto> search(@RequestParam String keyword) {

        if (keyword == null || keyword.isBlank()) {
            return List.of();
        }

        return repo.searchByTitleOrMemo(keyword.trim())
                .stream()
                .map(e -> new CalendarEventDto(
                        String.valueOf(e.getId()),
                        e.getTitle(),
                        e.getStartAt().toString(),
                        e.getEndAt().toString(),
                        e.getAuthor() != null ? e.getAuthor().getUsername() : null,
                        e.getMemo()
                ))
                .toList();
    }

    // =========================
    // イベント更新
    // =========================
    @PutMapping("/{id}")
    public EventResponseDto updateEvent(
            @PathVariable Long id,
            @RequestBody Event updatedEvent) {

        Event event = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setTitle(updatedEvent.getTitle());
        event.setMemo(updatedEvent.getMemo());
        event.setStartAt(updatedEvent.getStartAt());
        event.setEndAt(updatedEvent.getEndAt());

        Event saved = repo.save(event);

        return new EventResponseDto(
                saved.getId(),
                saved.getTitle(),
                saved.getMemo(),
                saved.getStartAt(),
                saved.getEndAt(),
                saved.getAuthor() != null ? saved.getAuthor().getUsername() : null
        );
    }

    // =========================
    // イベント削除
    // =========================
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        repo.deleteById(id);
    }
}