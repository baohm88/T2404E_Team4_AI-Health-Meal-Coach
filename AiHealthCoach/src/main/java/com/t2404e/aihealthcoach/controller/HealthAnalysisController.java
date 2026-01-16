package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.service.HealthAnalysisService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/health-analysis")
public class HealthAnalysisController {

    private final HealthAnalysisService service;

    public HealthAnalysisController(HealthAnalysisService service) {
        this.service = service;
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<?>> getLatest(HttpServletRequest request) {

        Long userId = RequestUtil.getUserId(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Health analysis loaded",
                        service.getLatestAnalysis(userId)
                )
        );
    }
}
