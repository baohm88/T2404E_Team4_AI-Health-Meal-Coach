package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.service.DailyPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/plans/daily")
public class DailyPlanController {

    private final DailyPlanService service;

    public DailyPlanController(DailyPlanService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/generate/{weeklyPlanId}")
    public ResponseEntity<ApiResponse<?>> generate(
            @PathVariable Long weeklyPlanId
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Daily plans generated",
                        service.generateDailyPlans(weeklyPlanId)
                )
        );
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{weeklyPlanId}")
    public ResponseEntity<ApiResponse<?>> get(
            @PathVariable Long weeklyPlanId
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Daily plans loaded",
                        service.getDailyPlans(weeklyPlanId)
                )
        );
    }
}
