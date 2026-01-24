package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.service.MealPlanService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.t2404e.aihealthcoach.dto.response.MealPlanResponse;

@RestController
@RequestMapping("/meal-plans")
@RequiredArgsConstructor
public class MealPlanController {

        private final MealPlanService service;

        @PostMapping
        @PreAuthorize("hasAnyRole('USER','ADMIN')")
        public ResponseEntity<ApiResponse<MealPlanResponse>> generate(
                        HttpServletRequest request) {

                Long userId = RequestUtil.getUserId(request);
                MealPlanResponse mealPlan = service.generateForUser(userId);

                return ResponseEntity.ok(
                                ApiResponse.success("Meal plan generated successfully", mealPlan));
        }

        @GetMapping
        @PreAuthorize("hasAnyRole('USER','ADMIN')")
        public ResponseEntity<ApiResponse<MealPlanResponse>> get(
                        HttpServletRequest request) {

                Long userId = RequestUtil.getUserId(request);

                return ResponseEntity.ok(
                                ApiResponse.success(
                                                "Meal plan fetched successfully",
                                                service.getByUserId(userId)));
        }

        @PutMapping
        @PreAuthorize("hasAnyRole('USER','ADMIN')")
        public ResponseEntity<ApiResponse<MealPlanResponse>> regenerate(
                        HttpServletRequest request) {

                Long userId = RequestUtil.getUserId(request);
                MealPlanResponse mealPlan = service.regenerate(userId);

                return ResponseEntity.ok(
                                ApiResponse.success("Meal plan regenerated successfully", mealPlan));
        }
}
