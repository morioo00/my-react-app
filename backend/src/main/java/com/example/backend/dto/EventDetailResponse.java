package com.example.backend.dto;

import java.util.List;

public class EventDetailResponse {

    public Long id;
    public String title;
    public String start;
    public String end;
    public String authorUsername;
    public String memo;

    public Boolean isSurvey;
    public String surveyContent;
    public String surveyOptions;
    public String deadline;

    public int attendCount;
    public int absentCount;
    public String myAnswer;

    public List<UserAnswerDto> users;
}