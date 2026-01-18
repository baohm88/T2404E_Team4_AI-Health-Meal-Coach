package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.service.MealService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/meals")
public class MealController {

    private final MealService service;

    public MealController(MealService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/generate/{dailyPlanId}")
    public ResponseEntity<ApiResponse<?>> generate(
            @PathVariable Long dailyPlanId,
            HttpServletRequest request
    ) {
        Long userId = RequestUtil.getUserId(request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Meals generated",
                        service.generateMeals(dailyPlanId, userId)
                )
        );
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{dailyPlanId}")
    public ResponseEntity<ApiResponse<?>> get(
            @PathVariable Long dailyPlanId,
            HttpServletRequest request
    ) {
        Long userId = RequestUtil.getUserId(request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Meals loaded",
                        service.getMeals(dailyPlanId, userId)
                )
        );
    }
}
