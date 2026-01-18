package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.service.MonthlyPlanService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/plans")
public class MonthlyPlanController {

    private final MonthlyPlanService service;

    public MonthlyPlanController(MonthlyPlanService service) {
        this.service = service;
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<?>> getMonthlyPlans(HttpServletRequest request) {

        Long userId = RequestUtil.getUserId(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Monthly plans loaded",
                        service.getMonthlyPlans(userId)
                )
        );
    }
}
