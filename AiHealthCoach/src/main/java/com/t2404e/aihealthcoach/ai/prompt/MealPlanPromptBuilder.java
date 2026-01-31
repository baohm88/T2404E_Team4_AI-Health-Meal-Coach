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

        MỤC TIÊU CALO LỘ TRÌNH:
        - Mục tiêu Calo hằng ngày KHUYÊN DÙNG: %d kcal.
        - TỔNG CALO TRONG TUẦN (7 ngày) PHẢI sát với: %d kcal (+/- 0-3%%).
        - Bạn có thể linh hoạt: một số ngày Calo có thể cao hơn hoặc thấp hơn mục tiêu (%d kcal), miễn là TỔNG TUẦN cân bằng.
        - Điều này giúp thực đơn tự nhiên và thực tế hơn.

        THƯ VIỆN MÓN ĂN (BẮT BUỘC CHỌN TỪ ĐÂY):
        %s

        YÊU CẦU QUAN TRỌNG:
        1. Linh hoạt hằng ngày: Không cần ép mỗi ngày phải đúng chóc %d kcal. Hãy chọn tổ hợp món ăn hợp lý.
        2. Tổng tuần chuẩn xác: Đảm bảo tổng năng lượng của tất cả món ăn trong 7 ngày cộng lại sát với mức %d kcal (Sai số tối đa 3%%).
        3. Tự nhiên & Thực tế: CHỈ chọn các món có sẵn trong thư viện. Sử dụng "số lượng" (1 bát, 1 đĩa, 150g...) một cách thực tế. KHÔNG dùng các con số lẻ bất thường (ví dụ: 1.23 bát) chỉ để khớp số Calo.
        4. Mỗi ngày 4 bữa: Sáng, Trưa, Tối, Phụ.
        5. Trả về đúng dishId.

        CHỈ TRẢ JSON.
        """
        .formatted(
            buildProfileText(profile),
            buildAnalysisText(analysis),
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
