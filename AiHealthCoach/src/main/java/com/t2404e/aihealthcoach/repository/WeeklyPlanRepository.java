package com.t2404e.aihealthcoach.repository;

import com.t2404e.aihealthcoach.entity.WeeklyPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeeklyPlanRepository extends JpaRepository<WeeklyPlan, Long> {

    List<WeeklyPlan> findByMonthlyPlanIdOrderByWeekIndexAsc(Long monthlyPlanId);

    void deleteByMonthlyPlanId(Long monthlyPlanId);
}
