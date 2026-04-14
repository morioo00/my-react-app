package com.example.calendar.service;

import com.example.backend.dto.EventResponseDto;
import com.example.backend.dto.UserAnswerDto;
import com.example.backend.entity.Event;
import com.example.backend.entity.User;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private SurveyService surveyService;

    @Autowired
    private UserRepository userRepository;

    private void validateEventTime(LocalDateTime startAt, LocalDateTime endAt) {

    if (startAt == null || endAt == null) {
        throw new IllegalArgumentException("開始時間と終了時間は必須です");
    }

    if (!endAt.isAfter(startAt)) {
        throw new IllegalArgumentException("終了時間は開始時間より後にしてください");
    }
}

    // =========================
    // ① イベント一覧
    // =========================
    public List<EventResponseDto> getEvents(LocalDateTime from, LocalDateTime to, String loginUserEmail) {

        List<Event> events = eventRepository.findByStartAtLessThanAndEndAtGreaterThan(to, from);

        return events.stream().map(event -> {

            int attendCount = surveyService.getAttendCount(event.getId());
            int absentCount = surveyService.getAbsentCount(event.getId());
            List<UserAnswerDto> users = surveyService.getUsers(event.getId());
            String myAnswer = surveyService.getMyAnswer(event.getId(), loginUserEmail);

            return new EventResponseDto(
                    event.getId(),
                    event.getTitle(),
                    event.getMemo(),
                    event.getStartAt(),
                    event.getEndAt(),
                    event.getAuthor() != null ? event.getAuthor().getEmail() : null,
                    event.getIsSurvey(),
                    event.getSurveyContent(),
                    event.getSurveyOptions(),
                    event.getDeadline(),
                    attendCount,
                    absentCount,
                    myAnswer,
                    users);

        }).toList();
    }

    // =========================
    // ② 作成
    // =========================
    public EventResponseDto createEvent(Event event, Authentication auth) {

        validateEventTime(event.getStartAt(), event.getEndAt()); 

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

        Event saved = eventRepository.save(event);

        return new EventResponseDto(
                saved.getId(),
                saved.getTitle(),
                saved.getMemo(),
                saved.getStartAt(),
                saved.getEndAt(),
                email,
                saved.getIsSurvey(),
                saved.getSurveyContent(),
                saved.getSurveyOptions(),
                saved.getDeadline(),
                0,
                0,
                null,
                List.of());
    }

    // =========================
    // ③ 更新
    // =========================
    public EventResponseDto updateEvent(Long id, Event updatedEvent, Authentication auth) {

        if (id == null) { // ここ追加
            throw new IllegalArgumentException("id is null");
        }

            validateEventTime(updatedEvent.getStartAt(), updatedEvent.getEndAt()); 
    
            Jwt jwt = (Jwt) auth.getPrincipal();
            String sub = jwt.getSubject();
    
            User user = userRepository.findBySupabaseUserId(sub)
                    .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // ===== 更新処理 =====
        event.setTitle(updatedEvent.getTitle());
        event.setMemo(updatedEvent.getMemo());
        event.setStartAt(updatedEvent.getStartAt());
        event.setEndAt(updatedEvent.getEndAt());
        event.setIsSurvey(updatedEvent.getIsSurvey());
        event.setSurveyContent(updatedEvent.getSurveyContent());
        event.setSurveyOptions(updatedEvent.getSurveyOptions());
        event.setDeadline(updatedEvent.getDeadline());

        Event saved = eventRepository.save(event);

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
                saved.getDeadline(),
                0,
                0,
                null,
                List.of());
    }
}