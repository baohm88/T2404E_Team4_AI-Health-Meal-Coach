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
    public MealAnalysisResponse analyzeAndLog(MultipartFile file, Long userId, Long plannedMealId, String categoryParam)
            throws IOException {
        // 1. Upload ảnh lên Cloudinary
        // Upload file ảnh và nhận lại URL
        String imageUrl = cloudinaryService.uploadImage(file);
        System.out.println("DEBUG: Image uploaded to Cloudinary: " + imageUrl);

        // 2. Gọi AI Vision phân thích
        // Gửi URL ảnh cho AI để nhận diện món ăn và dinh dưỡng
        MealAnalysisResponse analysis = aiMealVisionService.analyzeMealImage(imageUrl);
        analysis.setImageUrl(imageUrl); // Gán lại URL ảnh vào response
        System.out.println("DEBUG: AI Analysis result: " + analysis.getFoodName());

        // 3. Đối chiếu xem món đó đã có trong dish_library chưa
        com.t2404e.aihealthcoach.repository.DishLibraryRepository dishLibraryRepo = com.t2404e.aihealthcoach.util.SpringContextUtil
                .getBean(com.t2404e.aihealthcoach.repository.DishLibraryRepository.class);

        com.t2404e.aihealthcoach.entity.DishLibrary matchedDish = dishLibraryRepo
                .findByNameContainingIgnoreCase(analysis.getFoodName())
                .stream().findFirst().orElse(null);

        Long dishId = null;
        if (matchedDish != null) {
            dishId = matchedDish.getId();
            // Cập nhật calo chuẩn từ thư viện nếu tìm thấy khớp
            analysis.setEstimatedCalories(matchedDish.getBaseCalories());
            System.out.println("DEBUG: Matched dish in library: " + matchedDish.getName() + " (ID: " + dishId + ")");
        } else if (plannedMealId != null) {
            dishId = plannedMealRepository.findById(plannedMealId)
                    .map(pm -> pm.getDish() != null ? pm.getDish().getId() : null)
                    .orElse(null);
        }

        // 4. Lưu vào DB (Cập nhật nếu đã có bản ghi từ sync thực đơn)
        UserMealLog log;
        if (plannedMealId != null) {
            log = logRepository.findFirstByPlannedMealIdOrderByLoggedAtDesc(plannedMealId)
                    .orElseGet(() -> UserMealLog.builder()
                            .userId(userId)
                            .plannedMealId(plannedMealId)
                            .build());
        } else {
            log = UserMealLog.builder()
                    .userId(userId)
                    .build();
        }

        // Xác định category: Ưu tiên tham số truyền vào -> Category cũ -> Loại từ
        // AI/Thư
        // viện
        String finalCategory = categoryParam;
        if (finalCategory == null || finalCategory.isEmpty()) {
            finalCategory = log.getCategory();
        }
        if (finalCategory == null || finalCategory.isEmpty()) {
            finalCategory = matchedDish != null ? matchedDish.getCategory().name() : "PHỤ";
        }

        // Cập nhật thông tin mới từ AI
        log.setImageUrl(imageUrl);
        log.setFoodName(analysis.getFoodName());
        log.setEstimatedCalories(analysis.getEstimatedCalories());
        log.setNutritionDetails(analysis.getNutritionDetails());
        log.setDishId(dishId);
        log.setCategory(mapToVietnameseCategory(finalCategory));
        log.setCheckedIn(true); // Đã đổi món/phân tích ảnh thì coi như đã ăn
        log.setIsPlanCompliant(plannedMealId != null); // Nếu có plannedMealId thì coi như liên quan đến kế hoạch

        logRepository.save(log);
        System.out.println("DEBUG: Meal log updated/saved with ID: " + log.getId());

        analysis.setType(log.getCategory()); // Trả về category đã map cho UI
        return analysis;
    }

    @Override
    public UserMealLog confirmCheckIn(MealAnalysisResponse checkInData, Long userId) {
        System.out.println("DEBUG: Processing check-in for user: " + userId);

        String details = checkInData.getNutritionDetails();
        if (details == null)
            details = "Ăn theo kế hoạch";
        else
            details += " (Xác nhận theo kế hoạch)";

        // Xử lý dishId tương tự như trên
        Long dishId = null;
        if (checkInData.getPlannedMealId() != null) {
            dishId = plannedMealRepository.findById(checkInData.getPlannedMealId())
                    .map(pm -> pm.getDish() != null ? pm.getDish().getId() : null)
                    .orElse(null);
        }

        // Tạo log cho việc check-in (không có ảnh mới, nhưng có thể map với planned
        // meal)
        UserMealLog log = UserMealLog.builder()
                .userId(userId)
                .plannedMealId(checkInData.getPlannedMealId())
                .dishId(dishId)
                .foodName(checkInData.getFoodName())
                .imageUrl("") // Không bắt buộc ảnh khi check-in nhanh
                .estimatedCalories(checkInData.getEstimatedCalories())
                .isPlanCompliant(true) // Check-in nghĩa là tuân thủ
                .nutritionDetails(details)
                .category(mapToVietnameseCategory(checkInData.getType())) // Map category từ request
                .build();

        UserMealLog saved = logRepository.save(log);
        System.out.println("DEBUG: Check-in saved successfully. Log ID: " + saved.getId());
        return saved;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public UserMealLog checkInLog(Long logId, Long userId) {
        UserMealLog log = logRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhật ký bữa ăn: " + logId));

        if (!log.getUserId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Bạn không có quyền cập nhật nhật ký này");
        }

        log.setCheckedIn(true);
        return logRepository.save(log);
    }

    private String mapToVietnameseCategory(String category) {
        if (category == null)
            return "Phụ";
        return switch (category.toUpperCase()) {
            case "BREAKFAST", "SÁNG" -> "Sáng";
            case "LUNCH", "TRƯA" -> "Trưa";
            case "DINNER", "TỐI" -> "Tối";
            case "SNACK", "PHỤ" -> "Phụ";
            default -> category;
        };
    }
}
