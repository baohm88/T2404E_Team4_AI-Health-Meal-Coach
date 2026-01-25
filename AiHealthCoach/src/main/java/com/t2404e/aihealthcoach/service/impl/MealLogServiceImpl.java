package com.t2404e.aihealthcoach.service.impl;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.t2404e.aihealthcoach.dto.response.ai.MealAnalysisResponse;
import com.t2404e.aihealthcoach.entity.UserMealLog;
import com.t2404e.aihealthcoach.repository.PlannedMealRepository;
import com.t2404e.aihealthcoach.repository.UserMealLogRepository;
import com.t2404e.aihealthcoach.service.AiMealVisionService;
import com.t2404e.aihealthcoach.service.CloudinaryService;
import com.t2404e.aihealthcoach.service.MealLogService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MealLogServiceImpl implements MealLogService {

    private final CloudinaryService cloudinaryService;
    private final AiMealVisionService aiMealVisionService;
    private final UserMealLogRepository logRepository;
    private final PlannedMealRepository plannedMealRepository;

    @Override
    public MealAnalysisResponse analyzeAndLog(MultipartFile file, Long userId, Long plannedMealId) throws IOException {
        // 1. Upload ảnh lên Cloudinary
        // Upload file ảnh và nhận lại URL
        String imageUrl = cloudinaryService.uploadImage(file);
        System.out.println("DEBUG: Image uploaded to Cloudinary: " + imageUrl);

        // 2. Gọi AI Vision phân thích
        // Gửi URL ảnh cho AI để nhận diện món ăn và dinh dưỡng
        MealAnalysisResponse analysis = aiMealVisionService.analyzeMealImage(imageUrl);
        analysis.setImageUrl(imageUrl); // Gán lại URL ảnh vào response
        System.out.println("DEBUG: AI Analysis result: " + analysis.getFoodName());

        // 3. Xử lý logic dishId từ plannedMealId (nếu có)
        // Nếu người dùng chọn một bữa ăn trong kế hoạch, ta cần lấy ID món ăn gốc (dishId)
        Long dishId = null;
        if (plannedMealId != null) {
            dishId = plannedMealRepository.findById(plannedMealId)
                    .map(pm -> pm.getDish() != null ? pm.getDish().getId() : null)
                    .orElse(null);
        }

        // 4. Lưu vào DB
        // Tạo đối tượng UserMealLog để lưu lịch sử ăn uống
        UserMealLog log = UserMealLog.builder()
                .userId(userId)
                .imageUrl(imageUrl)
                .foodName(analysis.getFoodName())
                .estimatedCalories(analysis.getEstimatedCalories())
                .nutritionDetails(analysis.getNutritionDetails())
                .plannedMealId(plannedMealId)
                .dishId(dishId)
                // Nếu có plannedMealId thì coi như tuân thủ kế hoạch (đơn giản hóa)
                .isPlanCompliant(plannedMealId != null)
                .build();

        logRepository.save(log);
        System.out.println("DEBUG: Meal log saved with ID: " + log.getId());

        return analysis;
    }

    @Override
    public UserMealLog confirmCheckIn(MealAnalysisResponse checkInData, Long userId) {
        System.out.println("DEBUG: Processing check-in for user: " + userId);
        
        String details = checkInData.getNutritionDetails();
        if (details == null) details = "Ăn theo kế hoạch";
        else details += " (Xác nhận theo kế hoạch)";

        // Xử lý dishId tương tự như trên
        Long dishId = null;
        if (checkInData.getPlannedMealId() != null) {
            dishId = plannedMealRepository.findById(checkInData.getPlannedMealId())
                    .map(pm -> pm.getDish() != null ? pm.getDish().getId() : null)
                    .orElse(null);
        }

        // Tạo log cho việc check-in (không có ảnh mới, nhưng có thể map với planned meal)
        UserMealLog log = UserMealLog.builder()
                .userId(userId)
                .plannedMealId(checkInData.getPlannedMealId())
                .dishId(dishId)
                .foodName(checkInData.getFoodName())
                .imageUrl("") // Không bắt buộc ảnh khi check-in nhanh
                .estimatedCalories(checkInData.getEstimatedCalories())
                .isPlanCompliant(true) // Check-in nghĩa là tuân thủ
                .nutritionDetails(details)
                .build();

        UserMealLog saved = logRepository.save(log);
        System.out.println("DEBUG: Check-in saved successfully. Log ID: " + saved.getId());
        
        return saved;
    }
}
