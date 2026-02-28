package com.example.backend.controller;

import com.example.backend.dto.CalendarEventDto;
import com.example.backend.entity.Event;
import com.example.backend.repository.EventRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventRepository repo;

    public EventController(EventRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Event create(@RequestBody Event event) {
        // 最初はバリデーション無しで保存だけ通す
        return repo.save(event);
    }

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
                        e.getEndAt().toString()))
                .toList();
    }
}