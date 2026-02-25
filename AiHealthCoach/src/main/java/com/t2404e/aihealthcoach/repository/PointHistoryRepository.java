package com.t2404e.aihealthcoach.repository;

import com.t2404e.aihealthcoach.entity.PointHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PointHistoryRepository extends JpaRepository<PointHistory, Long> {
    Page<PointHistory> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<PointHistory> findByUserIdAndCreatedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
