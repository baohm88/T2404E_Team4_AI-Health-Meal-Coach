package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.request.WeeklyAdjustmentRequest;
import com.t2404e.aihealthcoach.dto.response.WeeklyAdjustmentResponse;
import com.t2404e.aihealthcoach.dto.response.WeeklyPlanResponse;
import com.t2404e.aihealthcoach.entity.DailyPlan;
import com.t2404e.aihealthcoach.entity.MonthlyPlan;
import com.t2404e.aihealthcoach.entity.User;
import com.t2404e.aihealthcoach.entity.WeeklyPlan;
import com.t2404e.aihealthcoach.exception.ForbiddenException;
import com.t2404e.aihealthcoach.exception.ResourceNotFoundException;
import com.t2404e.aihealthcoach.repository.DailyPlanRepository;
import com.t2404e.aihealthcoach.repository.MonthlyPlanRepository;
import com.t2404e.aihealthcoach.repository.UserRepository;
import com.t2404e.aihealthcoach.repository.WeeklyPlanRepository;
import com.t2404e.aihealthcoach.service.WeeklyPlanService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WeeklyPlanServiceImpl implements WeeklyPlanService {

    private final MonthlyPlanRepository monthlyPlanRepository;
    private final WeeklyPlanRepository weeklyPlanRepository;
    private final DailyPlanRepository dailyPlanRepository;
    private final UserRepository userRepository;

    public WeeklyPlanServiceImpl(
            MonthlyPlanRepository monthlyPlanRepository,
            WeeklyPlanRepository weeklyPlanRepository, DailyPlanRepository dailyPlanRepository,
            UserRepository userRepository) {
        this.monthlyPlanRepository = monthlyPlanRepository;
        this.weeklyPlanRepository = weeklyPlanRepository;
        this.dailyPlanRepository = dailyPlanRepository;
        this.userRepository = userRepository;
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

        return getWeeklyPlans(monthlyPlanId, userId);
    }

    @Override
    public List<WeeklyPlanResponse> getWeeklyPlans(Long monthlyPlanId,  Long userId) {
        validateMonthlyPlanOwnership(monthlyPlanId, userId);

        requirePremium(userId);

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


    @Override
    @Transactional
    public WeeklyAdjustmentResponse adjustWeeklyPlan(
            Long weeklyPlanId,
            Long userId,
            WeeklyAdjustmentRequest request
    ) {

        WeeklyPlan weeklyPlan = weeklyPlanRepository.findById(weeklyPlanId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Weekly plan not found"));

        MonthlyPlan monthlyPlan = monthlyPlanRepository.findById(weeklyPlan.getMonthlyPlanId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Monthly plan not found"));

        if (!monthlyPlan.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not allowed to adjust this plan");
        }

        requirePremium(userId);

        int oldCalories = weeklyPlan.getDailyCalories();
        int adherence = request.getAdherenceScore();

        double rate;
        String adjustmentNote;

        if (adherence >= 80) {
            rate = 0;
            adjustmentNote = "Plan kept unchanged due to good adherence";
        } else if (adherence >= 50) {
            rate = 0.05;
            adjustmentNote = "Calories slightly increased due to medium adherence";
        } else {
            rate = 0.10;
            adjustmentNote = "Calories increased to reduce pressure due to low adherence";
        }

        int newCalories = (int) Math.round(oldCalories * (1 + rate));

        // Update weekly plan
        weeklyPlan.setDailyCalories(newCalories);
        weeklyPlan.setAdherenceScore(adherence);
        weeklyPlan.setAdjustmentNote(adjustmentNote);
        weeklyPlanRepository.save(weeklyPlan);

        // Update all daily plans of this week
        List<DailyPlan> dailyPlans =
                dailyPlanRepository.findByWeeklyPlanIdOrderByDayIndexAsc(weeklyPlanId);

        int dailyCalories = newCalories / dailyPlans.size();

        for (DailyPlan daily : dailyPlans) {
            daily.setTargetCalories(dailyCalories);
        }

        dailyPlanRepository.saveAll(dailyPlans);

        return WeeklyAdjustmentResponse.builder()
                .oldTargetCalories(oldCalories)
                .newTargetCalories(newCalories)
                .adjustmentNote(adjustmentNote)
                .build();
    }


    private void validateMonthlyPlanOwnership(Long monthlyPlanId, Long userId) {

        MonthlyPlan monthlyPlan = monthlyPlanRepository.findById(monthlyPlanId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Monthly plan not found"));

        if (!monthlyPlan.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not allowed to access this resource");
        }
    }

    private void requirePremium(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (!Boolean.TRUE.equals(user.getIsPremium())) {
            throw new ForbiddenException("Upgrade to Premium to access this feature");
        }
    }
}
