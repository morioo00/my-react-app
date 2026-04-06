package com.example.backend.repository;

import com.example.backend.entity.SurveyAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface SurveyRepository extends JpaRepository<SurveyAnswer, Long> {

    // 参加する人数
    @Query("SELECT COUNT(s) FROM SurveyAnswer s WHERE s.event.id = :eventId AND s.answer = '参加する'")
    int countAttend(Long eventId);

    // 参加しない人数
    @Query("SELECT COUNT(s) FROM SurveyAnswer s WHERE s.event.id = :eventId AND s.answer = '参加しない'")
    int countAbsent(Long eventId);

    // 全回答
    @Query("SELECT s FROM SurveyAnswer s WHERE s.event.id = :eventId")
    java.util.List<SurveyAnswer> findByEventId(Long eventId);

    Long countByEventIdAndAnswer(Long eventId, String answer);
    Optional<SurveyAnswer> findByEventIdAndUserId(Long eventId, Long userId);
}