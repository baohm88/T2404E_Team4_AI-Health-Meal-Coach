package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.ai.prompt.MealPlanPrompt;
import com.t2404e.aihealthcoach.ai.prompt.MealPlanPromptBuilder;
import com.t2404e.aihealthcoach.entity.HealthAnalysis;
import com.t2404e.aihealthcoach.entity.HealthProfile;
import com.t2404e.aihealthcoach.entity.MealPlan;
import com.t2404e.aihealthcoach.repository.HealthAnalysisRepository;
import com.t2404e.aihealthcoach.repository.HealthProfileRepository;
import com.t2404e.aihealthcoach.repository.MealPlanRepository;
import com.t2404e.aihealthcoach.service.MealPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MealPlanServiceImpl implements MealPlanService {

    private final HealthProfileRepository profileRepo;
    private final HealthAnalysisRepository analysisRepo;
    private final MealPlanRepository mealPlanRepo;
    private final ChatClient.Builder chatClientBuilder;

    @Override
    public MealPlan generateForUser(Long userId) {

        // 1. Nếu đã tồn tại → trả luôn (KHÔNG sinh lại)
        return mealPlanRepo.findByUserId(userId)
                .orElseGet(() -> {

                    HealthProfile profile = profileRepo.findById(userId)
                            .orElseThrow(() -> new IllegalStateException("HealthProfile not found"));

                    HealthAnalysis analysis = analysisRepo.findByUserId(userId)
                            .orElseThrow(() -> new IllegalStateException("HealthAnalysis not found"));

                    String prompt = MealPlanPromptBuilder.build(profile, analysis);

                    ChatClient chatClient = chatClientBuilder.build();

                    String planJson = chatClient.prompt()
                            .system(MealPlanPrompt.SYSTEM)
                            .user(prompt)
                            .call()
                            .content();

                    MealPlan mealPlan = MealPlan.builder()
                            .userId(userId)
                            .startDate(LocalDate.now())
                            .totalDays(90)
                            .planJson(planJson)
                            .build();

                    return mealPlanRepo.save(mealPlan);
                });
    }

    @Override
    public MealPlan getByUserId(Long userId) {
        return mealPlanRepo.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("MealPlan not found"));
    }

    @Override
    public MealPlan regenerate(Long userId) {
        mealPlanRepo.deleteByUserId(userId);
        return generateForUser(userId);
    }
}

