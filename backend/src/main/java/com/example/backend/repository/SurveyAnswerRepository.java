import org.springframework.security.oauth2.jwt.Jwt;

Optional<SurveyAnswer> findByEventIdAndUserId(Long eventId, Long userId);
List<SurveyAnswer> findByEventId(Long eventId);