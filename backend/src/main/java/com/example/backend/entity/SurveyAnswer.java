package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "survey_answers")
public class SurveyAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // イベント
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    // ユーザー
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 回答（参加する / 参加しない）
    private String answer;

    // ===== getter/setter =====
    public Long getId() { return id; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
}