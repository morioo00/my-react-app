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

        // 🔵 イベント作成（ログインユーザーを author に紐づけ）
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
                                saved.getAuthor().getUsername());
        }

        // 🔵 イベント取得（ログインユーザー全員閲覧可）
        @GetMapping
        public List<CalendarEventDto> list(
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {

                return repo.findByStartAtLessThanAndEndAtGreaterThan(to, from)
                                .stream()
                                .map(e -> new CalendarEventDto(
                                                String.valueOf(e.getId()),
                                                e.getTitle(),
                                                e.getStartAt().toString(),
                                                e.getEndAt().toString(),
                                                e.getAuthor() != null ? e.getAuthor().getUsername() : null,
                                                e.getMemo()))
                                .toList();
        }

        // 🔍 イベント検索（title + memo 部分一致、開始日時 新しい順）
        @GetMapping("/search")
        public List<CalendarEventDto> search(@RequestParam String keyword) {

                if (keyword == null || keyword.isBlank())
                        return List.of();

                return repo.searchByTitleOrMemo(keyword.trim())
                                .stream()
                                .map(e -> new CalendarEventDto(
                                                String.valueOf(e.getId()),
                                                e.getTitle(),
                                                e.getStartAt().toString(),
                                                e.getEndAt().toString(),
                                                e.getAuthor() != null ? e.getAuthor().getUsername() : null,
                                                e.getMemo()))
                                .toList();
        }
}