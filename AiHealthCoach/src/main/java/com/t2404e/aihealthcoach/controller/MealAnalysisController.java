package com.t2404e.aihealthcoach.controller;

import java.io.IOException;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.response.ai.MealAnalysisResponse;
import com.t2404e.aihealthcoach.entity.UserMealLog;
import com.t2404e.aihealthcoach.service.MealLogService;
import com.t2404e.aihealthcoach.util.RequestUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
@Tag(name = "Meal Analysis", description = "API phân tích bữa ăn qua hình ảnh và AI")
@lombok.extern.slf4j.Slf4j
public class MealAnalysisController {

    private final MealLogService mealLogService;

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Tải ảnh lên và phân tích calo", description = "Upload ảnh món ăn để AI nhận diện và tính toán dinh dưỡng.")
    public ApiResponse<MealAnalysisResponse> analyzeMeal(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "plannedMealId", required = false) Long plannedMealId,
            @RequestParam(value = "category", required = false) String category,
            HttpServletRequest request) {
        try {
            Long userId = RequestUtil.getUserId(request);
            if (userId == null)
                return ApiResponse.error("User not authenticated");

            // Delegate to Service
            MealAnalysisResponse result = mealLogService.analyzeAndLog(file, userId, plannedMealId, category);

            return ApiResponse.success("Phân tích bữa ăn thành công", result);
        } catch (IOException e) {
            return ApiResponse.error("Lỗi khi tải ảnh lên: " + e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi phân tích ảnh: " + e.getMessage());
        }
    }

    @PostMapping("/analyze-text")
    @Operation(summary = "Phân tích bữa ăn qua văn bản/giọng nói", description = "Gửi text mô tả món ăn để AI nhận diện và tính toán dinh dưỡng.")
    public ApiResponse<MealAnalysisResponse> analyzeMealText(
            @RequestParam("text") String text,
            @RequestParam(value = "plannedMealId", required = false) Long plannedMealId,
            @RequestParam(value = "category", required = false) String category,
            HttpServletRequest request) {
        try {
            Long userId = RequestUtil.getUserId(request);
            if (userId == null)
                return ApiResponse.error("User not authenticated");

            MealAnalysisResponse result = mealLogService.analyzeTextAndLog(text, userId, plannedMealId, category);
            return ApiResponse.success("Phân tích bữa ăn thành công", result);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi phân tích văn bản: " + e.getMessage());
        }
    }

    @GetMapping("/search-dishes")
    @Operation(summary = "Tìm kiếm món ăn trong thư viện", description = "Dành cho người dùng tìm kiếm món ăn để đổi bữa.")
    public ApiResponse<Page<com.t2404e.aihealthcoach.entity.DishLibrary>> searchDishes(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<com.t2404e.aihealthcoach.entity.DishLibrary> result = mealLogService.searchDishes(keyword, category, page,
                size);
        return ApiResponse.success("Tìm kiếm thành công", result);
    }

    @PostMapping("/check-in")
    @Operation(summary = "Xác nhận đã ăn đúng món theo kế hoạch (không cần ảnh)")
    public ApiResponse<UserMealLog> checkIn(
            @RequestBody MealAnalysisResponse checkInData,
            HttpServletRequest request) {

        log.debug("Handing check-in request");

        Long userId = RequestUtil.getUserId(request);
        if (userId == null) {
            log.debug("Check-in failed - User not authenticated");
            return ApiResponse.error("Phiên làm việc hết hạn. Vui lòng đăng nhập lại.");
        }

        if (checkInData == null) {
            return ApiResponse.error("Dữ liệu không hợp lệ");
        }

        // Delegate to Service
        UserMealLog log = mealLogService.confirmCheckIn(checkInData, userId);
        return ApiResponse.success("Đã xác nhận bữa ăn", log);
    }

    @PostMapping("/{logId}/check-in")
    @Operation(summary = "Đánh dấu một bữa ăn trong kế hoạch là đã hoàn thành")
    public ApiResponse<UserMealLog> checkInById(
            @PathVariable Long logId,
            HttpServletRequest request) {

        Long userId = RequestUtil.getUserId(request);
        if (userId == null)
            return ApiResponse.error("Unauthenticated");

        UserMealLog updated = mealLogService.checkInLog(logId, userId);
        return ApiResponse.success("Đã đánh dấu bữa ăn là hoàn thành", updated);
    }
}
