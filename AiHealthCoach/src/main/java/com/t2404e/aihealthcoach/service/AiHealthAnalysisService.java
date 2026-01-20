package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.request.HealthProfileRequest;
import com.t2404e.aihealthcoach.dto.response.ai.AiHealthAnalysisResponse;

public interface AiHealthAnalysisService {

    AiHealthAnalysisResponse analyze(HealthProfileRequest request);
}
