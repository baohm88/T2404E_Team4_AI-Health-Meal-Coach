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
@RequestMapping("/ai/meal-plan")
@RequiredArgsConstructor
public class MealPlanController {

    private final MealPlanService service;

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> generate(
            HttpServletRequest request) {

        Long userId = RequestUtil.getUserId(request);
        service.generateForUser(userId);

        return ResponseEntity.ok(
                ApiResponse.success("Meal plan generated successfully", null)
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

    @PostMapping("/regenerate")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> regenerate(
            HttpServletRequest request) {

        Long userId = RequestUtil.getUserId(request);
        service.regenerate(userId);

        return ResponseEntity.ok(
                ApiResponse.success("Meal plan regenerated successfully", null)
        );
    }
}
