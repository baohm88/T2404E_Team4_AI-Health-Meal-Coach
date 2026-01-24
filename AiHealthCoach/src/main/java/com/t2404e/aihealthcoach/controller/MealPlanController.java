package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.entity.MealPlan;
import com.t2404e.aihealthcoach.service.MealPlanService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/meal-plans")
@RequiredArgsConstructor
public class MealPlanController {

    private final MealPlanService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<MealPlan>> generate(
            HttpServletRequest request) {

        Long userId = RequestUtil.getUserId(request);
        MealPlan mealPlan = service.generateForUser(userId);

        return ResponseEntity.ok(
                ApiResponse.success("Meal plan generated successfully", mealPlan)
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<MealPlan>> get(
            HttpServletRequest request) {

        Long userId = RequestUtil.getUserId(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Meal plan fetched successfully",
                        service.getByUserId(userId)
                )
        );
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<MealPlan>> regenerate(
            HttpServletRequest request) {

        Long userId = RequestUtil.getUserId(request);
        MealPlan mealPlan = service.regenerate(userId);

        return ResponseEntity.ok(
                ApiResponse.success("Meal plan regenerated successfully", mealPlan)
        );
    }
}
