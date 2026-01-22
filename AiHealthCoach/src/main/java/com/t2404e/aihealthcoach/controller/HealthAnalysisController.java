package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.request.HealthAnalysisPersistRequest;
import com.t2404e.aihealthcoach.service.HealthAnalysisService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
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

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> save(
            @RequestBody String analysisJson,
            HttpServletRequest request) {

        Long userId = RequestUtil.getUserId(request);

        service.saveOrUpdate(userId, analysisJson);

        return ResponseEntity.ok(
                ApiResponse.success("Health analysis saved successfully", null)
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<String>> get(
            HttpServletRequest request) {

        Long userId = RequestUtil.getUserId(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Health analysis fetched successfully",
                        service.getByUserId(userId)
                )
        );
    }
}

