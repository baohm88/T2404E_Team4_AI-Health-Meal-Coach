package com.t2404e.aihealthcoach.repository;

import com.t2404e.aihealthcoach.entity.PlannedMeal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PlannedMealRepository extends JpaRepository<PlannedMeal, Long> {
    List<PlannedMeal> findByMealPlanIdOrderByDayNumberAsc(Long mealPlanId);

    List<PlannedMeal> findByMealPlanId(Long mealPlanId);

    List<PlannedMeal> findByMealPlanIdAndDayNumber(Long mealPlanId, Integer dayNumber);

    @Modifying
    @Transactional
    void deleteByMealPlanId(Long mealPlanId);
}
