package com.example.calendar.service;

import com.example.backend.dto.UserAnswerDto;
import com.example.backend.entity.SurveyAnswer;
import com.example.calendar.repository.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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

    public List<UserAnswerDto> getUsers(Long eventId) {
        return surveyRepository.findByEventId(eventId)
                .stream()
                .map(s -> new UserAnswerDto(
                        s.getUser().getEmail(),
                        s.getAnswer()))
                .toList();
    }

    public String getMyAnswer(Long eventId, String email) {
        return surveyRepository.findByEventId(eventId)
                .stream()
                .filter(s -> s.getUser().getEmail().equals(email))
                .map(SurveyAnswer::getAnswer)
                .findFirst()
                .orElse(null);
    }
}