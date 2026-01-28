package com.t2404e.aihealthcoach.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.t2404e.aihealthcoach.dto.response.ai.MealAnalysisResponse;
import com.t2404e.aihealthcoach.entity.UserMealLog;

public interface MealLogService {

    /**
     * Phân tích ảnh món ăn và lưu log
     * 
     * @param file          File ảnh upload
     * @param userId        ID người dùng
     * @param plannedMealId (Optional) ID bữa ăn trong kế hoạch
     * @return Kết quả phân tích
     */
    MealAnalysisResponse analyzeAndLog(MultipartFile file, Long userId, Long plannedMealId, String category)
            throws IOException;

    /**
     * Phân tích văn bản/giọng nói và lưu log
     */
    MealAnalysisResponse analyzeTextAndLog(String text, Long userId, Long plannedMealId, String category);

    UserMealLog confirmCheckIn(MealAnalysisResponse checkInData, Long userId);

    /**
     * Cập nhật trạng thái đã ăn cho một log có sẵn
     * 
     * @param logId  ID của bản ghi nhật ký
     * @param userId ID người dùng
     * @return Log đã cập nhật
     */
    UserMealLog checkInLog(Long logId, Long userId);

    /**
     * Tìm kiếm món ăn từ thư viện (cho người dùng)
     */
    org.springframework.data.domain.Page<com.t2404e.aihealthcoach.entity.DishLibrary> searchDishes(String keyword,
            String category, int page, int size);
}
