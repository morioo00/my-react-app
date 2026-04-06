package com.example.backend.repository;

import com.example.backend.entity.SurveyAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SurveyAnswerRepository extends JpaRepository<SurveyAnswer, Long> {

    long countByEventIdAndAnswer(Long eventId, String answer);
    
    Optional<SurveyAnswer> findByEventIdAndUserId(Long eventId, Long userId);

    List<SurveyAnswer> findByEventId(Long eventId);
}