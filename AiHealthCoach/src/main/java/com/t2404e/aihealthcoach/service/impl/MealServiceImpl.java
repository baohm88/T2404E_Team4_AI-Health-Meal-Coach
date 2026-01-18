package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.response.MealResponse;
import com.t2404e.aihealthcoach.entity.DailyPlan;
import com.t2404e.aihealthcoach.entity.Meal;
import com.t2404e.aihealthcoach.entity.MonthlyPlan;
import com.t2404e.aihealthcoach.entity.WeeklyPlan;
import com.t2404e.aihealthcoach.enums.MealTimeSlot;
import com.t2404e.aihealthcoach.exception.ForbiddenException;
import com.t2404e.aihealthcoach.exception.ResourceNotFoundException;
import com.t2404e.aihealthcoach.repository.DailyPlanRepository;
import com.t2404e.aihealthcoach.repository.MealRepository;
import com.t2404e.aihealthcoach.repository.MonthlyPlanRepository;
import com.t2404e.aihealthcoach.repository.WeeklyPlanRepository;
import com.t2404e.aihealthcoach.service.MealService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class MealServiceImpl implements MealService {

    private final DailyPlanRepository dailyPlanRepository;
    private final MealRepository mealRepository;
    private final MonthlyPlanRepository monthlyPlanRepository;
    private final WeeklyPlanRepository weeklyPlanRepository;

    public MealServiceImpl(
            DailyPlanRepository dailyPlanRepository,
            MealRepository mealRepository, MonthlyPlanRepository monthlyPlanRepository, WeeklyPlanRepository weeklyPlanRepository
    ) {
        this.dailyPlanRepository = dailyPlanRepository;
        this.mealRepository = mealRepository;
        this.monthlyPlanRepository = monthlyPlanRepository;
        this.weeklyPlanRepository = weeklyPlanRepository;
    }


    @Override
    @Transactional
    public List<MealResponse> generateMeals(Long dailyPlanId, Long userId) {

        validateDailyPlanOwnership(dailyPlanId, userId);

        DailyPlan dailyPlan = dailyPlanRepository.findById(dailyPlanId).get();

        mealRepository.deleteByDailyPlanId(dailyPlanId);

        int totalCalories = dailyPlan.getTargetCalories();

        int breakfast = (int) Math.round(totalCalories * 0.30);
        int lunch     = (int) Math.round(totalCalories * 0.40);
        int dinner    = (int) Math.round(totalCalories * 0.25);
        int snack     = totalCalories - breakfast - lunch - dinner;

        createMeal(dailyPlanId, MealTimeSlot.BREAKFAST, breakfast,
                "Light meal with protein and fiber");

        createMeal(dailyPlanId, MealTimeSlot.LUNCH, lunch,
                "Balanced meal with protein, carbs, vegetables");

        createMeal(dailyPlanId, MealTimeSlot.DINNER, dinner,
                "Light dinner, avoid late heavy carbs");

        createMeal(dailyPlanId, MealTimeSlot.SNACK, snack,
                "Healthy snack if needed");

        return getMeals(dailyPlanId, userId);
    }


    private void createMeal(
            Long dailyPlanId,
            MealTimeSlot slot,
            int calories,
            String note
    ) {
        mealRepository.save(
                Meal.builder()
                        .dailyPlanId(dailyPlanId)
                        .timeSlot(slot)
                        .recommendedCalories(calories)
                        .note(note)
                        .build()
        );
    }


    @Override
    public List<MealResponse> getMeals(Long dailyPlanId, Long userId) {

        validateDailyPlanOwnership(dailyPlanId, userId);

        return mealRepository
                .findByDailyPlanIdOrderByTimeSlotAsc(dailyPlanId)
                .stream()
                .map(meal -> MealResponse.builder()
                        .timeSlot(meal.getTimeSlot())
                        .recommendedCalories(meal.getRecommendedCalories())
                        .note(meal.getNote())
                        .build()
                )
                .toList();
    }


    private void validateDailyPlanOwnership(Long dailyPlanId, Long userId) {

        DailyPlan dailyPlan = dailyPlanRepository.findById(dailyPlanId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Daily plan not found"));

        WeeklyPlan weeklyPlan = weeklyPlanRepository.findById(dailyPlan.getWeeklyPlanId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Weekly plan not found"));

        MonthlyPlan monthlyPlan = monthlyPlanRepository.findById(weeklyPlan.getMonthlyPlanId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Monthly plan not found"));

        if (!monthlyPlan.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not allowed to access this resource");
        }
    }

}
