package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.request.HealthProfileRequest;
import com.t2404e.aihealthcoach.service.AiHealthAnalysisService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final AiHealthAnalysisService service;

    public AiController(AiHealthAnalysisService service) {
        this.service = service;
    }

    @PostMapping("/health-analysis")
    public ApiResponse<?> analyze(@Valid @RequestBody HealthProfileRequest request) {
        return ApiResponse.success(
                "Health analysis completed",
                service.analyze(request)
        );
    }
}
