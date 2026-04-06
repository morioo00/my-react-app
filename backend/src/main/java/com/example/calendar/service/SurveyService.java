package com.example.backend.service;

import com.example.backend.entity.SurveyAnswer;
import com.example.backend.repository.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SurveyService {

    @Autowired
    private SurveyRepository surveyRepository;

    public int getAttendCount(Long eventId) {
        return surveyRepository.countAttend(eventId);
    }

    public int getAbsentCount(Long eventId) {
        return surveyRepository.countAbsent(eventId);
    }

    public List<Map<String, String>> getUsers(Long eventId) {
        return surveyRepository.findByEventId(eventId)
                .stream()
                .map(s -> Map.of(
                        "email", s.getUser().getEmail(),
                        "answer", s.getAnswer()
                ))
                .toList();
    }
}