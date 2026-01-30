package com.t2404e.aihealthcoach.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.response.MealPlanResponse;
import com.t2404e.aihealthcoach.service.MealPlanService;
import com.t2404e.aihealthcoach.util.RequestUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/meal-plans")
@RequiredArgsConstructor
@Tag(name = "Meal Plan", description = "Quản lý và tạo thực đơn ăn uống")
public class MealPlanController {

        private final MealPlanService service;

        @PostMapping
        @PreAuthorize("hasAnyRole('USER','ADMIN')")
        @Operation(summary = "Tạo thực đơn mới", description = "Dựa trên hồ sơ sức khỏe để AI đề xuất thực đơn.")
        public ResponseEntity<ApiResponse<MealPlanResponse>> generate(
                        HttpServletRequest request) {

                Long userId = RequestUtil.getUserId(request);
                MealPlanResponse mealPlan = service.generateForUser(userId);

                return ResponseEntity.ok(
                                ApiResponse.success("Meal plan generated successfully", mealPlan));
        }

        @GetMapping
        @PreAuthorize("hasAnyRole('USER','ADMIN')")
        @Operation(summary = "Xem thực đơn hiện tại", description = "Lấy thực đơn đã được lưu của người dùng.")
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
        @Operation(summary = "Tạo lại thực đơn", description = "Yêu cầu AI tạo lại thực đơn mới thay thế thực đơn cũ.")
        public ResponseEntity<ApiResponse<MealPlanResponse>> regenerate(
                        HttpServletRequest request) {

                Long userId = RequestUtil.getUserId(request);
                MealPlanResponse mealPlan = service.regenerate(userId);

                return ResponseEntity.ok(
                                ApiResponse.success("Meal plan regenerated successfully", mealPlan));
        }

        @PatchMapping("/extend")
        @PreAuthorize("hasAnyRole('USER','ADMIN')")
        @Operation(summary = "Mở rộng thực đơn", description = "Yêu cầu AI tạo thêm 7 ngày thực đơn tiếp theo.")
        public ResponseEntity<ApiResponse<MealPlanResponse>> extend(
                        HttpServletRequest request) {

                Long userId = RequestUtil.getUserId(request);
                MealPlanResponse mealPlan = service.extendPlan(userId);

                return ResponseEntity.ok(
                                ApiResponse.success("Meal plan extended successfully", mealPlan));
        }
}
