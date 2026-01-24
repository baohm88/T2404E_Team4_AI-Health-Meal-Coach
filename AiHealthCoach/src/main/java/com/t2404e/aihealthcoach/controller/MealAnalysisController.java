package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.response.ai.MealAnalysisResponse;
import com.t2404e.aihealthcoach.entity.UserMealLog;
import com.t2404e.aihealthcoach.repository.PlannedMealRepository;
import com.t2404e.aihealthcoach.repository.UserMealLogRepository;
import com.t2404e.aihealthcoach.service.AiMealVisionService;
import com.t2404e.aihealthcoach.service.CloudinaryService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
@Tag(name = "Meal Analysis", description = "API phân tích bữa ăn qua hình ảnh và AI")
public class MealAnalysisController {

    private final CloudinaryService cloudinaryService;
    private final AiMealVisionService aiMealVisionService;
    private final UserMealLogRepository logRepository;
    private final PlannedMealRepository plannedMealRepository;

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Tải ảnh lên và phân tích calo")
    public ApiResponse<MealAnalysisResponse> analyzeMeal(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "plannedMealId", required = false) Long plannedMealId,
            HttpServletRequest request) {
        try {
            Long userId = RequestUtil.getUserId(request);
            if (userId == null)
                return ApiResponse.error("User not authenticated");

            String imageUrl = cloudinaryService.uploadImage(file);
            MealAnalysisResponse analysis = aiMealVisionService.analyzeMealImage(imageUrl);
            analysis.setImageUrl(imageUrl);

            Long dishId = null;
            if (plannedMealId != null) {
                dishId = plannedMealRepository.findById(plannedMealId)
                        .map(pm -> pm.getDish() != null ? pm.getDish().getId() : null)
                        .orElse(null);
            }

            UserMealLog log = UserMealLog.builder()
                    .userId(userId)
                    .imageUrl(imageUrl)
                    .foodName(analysis.getFoodName())
                    .estimatedCalories(analysis.getEstimatedCalories())
                    .nutritionDetails(analysis.getNutritionDetails())
                    .plannedMealId(plannedMealId)
                    .dishId(dishId)
                    .isPlanCompliant(plannedMealId != null)
                    .build();
            logRepository.save(log);

            return ApiResponse.success("Phân tích bữa ăn thành công", analysis);
        } catch (IOException e) {
            return ApiResponse.error("Lỗi khi tải ảnh lên: " + e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi phân tích ảnh: " + e.getMessage());
        }
    }

    @PostMapping("/check-in")
    @Operation(summary = "Xác nhận đã ăn đúng món theo kế hoạch (không cần ảnh)")
    public ApiResponse<UserMealLog> checkIn(
            @RequestBody MealAnalysisResponse checkInData,
            HttpServletRequest request) {
        
        System.out.println("DEBUG: Handing check-in for food: " + (checkInData != null ? checkInData.getFoodName() : "NULL"));
        
        Long userId = RequestUtil.getUserId(request);
        if (userId == null) {
            System.out.println("DEBUG: Check-in failed - User not authenticated");
            return ApiResponse.error("Phiên làm việc hết hạn. Vui lòng đăng nhập lại.");
        }

        if (checkInData == null) {
            return ApiResponse.error("Dữ liệu không hợp lệ");
        }

        String details = checkInData.getNutritionDetails();
        if (details == null) details = "Ăn theo kế hoạch";
        else details += " (Xác nhận theo kế hoạch)";

        Long dishId = null;
        if (checkInData.getPlannedMealId() != null) {
            dishId = plannedMealRepository.findById(checkInData.getPlannedMealId())
                    .map(pm -> pm.getDish() != null ? pm.getDish().getId() : null)
                    .orElse(null);
        }

        UserMealLog log = UserMealLog.builder()
                .userId(userId)
                .plannedMealId(checkInData.getPlannedMealId())
                .dishId(dishId)
                .foodName(checkInData.getFoodName())
                .imageUrl("") // Mặc định không có ảnh để tránh lỗi Database constraint
                .estimatedCalories(checkInData.getEstimatedCalories())
                .isPlanCompliant(true)
                .nutritionDetails(details)
                .build();
        
        UserMealLog saved = logRepository.save(log);
        System.out.println("DEBUG: Check-in success. Log ID: " + saved.getId());
        
        return ApiResponse.success("Đã xác nhận bữa ăn", saved);
    }
}
