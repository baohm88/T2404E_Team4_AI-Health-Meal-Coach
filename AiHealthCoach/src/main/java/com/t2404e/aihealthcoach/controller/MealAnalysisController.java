package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.response.ai.MealAnalysisResponse;
import com.t2404e.aihealthcoach.entity.UserMealLog;
import com.t2404e.aihealthcoach.repository.UserMealLogRepository;
import com.t2404e.aihealthcoach.service.AiMealVisionService;
import com.t2404e.aihealthcoach.service.CloudinaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/meals")
@Tag(name = "Meal Analysis", description = "Phân tích bữa ăn qua hình ảnh")
public class MealAnalysisController {

    private final CloudinaryService cloudinaryService;
    private final AiMealVisionService aiMealVisionService;
    private final UserMealLogRepository repository;

    public MealAnalysisController(CloudinaryService cloudinaryService,
            AiMealVisionService aiMealVisionService,
            UserMealLogRepository repository) {
        this.cloudinaryService = cloudinaryService;
        this.aiMealVisionService = aiMealVisionService;
        this.repository = repository;
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Tải ảnh lên và phân tích calo")
    public ApiResponse<MealAnalysisResponse> analyzeMeal(@RequestParam("file") MultipartFile file) {
        try {
            // 1. Upload lên Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file);

            // 2. Gọi AI Vision phân thích
            MealAnalysisResponse analysis = aiMealVisionService.analyzeMealImage(imageUrl);
            analysis.setImageUrl(imageUrl);

            // 3. Lưu vào DB (Giả sử userId = 1 cho demo, trong thực tế lấy từ
            // SecurityContext)
            UserMealLog log = UserMealLog.builder()
                    .userId(1L)
                    .imageUrl(imageUrl)
                    .foodName(analysis.getFoodName())
                    .estimatedCalories(analysis.getEstimatedCalories())
                    .nutritionDetails(analysis.getNutritionDetails())
                    .build();
            repository.save(log);

            return ApiResponse.success("Phân tích bữa ăn thành công", analysis);
        } catch (IOException e) {
            return ApiResponse.error("Lỗi khi tải ảnh lên: " + e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi phân tích ảnh: " + e.getMessage());
        }
    }
}
