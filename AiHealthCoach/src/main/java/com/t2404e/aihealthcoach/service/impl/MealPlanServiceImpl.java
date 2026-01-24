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

    // Inject BUILDER, KHÔNG inject ChatClient
    private final ChatClient.Builder chatClientBuilder;

    @Override
    public void generateForUser(Long userId) {

        if (mealPlanRepo.existsByUserId(userId)) {
            return; // KHÔNG sinh lại
        }

        HealthProfile profile = profileRepo.findById(userId)
                .orElseThrow();

        HealthAnalysis analysis = analysisRepo.findByUserId(userId)
                .orElseThrow();

        String prompt = MealPlanPromptBuilder.build(profile, analysis);

        ChatClient chatClient = chatClientBuilder.build();

        String planJson = chatClient.prompt()
                .system(MealPlanPrompt.SYSTEM)
                .user(prompt)
                .call()
                .content();

        mealPlanRepo.save(
                MealPlan.builder()
                        .userId(userId)
                        .startDate(LocalDate.now())
                        .totalDays(90)
                        .planJson(planJson)
                        .build()
        );
    }

    @Override
    public MealPlan getByUserId(Long userId) {
        return mealPlanRepo.findByUserId(userId)
                .orElseThrow();
    }

    @Override
    public void regenerate(Long userId) {
        mealPlanRepo.deleteByUserId(userId);
        generateForUser(userId);
    }
}
