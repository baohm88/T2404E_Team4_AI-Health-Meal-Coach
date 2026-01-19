package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.request.AiHealthAnalysisRequest;
import com.t2404e.aihealthcoach.dto.response.ai.AiHealthAnalysisResponse;

public interface AiHealthAnalysisService {

    AiHealthAnalysisResponse analyze(AiHealthAnalysisRequest request);
}
