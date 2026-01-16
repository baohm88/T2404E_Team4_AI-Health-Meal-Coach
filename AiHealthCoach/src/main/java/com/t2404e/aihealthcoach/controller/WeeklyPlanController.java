package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.service.WeeklyPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/plans/weekly")
public class WeeklyPlanController {

    private final WeeklyPlanService service;

    public WeeklyPlanController(WeeklyPlanService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/generate/{monthlyPlanId}")
    public ResponseEntity<ApiResponse<?>> generate(
            @PathVariable Long monthlyPlanId
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Weekly plans generated",
                        service.generateWeeklyPlans(monthlyPlanId)
                )
        );
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{monthlyPlanId}")
    public ResponseEntity<ApiResponse<?>> get(
            @PathVariable Long monthlyPlanId
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Weekly plans loaded",
                        service.getWeeklyPlans(monthlyPlanId)
                )
        );
    }
}
