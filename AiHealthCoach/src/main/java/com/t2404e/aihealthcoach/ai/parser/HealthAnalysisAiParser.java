package com.t2404e.aihealthcoach.ai.parser;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.t2404e.aihealthcoach.dto.response.ai.AiHealthAnalysisResponse;
import org.springframework.stereotype.Component;

@Component
public class HealthAnalysisAiParser {

    private final ObjectMapper objectMapper;

    public HealthAnalysisAiParser(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public AiHealthAnalysisResponse parse(String aiJson) {
        try {
            return objectMapper.readValue(aiJson, AiHealthAnalysisResponse.class);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to parse AI health analysis JSON", e);
        }
    }
}
