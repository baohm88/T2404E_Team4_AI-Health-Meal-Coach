package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.request.AiHealthAnalysisRequest;
import com.t2404e.aihealthcoach.service.AiHealthAnalysisService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiHealthAnalysisController {

    private final AiHealthAnalysisService service;

    public AiHealthAnalysisController(AiHealthAnalysisService service) {
        this.service = service;
    }

    @PostMapping("/health-analysis")
    public ApiResponse<?> analyze(@Valid @RequestBody AiHealthAnalysisRequest request) {
        return ApiResponse.success(
                "Health analysis completed",
                service.analyze(request)
        );
    }
}
