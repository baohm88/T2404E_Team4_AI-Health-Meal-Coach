package com.t2404e.aihealthcoach.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.t2404e.aihealthcoach.dto.response.ai.MealAnalysisResponse;
import com.t2404e.aihealthcoach.entity.UserMealLog;

public interface MealLogService {

    /**
     * Phân tích ảnh món ăn và lưu log
     * @param file File ảnh upload
     * @param userId ID người dùng
     * @param plannedMealId (Optional) ID bữa ăn trong kế hoạch
     * @return Kết quả phân tích
     */
    MealAnalysisResponse analyzeAndLog(MultipartFile file, Long userId, Long plannedMealId) throws IOException;

    /**
     * Check-in bữa ăn (không cần ảnh)
     * @param checkInData Dữ liệu món ăn
     * @param userId ID người dùng
     * @return Log đã lưu
     */
    UserMealLog confirmCheckIn(MealAnalysisResponse checkInData, Long userId);
}
