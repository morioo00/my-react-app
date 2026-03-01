package com.example.backend.repository;

import com.example.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    // 表示範囲 [from, to) と重なるイベント
    List<Event> findByStartAtLessThanAndEndAtGreaterThan(
            LocalDateTime to,
            LocalDateTime from);
}