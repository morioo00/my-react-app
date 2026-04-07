package com.example.backend.controller;

import com.example.backend.dto.AttendeeDto;
import com.example.backend.dto.CalendarEventDto;
import com.example.backend.dto.EventResponseDto;
import com.example.backend.entity.Event;
import com.example.backend.entity.User;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.SurveyAnswerRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.EventService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventRepository repo;
    private final UserRepository userRepository;
    private final SurveyAnswerRepository surveyAnswerRepository;
    private final EventService eventService;

    public EventController(
            EventRepository repo,
            UserRepository userRepository,
            SurveyAnswerRepository surveyAnswerRepository,
            EventService eventService) {

        this.repo = repo;
        this.userRepository = userRepository;
        this.surveyAnswerRepository = surveyAnswerRepository;
        this.eventService = eventService;
    }

    // =========================
    // イベント作成
    // =========================
    @PostMapping
    public EventResponseDto create(@RequestBody Event event, Authentication auth) {
        return eventService.createEvent(event, auth);
    }

    // =========================
    // イベント取得（カレンダー表示）
    // =========================
    @GetMapping
    public List<EventResponseDto> list(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            Authentication auth) {

        Jwt jwt = (Jwt) auth.getPrincipal();
        String email = jwt.getClaim("email");

        return eventService.getEvents(from, to, email);
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
                        0L,
                        0L,
                        null,
                        List.of()))
                .toList();
    }

    // =========================
    // イベント更新
    // =========================
    @PutMapping("/{id}")
    public EventResponseDto updateEvent(
            @PathVariable Long id,
            @RequestBody Event updatedEvent,
            Authentication auth) {

        return eventService.updateEvent(id, updatedEvent, auth);
    }

    // =========================
    // イベント削除
    // =========================
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id, Authentication auth) {

        Event event = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Event not found"));

        Jwt jwt = (Jwt) auth.getPrincipal();
        String sub = jwt.getSubject();

        User currentUser = userRepository.findBySupabaseUserId(sub)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "ログインユーザーが見つかりません"));

        if (event.getAuthor() == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "イベントに作成者が設定されていません");
        }

        if (!event.getAuthor().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "自分が作成したイベントのみ削除できます");
        }

        repo.delete(event);
    }

    // =========================
    // アンケート回答
    // =========================
    @PostMapping("/{eventId}/answer")
    public void answer(
            @PathVariable Long eventId,
            @RequestBody Map<String, String> body,
            Authentication auth) {

        Jwt jwt = (Jwt) auth.getPrincipal();
        String sub = jwt.getSubject();

        User user = userRepository.findBySupabaseUserId(sub)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "ログインユーザーが見つかりません"));

        Event event = repo.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Event not found"));

        String answerValue = body.get("answer");

        var answer = surveyAnswerRepository
                .findByEventIdAndUserId(eventId, user.getId())
                .orElse(new com.example.backend.entity.SurveyAnswer());

        answer.setEvent(event);
        answer.setUser(user);
        answer.setAnswer(answerValue);

        surveyAnswerRepository.save(answer);
    }

    // =========================
    // 参加者一覧
    // =========================
    @GetMapping("/{eventId}/attendees")
public List<AttendeeDto> getAttendees(@PathVariable Long eventId) {

    // まずイベント取得
    Event event = repo.findById(eventId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Event not found"));

    // 新規作成イベントの場合は回答者一覧を返さない
    if (event.getIsSurvey() == null || !event.getIsSurvey()) {
        return List.of(); // 空リストを返す
    }

    List<User> users = userRepository.findAll();

    return users.stream().map(user -> {

        var answer = surveyAnswerRepository
                .findByEventIdAndUserId(eventId, user.getId())
                .orElse(null);

        return new AttendeeDto(
                user.getEmail(),
                user.getName(),
                user.getAvatarUrl(),
                answer != null ? convertStatus(answer.getAnswer()) : "NO_RESPONSE",
                answer != null ? answer.getAnswer() : null);
    }).toList();
}

    private String convertStatus(String answer) {
        if ("参加する".equals(answer)) return "ATTEND";
        if ("参加しない".equals(answer)) return "ABSENT";
        return "UNKNOWN";
    }
}