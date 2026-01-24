package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.ai.prompt.MealPlanPromptBuilder;
import com.t2404e.aihealthcoach.dto.response.MealPlanResponse;
import com.t2404e.aihealthcoach.dto.response.mealplan.*;
import com.t2404e.aihealthcoach.entity.*;
import com.t2404e.aihealthcoach.repository.*;
import com.t2404e.aihealthcoach.service.MealPlanService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MealPlanServiceImpl implements MealPlanService {

        private final HealthProfileRepository profileRepo;
        private final HealthAnalysisRepository analysisRepo;
        private final MealPlanRepository mealPlanRepo;
        private final PlannedMealRepository plannedMealRepo;
        private final DishLibraryRepository dishLibraryRepo;
        private final ChatClient.Builder chatClientBuilder;
        private final ObjectMapper objectMapper;

        @Override
        public MealPlanResponse generateForUser(Long userId) {
                Optional<MealPlan> existingPlan = mealPlanRepo.findByUserId(userId);
                if (existingPlan.isPresent()) {
                        plannedMealRepo.deleteByMealPlanId(existingPlan.get().getId());
                        mealPlanRepo.delete(existingPlan.get());
                        mealPlanRepo.flush();
                }

                HealthProfile profile = profileRepo.findById(userId)
                                .orElseThrow(() -> new IllegalStateException(
                                                "Vui lòng hoàn thành khảo sát sức khỏe trước khi tạo thực đơn"));

                HealthAnalysis analysis = analysisRepo.findByUserId(userId)
                                .orElseThrow(() -> new IllegalStateException(
                                                "Vui lòng hoàn thành khảo sát sức khỏe trước khi tạo thực đơn"));

                List<DishLibrary> dishes = dishLibraryRepo.findAll();
                ChatClient chatClient = chatClientBuilder.build();

                MealPlan mealPlan = MealPlan.builder()
                                .userId(userId)
                                .startDate(LocalDate.now())
                                .totalDays(90)
                                .build();
                MealPlan savedPlan = mealPlanRepo.save(mealPlan);

                // Generate in 3 chunks of 30 days to avoid token limits
                int[][] chunks = { { 1, 30 }, { 31, 60 }, { 61, 90 } };
                for (int[] chunk : chunks) {
                        String prompt = MealPlanPromptBuilder.build(profile, analysis, dishes, chunk[0], chunk[1]);
                        String rawJson = chatClient.prompt()
                                        .system(com.t2404e.aihealthcoach.ai.prompt.MealPlanPrompt.SYSTEM)
                                        .user(prompt)
                                        .call()
                                        .content();
                        // This call should be transactional to save records safely
                        parseAndSaveChunk(savedPlan, rawJson);
                }

                return convertToResponse(savedPlan);
        }

        @Transactional
        protected void parseAndSaveChunk(MealPlan plan, String rawJson) {
                try {
                        Map<String, Object> map = objectMapper.readValue(rawJson,
                                        new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {
                                        });
                        Object mealPlanObj = map.get("mealPlan");

                        if (mealPlanObj instanceof List<?> days) {
                                for (Object dayObj : days) {
                                        if (dayObj instanceof Map<?, ?> dayData) {
                                                Integer dayNum = (Integer) dayData.get("day");
                                                Object mealsObj = dayData.get("meals");

                                                if (mealsObj instanceof List<?> mealsData) {
                                                        for (Object mealObj : mealsData) {
                                                                if (mealObj instanceof Map<?, ?> mealData) {
                                                                        Long dishId = ((Number) mealData.get("dishId"))
                                                                                        .longValue();
                                                                        DishLibrary dish = dishLibraryRepo
                                                                                        .findById(dishId).orElse(null);

                                                                        PlannedMeal plannedMeal = PlannedMeal.builder()
                                                                                        .mealPlanId(plan.getId())
                                                                                        .dayNumber(dayNum)
                                                                                        .dish(dish)
                                                                                        .mealType((String) mealData
                                                                                                        .get("type"))
                                                                                        .mealName((String) mealData.get(
                                                                                                        "mealName"))
                                                                                        .quantity((String) mealData.get(
                                                                                                        "quantity"))
                                                                                        .calories(((Number) mealData
                                                                                                        .get("calories"))
                                                                                                        .intValue())
                                                                                        .build();
                                                                        plannedMealRepo.save(plannedMeal);
                                                                }
                                                        }
                                                }
                                        }
                                }
                        }
                } catch (Exception e) {
                        System.err.println("Error parsing AI Meal Plan chunk: " + e.getMessage());
                }
        }

        @Override
        public MealPlanResponse getByUserId(Long userId) {
                return mealPlanRepo.findByUserId(userId)
                                .map(this::convertToResponse)
                                .orElse(null);
        }

        @Override
        public MealPlanResponse regenerate(Long userId) {
                return generateForUser(userId);
        }

        private MealPlanResponse convertToResponse(MealPlan plan) {
                List<PlannedMeal> meals = plannedMealRepo.findByMealPlanIdOrderByDayNumberAsc(plan.getId());

                // Group by day for response
                Map<Integer, List<PlannedMeal>> groupedByDay = meals.stream()
                                .collect(Collectors.groupingBy(PlannedMeal::getDayNumber));

                List<DayPlanDTO> dayPlans = groupedByDay.entrySet().stream()
                                .map(e -> {
                                        Integer day = e.getKey();
                                        List<PlannedMeal> dayMeals = e.getValue();

                                        List<MealDTO> mealDTOs = dayMeals.stream().map(m -> MealDTO.builder()
                                                        .id(m.getId())
                                                        .mealName(m.getMealName())
                                                        .quantity(m.getQuantity())
                                                        .calories(m.getCalories())
                                                        .type(m.getMealType())
                                                        .build()).collect(Collectors.toList());

                                        return DayPlanDTO.builder()
                                                        .day(day)
                                                        .meals(mealDTOs)
                                                        .totalCalories(mealDTOs.stream().mapToInt(MealDTO::getCalories)
                                                                        .sum())
                                                        .build();
                                })
                                .sorted(Comparator.comparing(DayPlanDTO::getDay))
                                .collect(Collectors.toList());

                return MealPlanResponse.builder()
                                .startDate(plan.getStartDate())
                                .totalDays(plan.getTotalDays())
                                .mealPlan(dayPlans)
                                .build();
        }
}
