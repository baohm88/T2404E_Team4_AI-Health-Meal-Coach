package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.response.HealthAnalysisResponse;
import com.t2404e.aihealthcoach.entity.HealthAnalysis;
import com.t2404e.aihealthcoach.exception.ResourceNotFoundException;
import com.t2404e.aihealthcoach.repository.HealthAnalysisRepository;
import com.t2404e.aihealthcoach.service.HealthAnalysisService;
import org.springframework.stereotype.Service;

@Service
public class HealthAnalysisServiceImpl implements HealthAnalysisService {

    private final HealthAnalysisRepository repository;

    public HealthAnalysisServiceImpl(HealthAnalysisRepository repository) {
        this.repository = repository;
    }

    @Override
    public HealthAnalysisResponse getLatestAnalysis(Long userId) {

        HealthAnalysis ha = repository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Health analysis not found"));

        return HealthAnalysisResponse.builder()
                .bmi(ha.getBmi())
                .bmr(ha.getBmr())
                .tdee(ha.getTdee())
                .energyScore(ha.getEnergyScore())
                .healthStatus(ha.getHealthStatus())
                .bodyState(ha.getBodyState())
                .build();
    }
}
