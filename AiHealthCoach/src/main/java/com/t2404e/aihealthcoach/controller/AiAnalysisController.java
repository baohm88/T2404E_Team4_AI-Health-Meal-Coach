package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.request.AiMonthlyPlanRequest;
import com.t2404e.aihealthcoach.dto.response.AiMonthlyPlanResponse;
import com.t2404e.aihealthcoach.service.AiAnalysisService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai/analysis")
public class AiAnalysisController {

    private final AiAnalysisService service;

    public AiAnalysisController(AiAnalysisService service) {
        this.service = service;
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/monthly-plan")
    public ResponseEntity<ApiResponse<?>> generateMonthlyPlan(
            @Valid @RequestBody AiMonthlyPlanRequest request,
            HttpServletRequest httpRequest
    ) {
        Long userId = RequestUtil.getUserId(httpRequest);

        AiMonthlyPlanResponse response =
                service.generateMonthlyPlan(userId, request);

        return ResponseEntity.ok(
                ApiResponse.success("AI monthly plan generated", response)
        );
    }
}
