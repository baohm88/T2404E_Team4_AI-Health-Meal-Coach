package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.response.DailyPlanResponse;
import com.t2404e.aihealthcoach.entity.DailyPlan;
import com.t2404e.aihealthcoach.entity.WeeklyPlan;
import com.t2404e.aihealthcoach.exception.ResourceNotFoundException;
import com.t2404e.aihealthcoach.repository.DailyPlanRepository;
import com.t2404e.aihealthcoach.repository.WeeklyPlanRepository;
import com.t2404e.aihealthcoach.service.DailyPlanService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DailyPlanServiceImpl implements DailyPlanService {

    private final WeeklyPlanRepository weeklyPlanRepository;
    private final DailyPlanRepository dailyPlanRepository;

    public DailyPlanServiceImpl(
            WeeklyPlanRepository weeklyPlanRepository,
            DailyPlanRepository dailyPlanRepository
    ) {
        this.weeklyPlanRepository = weeklyPlanRepository;
        this.dailyPlanRepository = dailyPlanRepository;
    }

    @Override
    @Transactional
    public List<DailyPlanResponse> generateDailyPlans(Long weeklyPlanId) {

        WeeklyPlan weeklyPlan = weeklyPlanRepository.findById(weeklyPlanId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Weekly plan not found"));

        dailyPlanRepository.deleteByWeeklyPlanId(weeklyPlanId);

        int calories = weeklyPlan.getDailyCalories();
        LocalDate startDate = LocalDate.now();

        for (int day = 1; day <= 7; day++) {

            DailyPlan dp = DailyPlan.builder()
                    .weeklyPlanId(weeklyPlanId)
                    .dayIndex(day)
                    .planDate(startDate.plusDays(day - 1))
                    .targetCalories(calories)
                    .note("Maintain calorie target and stay active")
                    .build();

            dailyPlanRepository.save(dp);
        }

        return getDailyPlans(weeklyPlanId);
    }

    @Override
    public List<DailyPlanResponse> getDailyPlans(Long weeklyPlanId) {

        return dailyPlanRepository
                .findByWeeklyPlanIdOrderByDayIndexAsc(weeklyPlanId)
                .stream()
                .map(dp -> DailyPlanResponse.builder()
                        .dayIndex(dp.getDayIndex())
                        .planDate(dp.getPlanDate())
                        .targetCalories(dp.getTargetCalories())
                        .note(dp.getNote())
                        .build()
                )
                .toList();
    }
}
