package com.t2404e.aihealthcoach.ai.prompt;

import com.t2404e.aihealthcoach.entity.DishLibrary;
import com.t2404e.aihealthcoach.entity.HealthAnalysis;
import com.t2404e.aihealthcoach.entity.HealthProfile;

import java.util.List;
import java.util.stream.Collectors;

public class MealPlanPromptBuilder {

  public static String build(
      HealthProfile profile,
      HealthAnalysis analysis,
      List<DishLibrary> dishes,
      int startDay,
      int endDay) {
    return build(profile, analysis, dishes, startDay, endDay, 2000); // Default 2000
  }

  public static String build(
      HealthProfile profile,
      HealthAnalysis analysis,
      List<DishLibrary> dishes,
      int startDay,
      int endDay,
      int targetDailyCalories) {
    return """
        THÔNG TIN SỨC KHỎE NGƯỜI DÙNG:
        %s

        PHÂN TÍCH DINH DƯỠNG MỤC TIÊU:
        %s

        PHẠM VI THỜI GIAN (QUAN TRỌNG):
        - Lộ trình cho từ ngày %d đến ngày %d.
        - Trong JSON, trường "day" PHẢI khớp chính xác với số ngày tuyệt đối này (từ %d đến %d).

        MỤC TIÊU CALO LỘ TRÌNH:
        - Mục tiêu Calo hằng ngày KHUYÊN DÙNG: %d kcal.
        - TỔNG CALO TRONG TUẦN (7 ngày) PHẢI sát với: %d kcal (+/- 0-3%%).
        - Bạn có thể linh hoạt: một số ngày Calo có thể cao hơn hoặc thấp hơn mục tiêu (%d kcal), miễn là TỔNG TUẦN cân bằng.

        THƯ VIỆN MÓN ĂN (BẮT BUỘC CHỌN TẤT CẢ TỪ ĐÂY):
        %s

        YÊU CẦU QUAN TRỌNG:
        1. Mục tiêu Calo hằng ngày: Phải đảm bảo Tổng Calo của 4 bữa cộng lại sát với mức %d kcal (Sai số tối đa 3%%).
        2. Cơ chế Combo (BẮT BUỘC): Không được chọn duy nhất 1 món rau cho bữa Trưa/Tối. Phải kết hợp ít nhất 2-3 món (Ví dụ: Cơm trắng + Thịt kho + Canh rau) để đạt đủ năng lượng.
        3. Tinh bột: Bữa Trưa và Tối BẮT BUỘC phải có 1 món tinh bột (Cơm, Bún, Phở...).
        4. Tổng tuần chuẩn xác: Đảm bảo tổng năng lượng hằng tuần sát với mức %d kcal.
        5. Trả về đúng dishId.

        CHỈ TRẢ JSON.
        """
        .formatted(
            buildProfileText(profile),
            buildAnalysisText(analysis),
            startDay, endDay, startDay, endDay,
            targetDailyCalories,
            targetDailyCalories * 7,
            targetDailyCalories,
            buildDishLibraryText(dishes),
            targetDailyCalories,
            targetDailyCalories * 7);
  }

  private static String buildProfileText(HealthProfile p) {
    return """
        - Tuổi: %d
        - Giới tính: %s
        - Chiều cao: %.1f cm
        - Cân nặng: %.1f kg
        - Mức độ vận động: %s
        - Thời gian ngủ: %s
        - Mức độ stress: %s
        """.formatted(
        p.getAge(),
        p.getGender(),
        p.getHeight(),
        p.getWeight(),
        p.getActivityLevel(),
        p.getSleepDuration(),
        p.getStressLevel());
  }

  private static String buildAnalysisText(HealthAnalysis a) {
    if (a == null || a.getAnalysisJson() == null)
      return "- Chưa có phân tích sức khỏe.";
    // Chỉ lấy phần đầu của JSON (thường chứa TDEE, BMI, Goal) để tiết kiệm token
    String json = a.getAnalysisJson();
    if (json.length() > 1000) {
      json = json.substring(0, 1000) + "...";
    }
    return "THÔNG TIN PHÂN TÍCH (Tóm tắt):\n" + json;
  }

  private static String buildDishLibraryText(List<DishLibrary> dishes) {
    return dishes.stream()
        .map(d -> {
          String vn = switch (d.getCategory()) {
            case BREAKFAST -> "S";
            case LUNCH -> "Tr";
            case DINNER -> "T";
            case SNACK -> "P";
            default -> "O";
          };
          return "#%d:%s(%dkcal/%s)".formatted(d.getId(), d.getName(), d.getBaseCalories(), vn);
        })
        .collect(Collectors.joining("|"));
  }
}
