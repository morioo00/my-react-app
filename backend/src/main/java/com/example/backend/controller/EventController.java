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
import com.example.backend.entity.User;

import org.springframework.security.oauth2.jwt.Jwt;
import com.example.backend.repository.SurveyAnswerRepository;
import com.example.backend.dto.AttendeeDto;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventRepository repo;
    private final UserRepository userRepository;
    private final SurveyAnswerRepository surveyAnswerRepository;

    public EventController(
        EventRepository repo,
        UserRepository userRepository,
        SurveyAnswerRepository surveyAnswerRepository) {

    this.repo = repo;
    this.userRepository = userRepository;
    this.surveyAnswerRepository = surveyAnswerRepository;
}

    // =========================
    // イベント作成
    // =========================

    @PostMapping
    public EventResponseDto create(@RequestBody Event event, Authentication auth) {

        System.out.println("===== CREATE DEBUG =====");
    System.out.println("title=" + event.getTitle());
    System.out.println("startAt=" + event.getStartAt());
    System.out.println("endAt=" + event.getEndAt());
    System.out.println("isSurvey=" + event.getIsSurvey());
    System.out.println("surveyOptions=" + event.getSurveyOptions());
    System.out.println("deadline=" + event.getDeadline());
    System.out.println("===== DEBUG END =====");

        if (event.getIsSurvey() == null) {
    event.setIsSurvey(false);
}

if (!event.getIsSurvey()) {
    event.setSurveyContent(null);
    event.setSurveyOptions(null);
    event.setDeadline(null);
}

        Jwt jwt = (Jwt) auth.getPrincipal();

        String sub = jwt.getSubject(); // ここ追加
        String email = jwt.getClaim("email"); // ここ既存の意味を変更して活用

        var user = userRepository.findBySupabaseUserId(sub) // ここ変更
                .orElseGet(() -> {
                    User newUser = new User(); // ここ追加
                    newUser.setSupabaseUserId(sub); // ここ追加
                    newUser.setEmail(email); // ここ追加
                    return userRepository.save(newUser); // ここ追加
                });

        event.setAuthor(user);

        Event saved = repo.save(event);

        return new EventResponseDto(
                saved.getId(),
                saved.getTitle(),
                saved.getMemo(),
                saved.getStartAt(),
                saved.getEndAt(),
                saved.getAuthor() != null ? saved.getAuthor().getEmail() : null,
                saved.getIsSurvey(),
                saved.getSurveyContent(),
                saved.getSurveyOptions(),
                saved.getDeadline()
        );
    }

    // =========================
    // イベント取得（カレンダー表示）
    // =========================
    @GetMapping
public List<CalendarEventDto> list(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
        Authentication auth // ← 追加🔥
) {

    Jwt jwt = (Jwt) auth.getPrincipal();
    String sub = jwt.getSubject();

    User user = userRepository.findBySupabaseUserId(sub).orElse(null);

    return repo.findByStartAtLessThanAndEndAtGreaterThan(to, from)
            .stream()
            .map(e -> {

                // 👇 回答数
                Long attendCount = surveyAnswerRepository
                        .countByEventIdAndAnswer(e.getId(), "参加する");

                Long absentCount = surveyAnswerRepository
                        .countByEventIdAndAnswer(e.getId(), "参加しない");

                // 👇 自分の回答
                String myAnswer = null;
                if (user != null) {
                    myAnswer = surveyAnswerRepository
                            .findByEventIdAndUserId(e.getId(), user.getId())
                            .map(a -> a.getAnswer())
                            .orElse(null);
                }

                var users = surveyAnswerRepository
                    .findByEventId(e.getId())
                    .stream()
                    .map(a -> new AttendeeDto(
                            a.getUser().getEmail(),
                            convertStatus(a.getAnswer()),
                            a.getAnswer()
                    ))
                    .toList();

                return new CalendarEventDto(
                        String.valueOf(e.getId()),
                        e.getTitle(),
                        e.getStartAt().toString(),
                        e.getEndAt().toString(),
                        e.getAuthor() != null ? e.getAuthor().getEmail() : null,
                        e.getMemo(),
                        e.getIsSurvey(),
                        e.getSurveyContent(),
                        e.getSurveyOptions(),
                        e.getDeadline() != null ? e.getDeadline().toString() : null,

                        attendCount,
                        absentCount,
                        myAnswer,
                        users
                );
            })
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
                        e.getAuthor() != null ? e.getAuthor().getEmail() : null,
                        e.getMemo(),
                        e.getIsSurvey(),
                        e.getSurveyContent(),
                        e.getSurveyOptions(),
                        e.getDeadline() != null ? e.getDeadline().toString() : null,

                        0L,     // ← 仮でOK（後で集計）
                        0L,     // ← 仮でOK
                        null,  // ← 自分の回答
                        List.of()
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

        event.setIsSurvey(updatedEvent.getIsSurvey());
        event.setSurveyContent(updatedEvent.getSurveyContent());
        event.setSurveyOptions(updatedEvent.getSurveyOptions());
        event.setDeadline(updatedEvent.getDeadline());

        Event saved = repo.save(event);

        return new EventResponseDto(
                saved.getId(),
                saved.getTitle(),
                saved.getMemo(),
                saved.getStartAt(),
                saved.getEndAt(),
                saved.getAuthor() != null ? saved.getAuthor().getEmail() : null,
                saved.getIsSurvey(),
                saved.getSurveyContent(),
                saved.getSurveyOptions(),
                saved.getDeadline()
        );
    }

    // =========================
    // イベント削除
    // =========================
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {

        Event event = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        repo.delete(event);
    }

    @PostMapping("/{eventId}/answer")
public void answer(
        @PathVariable Long eventId,
        @RequestBody java.util.Map<String, String> body,
        Authentication auth) {

    Jwt jwt = (Jwt) auth.getPrincipal();
    String sub = jwt.getSubject();

    User user = userRepository.findBySupabaseUserId(sub)
            .orElseThrow();

    Event event = repo.findById(eventId)
            .orElseThrow();

    String answerValue = body.get("answer");

    // 既存回答チェック（あれば更新）
    var answer = surveyAnswerRepository
            .findByEventIdAndUserId(eventId, user.getId())
            .orElse(new com.example.backend.entity.SurveyAnswer());

    answer.setEvent(event);
    answer.setUser(user);
    answer.setAnswer(answerValue);

    surveyAnswerRepository.save(answer);
}

@GetMapping("/{eventId}/attendees")
public List<AttendeeDto> getAttendees(@PathVariable Long eventId) {

    List<User> users = userRepository.findAll();

    return users.stream().map(user -> {

        var answer = surveyAnswerRepository
                .findByEventIdAndUserId(eventId, user.getId())
                .orElse(null);

        return new AttendeeDto(
                user.getEmail(),
                answer != null ? convertStatus(answer.getAnswer()) : "NO_RESPONSE",
                answer != null ? answer.getAnswer() : null
        );
    }).toList();
}

private String convertStatus(String answer) {
    if ("参加する".equals(answer)) return "ATTEND";
    if ("参加しない".equals(answer)) return "ABSENT";
    return "UNKNOWN";
}
}