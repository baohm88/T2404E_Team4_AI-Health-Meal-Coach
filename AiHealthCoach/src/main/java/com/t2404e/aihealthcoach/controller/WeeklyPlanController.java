package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.request.WeeklyAdjustmentRequest;
import com.t2404e.aihealthcoach.service.WeeklyPlanService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
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
            @PathVariable Long monthlyPlanId,
            HttpServletRequest request
    ) {
        Long userId = RequestUtil.getUserId(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Weekly plans generated",
                        service.generateWeeklyPlans(monthlyPlanId, userId)
                )
        );
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{monthlyPlanId}")
    public ResponseEntity<ApiResponse<?>> get(
            @PathVariable Long monthlyPlanId,
            HttpServletRequest request
    ) {
        Long userId = RequestUtil.getUserId(request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Weekly plans loaded",
                        service.getWeeklyPlans(monthlyPlanId, userId)
                )
        );
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{weeklyPlanId}/adjust")
    public ResponseEntity<ApiResponse<?>> adjust(
            @PathVariable Long weeklyPlanId,
            @Valid @RequestBody WeeklyAdjustmentRequest request,
            HttpServletRequest httpRequest
    ) {
        Long userId = RequestUtil.getUserId(httpRequest);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Weekly plan adjusted",
                        service.adjustWeeklyPlan(weeklyPlanId, userId, request)
                )
        );
    }
}
