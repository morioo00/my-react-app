package com.example.backend.controller;

import com.example.backend.dto.AttendeeDto;
import com.example.backend.dto.CalendarEventDto;
import com.example.backend.dto.EventResponseDto;
import com.example.backend.entity.Event;
import com.example.backend.entity.User;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.SurveyAnswerRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus; // ここ追加
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException; // ここ追加

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
        String sub = jwt.getSubject();
        String email = jwt.getClaim("email");

        User user = userRepository.findBySupabaseUserId(sub)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setSupabaseUserId(sub);
                    newUser.setEmail(email);
                    return userRepository.save(newUser);
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
                saved.getDeadline());
    }

    // =========================
    // イベント取得（カレンダー表示）
    // =========================
    @GetMapping
    public List<CalendarEventDto> list(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            Authentication auth) {

        Jwt jwt = (Jwt) auth.getPrincipal();
        String sub = jwt.getSubject();

        User user = userRepository.findBySupabaseUserId(sub).orElse(null);

        return repo.findByStartAtLessThanAndEndAtGreaterThan(to, from)
                .stream()
                .map(e -> {

                    Long attendCount = surveyAnswerRepository
                            .countByEventIdAndAnswer(e.getId(), "参加する");

                    Long absentCount = surveyAnswerRepository
                            .countByEventIdAndAnswer(e.getId(), "参加しない");

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
                                    a.getAnswer()))
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
                            users);
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
                        0L,
                        0L,
                        null,
                        List.of()))
                .toList();
    }

    // =========================
    // イベント更新
    // 投稿者本人のみ更新可能
    // =========================
    @PutMapping("/{id}")
    public EventResponseDto updateEvent(
            @PathVariable Long id,
            @RequestBody Event updatedEvent,
            Authentication auth) {

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

        // ===== 確認ログ =====
        System.out.println("===== UPDATE OWNER CHECK =====");
        System.out.println("event.id = " + event.getId());
        System.out.println("event.author.id = " +
                (event.getAuthor() != null ? event.getAuthor().getId() : null));
        System.out.println("event.author.email = " +
                (event.getAuthor() != null ? event.getAuthor().getEmail() : null));
        System.out.println("event.author.supabaseUserId = " +
                (event.getAuthor() != null ? event.getAuthor().getSupabaseUserId() : null));
        System.out.println("currentUser.id = " + currentUser.getId());
        System.out.println("currentUser.email = " + currentUser.getEmail());
        System.out.println("currentUser.supabaseUserId = " + currentUser.getSupabaseUserId());
        System.out.println("jwt sub = " + sub);
        System.out.println("===== END OWNER CHECK =====");

        // ===== author nullチェック =====
        if (event.getAuthor() == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "イベントに作成者が設定されていません");
        }

        // ===== 所有者チェック =====
        if (!event.getAuthor().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "自分が作成したイベントのみ更新できます");
        }

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
                saved.getDeadline());
    }

    // =========================
    // イベント削除
    // 投稿者本人のみ削除可能
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

        // ===== 確認ログ =====
        System.out.println("===== DELETE OWNER CHECK =====");
        System.out.println("event.id = " + event.getId());
        System.out.println("event.author.id = " +
                (event.getAuthor() != null ? event.getAuthor().getId() : null));
        System.out.println("event.author.email = " +
                (event.getAuthor() != null ? event.getAuthor().getEmail() : null));
        System.out.println("currentUser.id = " + currentUser.getId());
        System.out.println("currentUser.email = " + currentUser.getEmail());
        System.out.println("currentUser.supabaseUserId = " + currentUser.getSupabaseUserId());
        System.out.println("jwt sub = " + sub);
        System.out.println("===== END DELETE OWNER CHECK =====");

        // ===== author nullチェック =====
        if (event.getAuthor() == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "イベントに作成者が設定されていません");
        }

        // ===== 所有者チェック =====
        if (!event.getAuthor().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "自分が作成したイベントのみ削除できます");
        }

        repo.delete(event);
    }

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
                    answer != null ? answer.getAnswer() : null);
        }).toList();
    }

    private String convertStatus(String answer) {
        if ("参加する".equals(answer))
            return "ATTEND";
        if ("参加しない".equals(answer))
            return "ABSENT";
        return "UNKNOWN";
    }
}