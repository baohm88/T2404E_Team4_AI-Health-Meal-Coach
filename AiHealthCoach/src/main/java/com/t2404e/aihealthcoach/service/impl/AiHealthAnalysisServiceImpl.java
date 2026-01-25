package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.request.HealthProfileRequest;
import com.t2404e.aihealthcoach.dto.response.ai.AiHealthAnalysisResponse;
import com.t2404e.aihealthcoach.service.AiHealthAnalysisService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiHealthAnalysisServiceImpl implements AiHealthAnalysisService {

  private final ChatClient chatClient;

  public AiHealthAnalysisServiceImpl(ChatClient.Builder builder) {
    this.chatClient = builder.build();
  }

  @Override
  public AiHealthAnalysisResponse analyze(HealthProfileRequest request) {

    String systemPrompt = """
        Bạn là một chuyên gia dinh dưỡng thực thụ (Senior Nutritionist) người Việt.
        Mục tiêu của bạn là cung cấp một kế hoạch chi tiết đến từng chi tiết nhỏ nhất dựa trên hồ sơ sức khỏe.

        QUY TẮC BẮT BUỘC:
        1. TRẢ JSON DUY NHẤT. KHÔNG CÓ TEXT BÊN NGOÀI.
        2. KHÔNG ĐƯỢC trả về null cho bất kỳ trường nào trong `months`.
        3. TẤT CẢ các mô tả phải giàu thông tin, chuyên sâu và mang tính thực tiễn cao (Actionable).
        4. sampleDailyMeals phải bao gồm ít nhất 4 món: Sáng, Trưa, Tối và Phụ.
        5. Ưu tiên các món ăn Việt Nam truyền thống nhưng lành mạnh.
        6. Kế hoạch mỗi tháng PHẢI được chia nhỏ thành 4 tuần trong trường `weeks`.
        7. Trong phần `weeks`, CHỈ TẬP TRUNG VÀO DINH DƯỠNG. KHÔNG liệt kê các bài tập hay hoạt động thể chất.

        VÍ DỤ VỀ ĐỘ CHI TIẾT CẦN THIẾT (FEW-SHOT):
        - macronutrients: "Đạm: 140g (25%)- Béo: 60g (30%)- Tinh bột: 200g (45%)"
        - specificActions: "- Uống 3L nước lọc mỗi ngày. - Đi bộ nhanh 15p sau mỗi bữa ăn chính. - Ngủ đủ 8 tiếng, bắt đầu từ 22h30."
        - weeks: [
            {
              "week": 1,
              "title": "Thanh lọc cơ thể",
              "nutritionFocus": "Nạp nhiều chất xơ, giảm tinh bột nhanh",
              "mealTips": "Bắt đầu ngày mới với nước chanh ấm, ăn nhiều rau xanh trong bữa trưa",
              "note": "Hạn chế đồ uống có gas"
            }
          ]
        - sampleDailyMeals: [
            {"mealName": "Phở gà lườn (không da)", "quantity": "1 bát tô vừa (150g bánh phở)", "calories": 420, "type": "Sáng"},
            {"mealName": "Cơm tấm bì chả (hạn chế mỡ hành)", "quantity": "1 đĩa (1 bát cơm trắng)", "calories": 550, "type": "Trưa"}
        ]

        CẤU TRÚC JSON KHÔNG ĐƯỢC THAY ĐỔI:
        {
          "analysis": {
            "bmi": number,
            "bmr": number,
            "tdee": number,
            "healthStatus": "UNDERWEIGHT | NORMAL | OVERWEIGHT | OBESE",
            "summary": "string (Phân tích chi tiết)"
          },
          "lifestyleInsights": { "activity": "string", "sleep": "string", "stress": "string" },
          "threeMonthPlan": {
            "goal": "WEIGHT_LOSS | MUSCLE_GAIN | MAINTENANCE",
            "totalTargetWeightChangeKg": number,
            "months": [
              {
                "month": number,
                "title": "string (Tên giai đoạn)",
                "dailyCalories": number,
                "macronutrients": "string (Số gram & Tỷ lệ %)",
                "habitFocus": "string (Thói quen chính của tháng)",
                "mealTips": "string (Danh sách thực phẩm nên ăn/tránh)",
                "specificActions": "string (Các hành động đo lường được)",
                "sampleDailyMeals": [
                  { "mealName": "string", "quantity": "string", "calories": number, "type": "string" }
                ],
                "weeks": [
                  {
                    "week": number,
                    "title": "string",
                    "nutritionFocus": "string",
                    "mealTips": "string",
                    "note": "string"
                  }
                ],
                "note": "string (Lời khuyên chuyên sâu)"
              }
            ]
          }
        }
        """;

    String userPrompt = String.format("""
                                Dữ liệu người dùng:
                                - Tuổi: %d
                                - Giới tính: %s
                                - Chiều cao: %.1f cm
                                - Cân nặng: %.1f kg
                                - Mức độ vận động: %s
                                - Thời gian ngủ: %s
                                - Mức độ stress: %s

                                Hãy phân tích sức khỏe tổng thể và lập kế hoạch cải thiện trong 3 tháng.
                                TOÀN BỘ NỘI DUNG MÔ TẢ PHẢI VIẾT BẰNG TIẾNG VIỆT.
        """,
        request.getAge(),
        request.getGender().name(),
        request.getHeight(),
        request.getWeight(),
        request.getActivityLevel().name(),
        request.getSleepDuration().name(),
        request.getStressLevel().name());

    // GỌI AI THẬT
    return chatClient.prompt()
        .system(systemPrompt)
        .user(userPrompt)
        .call()
        .entity(AiHealthAnalysisResponse.class);
  }
}
