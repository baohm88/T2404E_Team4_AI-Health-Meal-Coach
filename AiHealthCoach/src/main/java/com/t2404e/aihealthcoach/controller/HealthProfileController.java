package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.request.HealthProfileRequest;
import com.t2404e.aihealthcoach.service.HealthProfileService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/health-profile")
public class HealthProfileController {

    private final HealthProfileService service;

    public HealthProfileController(HealthProfileService service) {
        this.service = service;
    }

    /**
     * Create or update health profile for current user
     * (Sprint 1: userId is mocked)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<?>> save(
            @Valid @RequestBody HealthProfileRequest request) {

        // TODO: Replace mock userId with JWT-based userId in Sprint 2
        Long mockUserId = 1L;

        service.saveOrUpdate(mockUserId, request);

        return ResponseEntity.ok(
                ApiResponse.success("Health profile saved successfully", null)
        );
    }
}
