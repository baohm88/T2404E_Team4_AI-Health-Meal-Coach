package com.t2404e.aihealthcoach.repository;

import com.t2404e.aihealthcoach.entity.DailyPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DailyPlanRepository extends JpaRepository<DailyPlan, Long> {

    List<DailyPlan> findByWeeklyPlanIdOrderByDayIndexAsc(Long weeklyPlanId);

    void deleteByWeeklyPlanId(Long weeklyPlanId);
}
