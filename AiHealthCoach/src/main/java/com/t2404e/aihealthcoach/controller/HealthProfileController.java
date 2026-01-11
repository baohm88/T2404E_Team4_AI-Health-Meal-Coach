package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.request.HealthProfileRequest;
import com.t2404e.aihealthcoach.service.HealthProfileService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/health-profile")
public class HealthProfileController {

    private final HealthProfileService service;

    public HealthProfileController(HealthProfileService service) {
        this.service = service;
    }

    /**
     * Create health profile (or upsert) for current user
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<?>> create(
            @Valid @RequestBody HealthProfileRequest request,
            HttpServletRequest httpRequest) {

        Long userId = RequestUtil.getUserId(httpRequest);
        service.saveOrUpdate(userId, request);

        return ResponseEntity.ok(ApiResponse.success("Health profile saved successfully", null));
    }

    /**
     * Update health profile for current user (recommended RESTful endpoint)
     */
    @PutMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<?>> update(
            @Valid @RequestBody HealthProfileRequest request,
            HttpServletRequest httpRequest) {

        Long userId = RequestUtil.getUserId(httpRequest);
        service.saveOrUpdate(userId, request);

        return ResponseEntity.ok(ApiResponse.success("Health profile updated successfully", null));
    }
}
