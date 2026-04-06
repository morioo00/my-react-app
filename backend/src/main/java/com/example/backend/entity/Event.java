package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events", indexes = {
        @Index(name = "idx_events_start_at", columnList = "startAt"),
        @Index(name = "idx_events_end_at", columnList = "endAt")
})
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Column(nullable = false)
    private LocalDateTime startAt;

    @Column(nullable = false)
    private LocalDateTime endAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    private User author;

    // getter/setter（まずは手書きでOK）
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public LocalDateTime getStartAt() {
        return startAt;
    }

    public void setStartAt(LocalDateTime startAt) {
        this.startAt = startAt;
    }

    public LocalDateTime getEndAt() {
        return endAt;
    }

    public void setEndAt(LocalDateTime endAt) {
        this.endAt = endAt;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    @Column(name = "is_survey")
    private Boolean isSurvey;

    @Column(name = "survey_content", columnDefinition = "TEXT")
    private String surveyContent;

    @Column(name = "survey_options", columnDefinition = "TEXT")
    private String surveyOptions;

    @Column(name = "deadline")
    private LocalDateTime deadline;

    public Boolean getIsSurvey() {
    return isSurvey;
}

public void setIsSurvey(Boolean isSurvey) {
    this.isSurvey = isSurvey;
}

public String getSurveyContent() {
    return surveyContent;
}

public void setSurveyContent(String surveyContent) {
    this.surveyContent = surveyContent;
}

public String getSurveyOptions() {
    return surveyOptions;
}

public void setSurveyOptions(String surveyOptions) {
    this.surveyOptions = surveyOptions;
}

public LocalDateTime getDeadline() {
    return deadline;
}

public void setDeadline(LocalDateTime deadline) {
    this.deadline = deadline;
}

}