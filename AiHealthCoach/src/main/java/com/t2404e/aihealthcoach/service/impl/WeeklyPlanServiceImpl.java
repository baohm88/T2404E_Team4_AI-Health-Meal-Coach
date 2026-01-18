package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.response.WeeklyPlanResponse;
import com.t2404e.aihealthcoach.entity.MonthlyPlan;
import com.t2404e.aihealthcoach.entity.WeeklyPlan;
import com.t2404e.aihealthcoach.exception.ForbiddenException;
import com.t2404e.aihealthcoach.exception.ResourceNotFoundException;
import com.t2404e.aihealthcoach.repository.MonthlyPlanRepository;
import com.t2404e.aihealthcoach.repository.WeeklyPlanRepository;
import com.t2404e.aihealthcoach.service.WeeklyPlanService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WeeklyPlanServiceImpl implements WeeklyPlanService {

    private final MonthlyPlanRepository monthlyPlanRepository;
    private final WeeklyPlanRepository weeklyPlanRepository;

    public WeeklyPlanServiceImpl(
            MonthlyPlanRepository monthlyPlanRepository,
            WeeklyPlanRepository weeklyPlanRepository
    ) {
        this.monthlyPlanRepository = monthlyPlanRepository;
        this.weeklyPlanRepository = weeklyPlanRepository;
    }

    @Override
    @Transactional
    public List<WeeklyPlanResponse> generateWeeklyPlans(Long monthlyPlanId,  Long userId) {
        validateMonthlyPlanOwnership(monthlyPlanId, userId);

        MonthlyPlan monthlyPlan = monthlyPlanRepository.findById(monthlyPlanId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Monthly plan not found"));

        // Clear old weekly plans
        weeklyPlanRepository.deleteByMonthlyPlanId(monthlyPlanId);

        double weeklyWeight = monthlyPlan.getTargetWeightChange() / 4.0;

        for (int week = 1; week <= 4; week++) {

            WeeklyPlan wp = WeeklyPlan.builder()
                    .monthlyPlanId(monthlyPlanId)
                    .weekIndex(week)
                    .targetWeightChange(
                            Math.round(weeklyWeight * 10.0) / 10.0
                    )
                    .dailyCalories(monthlyPlan.getDailyCalories())
                    .note("Focus on consistency and recovery")
                    .build();

            weeklyPlanRepository.save(wp);
        }

        return getWeeklyPlans(monthlyPlanId,  userId);
    }

    @Override
    public List<WeeklyPlanResponse> getWeeklyPlans(Long monthlyPlanId,  Long userId) {
        validateMonthlyPlanOwnership(monthlyPlanId, userId);

        return weeklyPlanRepository
                .findByMonthlyPlanIdOrderByWeekIndexAsc(monthlyPlanId)
                .stream()
                .map(wp -> WeeklyPlanResponse.builder()
                        .weekIndex(wp.getWeekIndex())
                        .targetWeightChange(wp.getTargetWeightChange())
                        .dailyCalories(wp.getDailyCalories())
                        .note(wp.getNote())
                        .build()
                )
                .toList();
    }

    private void validateMonthlyPlanOwnership(Long monthlyPlanId, Long userId) {

        MonthlyPlan monthlyPlan = monthlyPlanRepository.findById(monthlyPlanId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Monthly plan not found"));

        if (!monthlyPlan.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not allowed to access this resource");
        }
    }

}
