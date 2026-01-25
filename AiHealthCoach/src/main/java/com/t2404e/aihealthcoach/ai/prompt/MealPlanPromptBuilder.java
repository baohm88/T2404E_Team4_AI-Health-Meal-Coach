package com.t2404e.aihealthcoach.ai.prompt;

import com.t2404e.aihealthcoach.entity.DishLibrary;
import com.t2404e.aihealthcoach.entity.HealthAnalysis;
import com.t2404e.aihealthcoach.entity.HealthProfile;

import java.util.List;
import java.util.stream.Collectors;

public class MealPlanPromptBuilder {

  private MealPlanPromptBuilder() {
  }

  public static String build(
      HealthProfile profile,
      HealthAnalysis analysis,
      List<DishLibrary> dishes,
      int startDay,
      int endDay) {
    return """
        THÔNG TIN SỨC KHỎE NGƯỜI DÙNG (LƯU TỪ DATABASE):
        %s

        PHÂN TÍCH DINH DƯỠNG MỤC TIÊU:
        %s

        THƯ VIỆN MÓN ĂN CÓ SẴN (BẮT BUỘC CHỌN TỪ ĐÂY):
        %s

        YÊU CẦU:
        - Dựa trên HealthProfile + Thư viện món ăn ở trên
        - Sinh thực đơn từ ngày %d đến ngày %d (Tổng cộng %d ngày)
        - Mỗi ngày 4 bữa (Sáng, Trưa, Tối, Phụ)
        - CHỈ ĐƯỢC CHỌN món ăn có trong Thư viện món ăn.
        - Trả về đúng dishId.
        - Tổng calories/ngày phải phù hợp với mục tiêu cân nặng.

        CHỈ TRẢ JSON.
        """.formatted(
        buildProfileText(profile),
        buildAnalysisText(analysis),
        buildDishLibraryText(dishes),
        startDay,
        endDay,
        (endDay - startDay + 1));
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
