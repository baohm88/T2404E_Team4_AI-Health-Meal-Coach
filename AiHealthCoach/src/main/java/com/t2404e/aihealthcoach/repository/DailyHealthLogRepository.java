package com.t2404e.aihealthcoach.repository;

import com.t2404e.aihealthcoach.entity.DailyHealthLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyHealthLogRepository extends JpaRepository<DailyHealthLog, Long> {
}
