package com.t2404e.aihealthcoach.ai.prompt;

import com.t2404e.aihealthcoach.entity.HealthAnalysis;
import com.t2404e.aihealthcoach.entity.HealthProfile;

public class MealPlanPromptBuilder {

    private MealPlanPromptBuilder() {}

    public static String build(
            HealthProfile profile,
            HealthAnalysis analysis
    ) {
        return """
THÔNG TIN SỨC KHỎE NGƯỜI DÙNG (LƯU TỪ DATABASE):
%s

THÔNG TIN PHÂN TÍCH SỨC KHỎE (JSON):
%s

YÊU CẦU:
- Dựa trên HealthProfile + HealthAnalysis ở trên
- Sinh thực đơn CHI TIẾT 90 NGÀY kể từ hôm nay
- Phù hợp mục tiêu 3 tháng trong HealthAnalysis
- Mỗi ngày 3–5 bữa
- Mỗi bữa gồm:
  + Tên món (tiếng Việt)
  + Số lượng
  + Calories
- Tổng calories/ngày phải phù hợp từng giai đoạn

CHỈ TRẢ JSON.
""".formatted(
                buildProfileText(profile),
                analysis.getAnalysisJson()
        );
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
                p.getStressLevel()
        );
    }
}
