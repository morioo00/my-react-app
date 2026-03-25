package com.example.backend.repository;

import com.example.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    // 表示範囲 [from, to) と重なるイベント
    List<Event> findByStartAtLessThanAndEndAtGreaterThan(
            LocalDateTime to,
            LocalDateTime from);

    // 🔍 検索：title or memo の部分一致（開始日時：新しい順）
    @Query("""
              select e from Event e
              where lower(e.title) like lower(concat('%', :q, '%'))
                 or lower(e.memo)  like lower(concat('%', :q, '%'))
              order by e.startAt desc
            """)
    List<Event> searchByTitleOrMemo(@Param("q") String q);
}