package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.response.HealthAnalysisResponse;

public interface HealthAnalysisService {

    HealthAnalysisResponse getLatestAnalysis(Long userId);
}
