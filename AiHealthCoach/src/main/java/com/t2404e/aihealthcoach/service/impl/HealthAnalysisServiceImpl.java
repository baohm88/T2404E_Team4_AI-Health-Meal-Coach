package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.entity.HealthAnalysis;
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
    public void saveOrUpdate(Long userId, String analysisJson) {

        HealthAnalysis entity = repository.findByUserId(userId)
                .orElse(
                        HealthAnalysis.builder()
                                .userId(userId)
                                .build()
                );

        entity.setAnalysisJson(analysisJson);
        repository.save(entity);
    }

    @Override
    public String getByUserId(Long userId) {
        return repository.findByUserId(userId)
                .map(HealthAnalysis::getAnalysisJson)
                .orElse(null);
    }
}
