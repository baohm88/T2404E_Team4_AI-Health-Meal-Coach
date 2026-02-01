package com.t2404e.aihealthcoach.service.impl;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.t2404e.aihealthcoach.dto.response.ai.MealAnalysisResponse;
import com.t2404e.aihealthcoach.entity.PlannedMeal;
import com.t2404e.aihealthcoach.entity.UserMealLog;
import com.t2404e.aihealthcoach.repository.PlannedMealRepository;
import com.t2404e.aihealthcoach.repository.UserMealLogRepository;
import com.t2404e.aihealthcoach.service.AiMealVisionService;
import com.t2404e.aihealthcoach.service.CloudinaryService;
import com.t2404e.aihealthcoach.service.MealLogService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class MealLogServiceImpl implements MealLogService {

    private final CloudinaryService cloudinaryService;
    private final AiMealVisionService aiMealVisionService;
    private final UserMealLogRepository logRepository;
    private final PlannedMealRepository plannedMealRepository;
    private final com.t2404e.aihealthcoach.repository.DishLibraryRepository dishLibraryRepo;

    @Override
    public MealAnalysisResponse analyzeAndLog(MultipartFile file, Long userId, Long plannedMealId, String categoryParam)
            throws IOException {
        // 1. Upload ảnh lên Cloudinary
        // Upload file ảnh và nhận lại URL
        String imageUrl = cloudinaryService.uploadImage(file);
        log.info("Image uploaded to Cloudinary: {}", imageUrl);

        // 2. Gọi AI Vision phân thích
        // Gửi URL ảnh cho AI để nhận diện món ăn và dinh dưỡng
        MealAnalysisResponse analysis = aiMealVisionService.analyzeMealImage(imageUrl);
        analysis.setImageUrl(imageUrl); // Gán lại URL ảnh vào response
        log.info("AI Analysis result: {}", analysis.getFoodName());

        // Xác định category: Ưu tiên tham số truyền vào -> Loại từ AI/Thư viện
        String finalCategory = categoryParam;
        if (finalCategory == null || finalCategory.isEmpty()) {
            finalCategory = (plannedMealId != null)
                    ? logRepository.findFirstByPlannedMealIdOrderByLoggedAtDesc(plannedMealId)
                            .map(UserMealLog::getCategory)
                            .orElse("PHỤ")
                    : "PHỤ";
        }

        // 3. Đối chiếu xem món đó đã có trong dish_library chưa
        com.t2404e.aihealthcoach.entity.DishLibrary matchedDish = dishLibraryRepo
                .findByNameContainingIgnoreCase(analysis.getFoodName())
                .stream().findFirst().orElse(null);

        Long dishId = null;
        if (matchedDish != null) {
            dishId = matchedDish.getId();
            // Cập nhật calo chuẩn từ thư viện nếu tìm thấy khớp
            analysis.setEstimatedCalories(matchedDish.getBaseCalories());
            log.info("Matched dish in library: {} (ID: {})", matchedDish.getName(), dishId);
        } else {
            // Option 2: Tạo mới DishLibrary với trạng thái unverified
            com.t2404e.aihealthcoach.entity.DishLibrary newDish = com.t2404e.aihealthcoach.entity.DishLibrary.builder()
                    .name(analysis.getFoodName())
                    .baseCalories(analysis.getEstimatedCalories())
                    .category(com.t2404e.aihealthcoach.util.MealCategoryMapper.mapVietnameseToEnum(finalCategory))
                    .isVerified(false)
                    .isAiSuggested(true)
                    .isDeleted(false)
                    .description("AI nhận diện món từ hình ảnh người dùng.")
                    .build();
            com.t2404e.aihealthcoach.entity.DishLibrary savedDish = dishLibraryRepo.save(newDish);
            if (savedDish != null) {
                dishId = savedDish.getId();
                log.info("Created new unverified dish in library: {} (ID: {})", savedDish.getName(), dishId);
            }
        }

        // 4. Lưu vào DB (Cập nhật nếu đã có bản ghi từ sync thực đơn)
        UserMealLog logEntry;
        if (plannedMealId != null) {
            final Long pid = plannedMealId;
            logEntry = logRepository.findFirstByPlannedMealIdOrderByLoggedAtDesc(plannedMealId)
                    .orElseGet(() -> {
                        PlannedMeal pm = plannedMealRepository.findById(pid).orElse(null);
                        return UserMealLog.builder()
                                .userId(userId)
                                .plannedMealId(pid)
                                .dayNumber(pm != null ? pm.getDayNumber() : null)
                                .category(pm != null ? pm.getCategory() : null)
                                .build();
                    });
        } else {
            logEntry = UserMealLog.builder()
                    .userId(userId)
                    .build();
        }

        // Cập nhật thông tin mới từ AI
        logEntry.setImageUrl(imageUrl);
        logEntry.setFoodName(analysis.getFoodName());
        logEntry.setEstimatedCalories(analysis.getEstimatedCalories());
        logEntry.setNutritionDetails(analysis.getNutritionDetails());
        logEntry.setDishId(dishId);
        if (logEntry.getCategory() == null || logEntry.getCategory().isEmpty() || categoryParam != null) {
            logEntry.setCategory(mapToVietnameseCategory(finalCategory));
        }
        logEntry.setCheckedIn(true); // Đã đổi món/phân tích ảnh thì coi như đã ăn
        logEntry.setIsPlanCompliant(plannedMealId != null); // Nếu có plannedMealId thì coi như liên quan đến kế hoạch

        logRepository.save(logEntry);
        log.info("Meal log updated/saved with ID: {}", logEntry.getId());

        analysis.setType(logEntry.getCategory()); // Trả về category đã map cho UI
        return analysis;
    }

    @Override
    public MealAnalysisResponse analyzeTextAndLog(String text, Long userId, Long plannedMealId, String categoryParam) {
        // 1. Gọi AI Vision phân tích văn bản
        MealAnalysisResponse analysis = aiMealVisionService.analyzeMealText(text);
        log.info("AI Text Analysis result: {}", analysis.getFoodName());

        // Xác định category (tương tự analyzeAndLog)
        String finalCategory = categoryParam;
        if (finalCategory == null || finalCategory.isEmpty()) {
            finalCategory = (plannedMealId != null)
                    ? logRepository.findFirstByPlannedMealIdOrderByLoggedAtDesc(plannedMealId)
                            .map(UserMealLog::getCategory)
                            .orElse("PHỤ")
                    : "PHỤ";
        }

        // 2. Đối chiếu thư viện món ăn
        com.t2404e.aihealthcoach.entity.DishLibrary matchedDish = dishLibraryRepo
                .findByNameContainingIgnoreCase(analysis.getFoodName())
                .stream().findFirst().orElse(null);

        Long dishId = null;
        if (matchedDish != null) {
            dishId = matchedDish.getId();
            analysis.setEstimatedCalories(matchedDish.getBaseCalories());
        } else {
            com.t2404e.aihealthcoach.entity.DishLibrary newDish = com.t2404e.aihealthcoach.entity.DishLibrary.builder()
                    .name(analysis.getFoodName())
                    .baseCalories(analysis.getEstimatedCalories())
                    .category(com.t2404e.aihealthcoach.util.MealCategoryMapper.mapVietnameseToEnum(finalCategory))
                    .isVerified(false)
                    .isAiSuggested(true)
                    .isDeleted(false)
                    .description("AI nhận diện món từ văn bản/giọng nói người dùng.")
                    .build();
            newDish = dishLibraryRepo.save(newDish);
            dishId = newDish.getId();
        }

        // 3. Lưu log
        UserMealLog logEntry;
        if (plannedMealId != null) {
            final Long pid = plannedMealId;
            logEntry = logRepository.findFirstByPlannedMealIdOrderByLoggedAtDesc(pid)
                    .orElseGet(() -> {
                        PlannedMeal pm = plannedMealRepository.findById(pid).orElse(null);
                        return UserMealLog.builder()
                                .userId(userId)
                                .plannedMealId(pid)
                                .dayNumber(pm != null ? pm.getDayNumber() : null)
                                .category(pm != null ? pm.getCategory() : null)
                                .build();
                    });
        } else {
            logEntry = UserMealLog.builder()
                    .userId(userId)
                    .build();
        }

        logEntry.setFoodName(analysis.getFoodName());
        logEntry.setEstimatedCalories(analysis.getEstimatedCalories());
        logEntry.setNutritionDetails(analysis.getNutritionDetails());
        logEntry.setDishId(dishId);
        if (logEntry.getCategory() == null || logEntry.getCategory().isEmpty() || categoryParam != null) {
            logEntry.setCategory(mapToVietnameseCategory(finalCategory));
        }
        logEntry.setCheckedIn(true);
        logEntry.setIsPlanCompliant(plannedMealId != null);
        logEntry.setImageUrl(""); // Không có ảnh cho text input

        logRepository.save(logEntry);
        analysis.setType(logEntry.getCategory());
        return analysis;
    }

    @Override
    public UserMealLog confirmCheckIn(MealAnalysisResponse checkInData, Long userId) {
        log.info("Processing check-in for user: {}", userId);

        String details = checkInData.getNutritionDetails();
        if (details == null)
            details = "Ăn theo kế hoạch";
        else
            details += " (Xác nhận theo kế hoạch)";

        // Xử lý dishId tương tự như trên
        Long dishId = null;
        if (checkInData.getPlannedMealId() != null) {
            final Long pid = checkInData.getPlannedMealId();
            if (pid != null) {
                dishId = plannedMealRepository.findById(pid)
                        .map(pm -> pm.getDish() != null ? pm.getDish().getId() : null)
                        .orElse(null);
            }
        }

        // Tạo log hoặc cập nhật log cũ cho việc check-in
        UserMealLog logEntry;
        if (checkInData.getPlannedMealId() != null) {
            final Long pid = checkInData.getPlannedMealId();
            logEntry = logRepository.findFirstByPlannedMealIdOrderByLoggedAtDesc(pid)
                    .orElseGet(() -> {
                        PlannedMeal pm = plannedMealRepository.findById(pid).orElse(null);
                        return UserMealLog.builder()
                                .userId(userId)
                                .plannedMealId(pid)
                                .dayNumber(pm != null ? pm.getDayNumber() : null)
                                .category(pm != null ? pm.getCategory() : null)
                                .build();
                    });
        } else {
            logEntry = UserMealLog.builder()
                    .userId(userId)
                    .build();
        }

        logEntry.setDishId(dishId);
        logEntry.setFoodName(checkInData.getFoodName());
        logEntry.setImageUrl(checkInData.getImageUrl() != null ? checkInData.getImageUrl() : "");
        logEntry.setEstimatedCalories(checkInData.getEstimatedCalories());
        logEntry.setIsPlanCompliant(true); // Check-in nghĩa là tuân thủ
        logEntry.setNutritionDetails(details);
        logEntry.setCheckedIn(true);
        if (logEntry.getCategory() == null || logEntry.getCategory().isEmpty()) {
            logEntry.setCategory(mapToVietnameseCategory(checkInData.getType()));
        }

        UserMealLog saved = logRepository.save(logEntry);
        log.info("Check-in saved successfully. Log ID: {}", saved.getId());
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

    @Override
    public org.springframework.data.domain.Page<com.t2404e.aihealthcoach.entity.DishLibrary> searchDishes(
            String keyword, String category, int page, int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        com.t2404e.aihealthcoach.enums.MealTimeSlot slot = null;
        if (category != null && !category.isEmpty()) {
            try {
                slot = com.t2404e.aihealthcoach.util.MealCategoryMapper.mapVietnameseToEnum(category);
            } catch (Exception e) {
                // ignore
            }
        }

        // Cần dùng các method có IsDeletedFalse để đảm bảo không lấy món đã ẩn
        if (keyword == null || keyword.isEmpty()) {
            if (slot != null)
                return dishLibraryRepo.findByCategoryAndIsDeletedFalse(slot, pageable);
            return dishLibraryRepo.findAllByIsDeletedFalse(pageable);
        }

        if (slot != null)
            return dishLibraryRepo.findByNameContainingIgnoreCaseAndCategoryAndIsDeletedFalse(keyword, slot, pageable);
        return dishLibraryRepo.findByNameContainingIgnoreCaseAndIsDeletedFalse(keyword, pageable);
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
