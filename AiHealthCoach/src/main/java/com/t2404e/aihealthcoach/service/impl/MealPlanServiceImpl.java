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
        private final UserMealLogRepository logRepo;
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

                List<DishLibrary> dishes = dishLibraryRepo.findByIsVerifiedTrueAndIsDeletedFalse();
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

                                                                        String category = (String) mealData
                                                                                        .get("category");
                                                                        if (category == null) {
                                                                                category = (String) mealData
                                                                                                .get("type");
                                                                        }
                                                                        // Ưu tiên lấy category từ DishLibrary nếu có
                                                                        if (dish != null && dish
                                                                                        .getCategory() != null) {
                                                                                category = dish.getCategory().name();
                                                                        }
                                                                        category = mapToVietnameseCategory(category);

                                                                        PlannedMeal plannedMeal = PlannedMeal.builder()
                                                                                        .mealPlanId(plan.getId())
                                                                                        .dayNumber(dayNum)
                                                                                        .dish(dish)
                                                                                        .category(category)
                                                                                        .mealName((String) mealData.get(
                                                                                                        "mealName"))
                                                                                        .quantity((String) mealData.get(
                                                                                                        "quantity"))
                                                                                        .calories(((Number) mealData
                                                                                                        .get("calories"))
                                                                                                        .intValue())
                                                                                        .build();
                                                                        PlannedMeal savedPlannedMeal = plannedMealRepo
                                                                                        .save(plannedMeal);

                                                                        // 4. Đồng bộ sang UserMealLog
                                                                        UserMealLog log = UserMealLog.builder()
                                                                                        .userId(plan.getUserId())
                                                                                        .plannedMealId(savedPlannedMeal
                                                                                                        .getId())
                                                                                        .dishId(dish != null
                                                                                                        ? dish.getId()
                                                                                                        : null)
                                                                                        .foodName(savedPlannedMeal
                                                                                                        .getMealName())
                                                                                        .estimatedCalories(
                                                                                                        savedPlannedMeal.getCalories())
                                                                                        .dayNumber(dayNum)
                                                                                        .category(savedPlannedMeal
                                                                                                        .getCategory())
                                                                                        .checkedIn(false)
                                                                                        .isPlanCompliant(true)
                                                                                        .loggedAt(plan.getStartDate()
                                                                                                        .atStartOfDay()
                                                                                                        .plusDays(dayNum - 1))
                                                                                        .build();
                                                                        logRepo.save(log);
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
                List<UserMealLog> logs = logRepo.findByUserIdOrderByLoggedAtAsc(plan.getUserId());

                // Group by day number
                Map<Integer, List<UserMealLog>> groupedByDay = logs.stream()
                                .filter(l -> l.getDayNumber() != null)
                                .collect(Collectors.groupingBy(UserMealLog::getDayNumber));

                List<DayPlanDTO> dayPlans = groupedByDay.entrySet().stream()
                                .map(e -> {
                                        Integer day = e.getKey();
                                        List<UserMealLog> dayLogs = e.getValue();

                                        // Chỉ lấy bản ghi mới nhất cho mỗi category trong ngày
                                        Map<String, UserMealLog> uniqueLogs = new LinkedHashMap<>();
                                        for (UserMealLog log : dayLogs) {
                                                String cat = log.getCategory();
                                                if (cat == null)
                                                        cat = "Phụ";
                                                // mapToVietnameseCategory(cat) để đồng bộ key
                                                uniqueLogs.put(mapToVietnameseCategory(cat), log);
                                        }

                                        List<MealDTO> mealDTOs = uniqueLogs.values().stream().map(l -> MealDTO.builder()
                                                        .id(l.getId())
                                                        .mealName(l.getFoodName())
                                                        .quantity("")
                                                        .calories(l.getEstimatedCalories())
                                                        .type(mapToVietnameseCategory(l.getCategory()))
                                                        .checkedIn(l.getCheckedIn())
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

        private String mapToVietnameseCategory(String category) {
                if (category == null)
                        return "Phụ";
                return switch (category.toUpperCase()) {
                        case "BREAKFAST", "SÁNG" -> "Sáng";
                        case "LUNCH", "TRƯA" -> "Trưa";
                        case "DINNER", "TỐI" -> "Tối";
                        case "SNACK", "PHỤ" -> "Phụ";
                        default -> category;
                };
        }
}
