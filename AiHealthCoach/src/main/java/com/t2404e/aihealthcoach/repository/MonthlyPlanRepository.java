package com.t2404e.aihealthcoach.repository;

import com.t2404e.aihealthcoach.entity.MonthlyPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MonthlyPlanRepository extends JpaRepository<MonthlyPlan, Long> {

    List<MonthlyPlan> findByUserIdOrderByMonthIndexAsc(Long userId);

    void deleteByUserId(Long userId);

    Optional<MonthlyPlan> findById(Long id);
}
