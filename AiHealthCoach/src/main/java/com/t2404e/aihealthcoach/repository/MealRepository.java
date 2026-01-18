package com.t2404e.aihealthcoach.repository;

import com.t2404e.aihealthcoach.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {

    List<Meal> findByDailyPlanIdOrderByTimeSlotAsc(Long dailyPlanId);

    void deleteByDailyPlanId(Long dailyPlanId);
}
