package com.t2404e.aihealthcoach.service.impl;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.t2404e.aihealthcoach.ai.prompt.MealPlanPromptBuilder;
import com.t2404e.aihealthcoach.dto.response.MealPlanResponse;
import com.t2404e.aihealthcoach.dto.response.mealplan.DayPlanDTO;
import com.t2404e.aihealthcoach.dto.response.mealplan.MealDTO;
import com.t2404e.aihealthcoach.dto.response.mealplan.MonthDetailDTO;
import com.t2404e.aihealthcoach.dto.response.mealplan.MonthlyPlanDTO;
import com.t2404e.aihealthcoach.entity.DishLibrary;
import com.t2404e.aihealthcoach.entity.HealthAnalysis;
import com.t2404e.aihealthcoach.entity.HealthProfile;
import com.t2404e.aihealthcoach.entity.MealPlan;
import com.t2404e.aihealthcoach.entity.PlannedMeal;
import com.t2404e.aihealthcoach.entity.UserMealLog;
import com.t2404e.aihealthcoach.exception.PremiumRequiredException;
import com.t2404e.aihealthcoach.repository.DishLibraryRepository;
import com.t2404e.aihealthcoach.repository.HealthAnalysisRepository;
import com.t2404e.aihealthcoach.repository.HealthProfileRepository;
import com.t2404e.aihealthcoach.repository.MealPlanRepository;
import com.t2404e.aihealthcoach.repository.PlannedMealRepository;
import com.t2404e.aihealthcoach.repository.UserMealLogRepository;
import com.t2404e.aihealthcoach.service.MealPlanService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MealPlanServiceImpl implements MealPlanService {

        private final HealthProfileRepository profileRepo;
        private final HealthAnalysisRepository analysisRepo;
        private final MealPlanRepository mealPlanRepo;
        private final PlannedMealRepository plannedMealRepo;
        private final DishLibraryRepository dishLibraryRepo;
        private final UserMealLogRepository logRepo;
        private final com.t2404e.aihealthcoach.repository.UserRepository userRepo;
        private final ChatClient.Builder chatClientBuilder;
        private final ObjectMapper objectMapper;

        @Override
        public MealPlanResponse generateForUser(Long userId) {
                // Check Premium Status
                com.t2404e.aihealthcoach.entity.User user = userRepo.findById(userId)
                                .orElseThrow(() -> new IllegalStateException("User not found"));

                if (!Boolean.TRUE.equals(user.getIsPremium())) {

                        throw new PremiumRequiredException(
                                        "FEATURE_LOCKED_PREMIUM: Vui lòng nâng cấp Premium để tạo lộ trình chi tiết.");
                }

                Optional<MealPlan> existingPlan = mealPlanRepo.findByUserId(userId);
                if (existingPlan.isPresent()) {
                        List<PlannedMeal> oldPlannedMeals = plannedMealRepo
                                        .findByMealPlanId(existingPlan.get().getId());
                        List<Long> oldPlannedMealIds = oldPlannedMeals.stream().map(PlannedMeal::getId).toList();
                        if (!oldPlannedMealIds.isEmpty()) {
                                logRepo.deleteByPlannedMealIdIn(oldPlannedMealIds);
                        }
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
                                .totalDays(7)
                                .build();
                MealPlan savedPlan = mealPlanRepo.save(mealPlan);

                // Generate in chunks of 7 days (now only 1 chunk)
                try {
                        for (int i = 1; i <= 7; i += 7) {
                                int start = i;
                                int end = Math.min(i + 6, 7);
                                System.out.println(
                                                "DEBUG: Generating meal plan chunk for days " + start + " to " + end);

                                String prompt = MealPlanPromptBuilder.build(profile, analysis, dishes, start, end);
                                String rawJson = chatClient.prompt()
                                                .system(com.t2404e.aihealthcoach.ai.prompt.MealPlanPrompt.SYSTEM)
                                                .user(prompt)
                                                .call()
                                                .content();
                                parseAndSaveChunk(savedPlan, rawJson);
                        }
                } catch (Exception e) {
                        System.err.println("CRITICAL AI ERROR: " + e.getMessage());
                        if (e.getMessage().contains("429") || e.getMessage().contains("rate_limit")) {
                                throw new RuntimeException(
                                                "Giới hạn lượt dùng AI đã hết cho hôm nay (Rate Limit). Vui lòng thử lại sau vài phút hoặc ngày mai.");
                        }
                        throw e;
                }

                return convertToResponse(savedPlan);
        }

        @Transactional
        protected void parseAndSaveChunk(MealPlan plan, String rawJson) {
                try {
                        // Clean markdown backticks if present
                        if (rawJson != null && rawJson.contains("```")) {
                                int firstIndex = rawJson.indexOf("{");
                                int lastIndex = rawJson.lastIndexOf("}");
                                if (firstIndex != -1 && lastIndex != -1 && lastIndex > firstIndex) {
                                        rawJson = rawJson.substring(firstIndex, lastIndex + 1);
                                }
                        }

                        Map<String, Object> map = objectMapper.readValue(rawJson,
                                        new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {
                                        });
                        Object mealPlanObj = map.get("mealPlan");

                        if (mealPlanObj instanceof List<?> days) {
                                for (Object dayObj : days) {
                                        if (dayObj instanceof Map<?, ?> dayData) {
                                                Integer dayNum = (Integer) dayData.get("day");
                                                Object mealsObj = dayData.get("meals");
                                                java.util.Set<String> processedCategories = new java.util.HashSet<>();

                                                if (mealsObj instanceof List<?> mealsData) {
                                                        for (Object mealObj : mealsData) {
                                                                if (mealObj instanceof Map<?, ?> mealData) {
                                                                        String category = (String) mealData
                                                                                        .get("category");
                                                                        if (category == null)
                                                                                category = (String) mealData
                                                                                                .get("type");
                                                                        category = mapToVietnameseCategory(category);

                                                                        if (processedCategories.contains(category)) {
                                                                                continue; // Skip duplicate category for
                                                                                          // this day
                                                                        }
                                                                        processedCategories.add(category);

                                                                        Long dishId = ((Number) mealData.get("dishId"))
                                                                                        .longValue();
                                                                        DishLibrary dish = dishLibraryRepo
                                                                                        .findById(dishId).orElse(null);

                                                                        // Respect AI category choice. Already formatted
                                                                        // above

                                                                        // Hydrate missing fields from DishLibrary
                                                                        String mealName = (String) mealData
                                                                                        .get("mealName");
                                                                        if (mealName == null && dish != null) {
                                                                                mealName = dish.getName();
                                                                        }
                                                                        if (mealName == null)
                                                                                mealName = "Món ăn lạ";

                                                                        int calories = 0;
                                                                        if (mealData.get("calories") != null) {
                                                                                calories = ((Number) mealData
                                                                                                .get("calories"))
                                                                                                .intValue();
                                                                        } else if (dish != null) {
                                                                                calories = dish.getBaseCalories();
                                                                        }

                                                                        PlannedMeal plannedMeal = PlannedMeal.builder()
                                                                                        .mealPlanId(plan.getId())
                                                                                        .dayNumber(dayNum)
                                                                                        .dish(dish)
                                                                                        .category(category)
                                                                                        .mealName(mealName)
                                                                                        .quantity((String) mealData.get(
                                                                                                        "quantity"))
                                                                                        .calories(calories)
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
                        System.err.println("Error parsing AI Meal Plan: " + e.getMessage());
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

        @Override
        @Transactional
        public MealPlanResponse extendPlan(Long userId) {
                MealPlan plan = mealPlanRepo.findByUserId(userId)
                                .orElseThrow(() -> new IllegalStateException("Không tìm thấy lộ trình để mở rộng"));

                int currentDays = plan.getTotalDays();
                int newDays = currentDays + 7;
                plan.setTotalDays(newDays);
                mealPlanRepo.save(plan);

                if (userId == null)
                        throw new IllegalArgumentException("User ID cannot be null");
                final Long uid = userId;

                HealthProfile profile = profileRepo.findById(uid)
                                .orElseThrow(() -> new IllegalStateException("Hồ sơ sức khỏe không tồn tại"));
                HealthAnalysis analysis = analysisRepo.findByUserId(uid)
                                .orElseThrow(() -> new IllegalStateException("Phân tích sức khỏe không tồn tại"));
                List<DishLibrary> dishes = dishLibraryRepo.findByIsVerifiedTrueAndIsDeletedFalse();
                ChatClient chatClient = chatClientBuilder.build();

                try {
                        System.out.println(
                                        "DEBUG: Extending meal plan for days " + (currentDays + 1) + " to " + newDays);
                        String prompt = MealPlanPromptBuilder.build(profile, analysis, dishes, currentDays + 1,
                                        newDays);
                        String finalPrompt = prompt != null ? prompt : "";
                        String rawJson = chatClient.prompt()
                                        .system(com.t2404e.aihealthcoach.ai.prompt.MealPlanPrompt.SYSTEM)
                                        .user(finalPrompt)
                                        .call()
                                        .content();
                        parseAndSaveChunk(plan, rawJson);
                } catch (Exception e) {
                        System.err.println("AI EXTEND ERROR: " + e.getMessage());
                        throw new RuntimeException("Lỗi khi mở rộng lộ trình bằng AI: " + e.getMessage());
                }

                return convertToResponse(plan);
        }

        private MealPlanResponse convertToResponse(MealPlan plan) {
                List<PlannedMeal> plannedMeals = plannedMealRepo.findByMealPlanId(plan.getId());
                java.util.Set<Long> currentPlannedMealIds = plannedMeals.stream()
                                .map(PlannedMeal::getId)
                                .collect(java.util.stream.Collectors.toSet());

                List<UserMealLog> allLogs = logRepo.findByUserIdOrderByLoggedAtAsc(plan.getUserId());
                Map<Long, Integer> plannedCaloriesMap = plannedMeals.stream()
                                .collect(Collectors.toMap(PlannedMeal::getId, PlannedMeal::getCalories));

                // Group by day number, filtering out logs from previous plans
                Map<Integer, List<UserMealLog>> groupedByDay = allLogs.stream()
                                .filter(l -> l.getDayNumber() != null)
                                .filter(l -> (l.getPlannedMealId() != null
                                                && currentPlannedMealIds.contains(l.getPlannedMealId()))
                                                || (l.getPlannedMealId() == null
                                                                && Boolean.FALSE.equals(l.getIsPlanCompliant())))
                                .collect(Collectors.groupingBy(UserMealLog::getDayNumber));

                List<DayPlanDTO> dayPlans = groupedByDay.entrySet().stream()
                                .map(e -> {
                                        Integer day = e.getKey();
                                        List<UserMealLog> dayLogs = e.getValue();

                                        // Đảm bảo luôn có 4 category: Sáng, Trưa, Tối, Phụ
                                        List<String> mandatoryCategories = List.of("Sáng", "Trưa", "Tối", "Phụ");
                                        Map<String, List<UserMealLog>> groupedByCategory = dayLogs.stream()
                                                        .collect(Collectors.groupingBy(
                                                                        l -> mapToVietnameseCategory(
                                                                                        l.getCategory() == null ? "Phụ"
                                                                                                        : l.getCategory())));

                                        List<MealDTO> mealDTOs = mandatoryCategories.stream().map(categoryName -> {
                                                List<UserMealLog> categoryLogs = groupedByCategory.getOrDefault(
                                                                categoryName,
                                                                Collections.emptyList());

                                                if (categoryLogs.isEmpty()) {
                                                        return MealDTO.builder()
                                                                        .id(-1L) // ID giả cho slot trống
                                                                        .mealName("Chưa có món")
                                                                        .quantity("")
                                                                        .calories(0)
                                                                        .plannedCalories(0)
                                                                        .type(categoryName)
                                                                        .checkedIn(false)
                                                                        .build();
                                                }

                                                String combinedName = categoryLogs.stream()
                                                                .map(UserMealLog::getFoodName)
                                                                .distinct()
                                                                .collect(Collectors.joining(" + "));
                                                int totalCal = categoryLogs.stream()
                                                                .mapToInt(UserMealLog::getEstimatedCalories)
                                                                .sum();
                                                java.util.Set<Long> seenPlannedIds = new java.util.HashSet<>();
                                                int totalPlannedCal = categoryLogs.stream()
                                                                .filter(l -> l.getPlannedMealId() != null)
                                                                .filter(l -> seenPlannedIds.add(l.getPlannedMealId()))
                                                                .mapToInt(l -> plannedCaloriesMap.getOrDefault(
                                                                                l.getPlannedMealId(),
                                                                                l.getEstimatedCalories()))
                                                                .sum();
                                                boolean anyCheckedIn = categoryLogs.stream()
                                                                .anyMatch(l -> Boolean.TRUE.equals(l.getCheckedIn()));

                                                return MealDTO.builder()
                                                                .id(categoryLogs.get(0).getId())
                                                                .plannedMealId(categoryLogs.get(0).getPlannedMealId())
                                                                .mealName(combinedName)
                                                                .quantity("")
                                                                .calories(totalCal)
                                                                .plannedCalories(totalPlannedCal)
                                                                .type(categoryName)
                                                                .checkedIn(anyCheckedIn)
                                                                .build();
                                        }).collect(Collectors.toList());

                                        return DayPlanDTO.builder()
                                                        .day(day)
                                                        .meals(mealDTOs)
                                                        .totalCalories(mealDTOs.stream().mapToInt(MealDTO::getCalories)
                                                                        .sum())
                                                        .totalPlannedCalories(mealDTOs.stream()
                                                                        .mapToInt(MealDTO::getPlannedCalories)
                                                                        .sum())
                                                        .build();
                                })
                                .sorted(Comparator.comparing(DayPlanDTO::getDay))
                                .collect(Collectors.toList());

                return MealPlanResponse.builder()
                                .startDate(plan.getStartDate())
                                .totalDays(plan.getTotalDays())
                                .mealPlan(dayPlans)
                                .monthlyPlan(extractMonthlyPlan(plan.getUserId()))
                                .build();
        }

        private MonthlyPlanDTO extractMonthlyPlan(Long userId) {
                try {
                        Optional<HealthAnalysis> analysisOpt = analysisRepo.findByUserId(userId);
                        if (analysisOpt.isEmpty())
                                return null;

                        String json = analysisOpt.get().getAnalysisJson();
                        Map<String, Object> map = objectMapper.readValue(json,
                                        new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {
                                        });

                        Object planObj = map.get("threeMonthPlan");
                        if (!(planObj instanceof Map<?, ?> planData))
                                return null;

                        List<MonthDetailDTO> months = new java.util.ArrayList<>();
                        Object monthsObj = planData.get("months");
                        if (monthsObj instanceof List<?> monthsList) {
                                for (Object m : monthsList) {
                                        if (m instanceof Map<?, ?> mData) {
                                                months.add(MonthDetailDTO.builder()
                                                                .month(((Number) mData.get("month")).intValue())
                                                                .title((String) mData.get("title"))
                                                                .dailyCalories(((Number) mData.get("dailyCalories"))
                                                                                .intValue())
                                                                .note((String) mData.get("note"))
                                                                .build());
                                        }
                                }
                        }

                        return MonthlyPlanDTO.builder()
                                        .goal((String) planData.get("goal"))
                                        .totalTargetWeightChangeKg(planData.get("totalTargetWeightChangeKg") != null
                                                        ? ((Number) planData.get("totalTargetWeightChangeKg"))
                                                                        .doubleValue()
                                                        : 0.0)
                                        .months(months)
                                        .build();
                } catch (Exception e) {
                        System.err.println("Error extracting monthly plan: " + e.getMessage());
                        return null;
                }
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
