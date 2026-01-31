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
        3. SỐ PHẢI LÀ SỐ HỢP LỆ (Ví dụ: 20.0 hoặc 20, KHÔNG ĐƯỢC là "20." hay "20,").
        3. TẤT CẢ các mô tả phải giàu thông tin, chuyên sâu và mang tính thực tiễn cao (Actionable).
        4. sampleDailyMeals phải bao gồm ít nhất 4 món: Sáng, Trưa, Tối và Phụ.
        5. Ưu tiên các món ăn Việt Nam truyền thống nhưng lành mạnh.
        6. Kế hoạch mỗi tháng PHẢI được chia nhỏ thành 4 tuần trong trường `weeks`.
        7. Trong phần `weeks`, CHỈ TẬP TRUNG VÀO DINH DƯỠNG. KHÔNG liệt kê các bài tập hay hoạt động thể chất.

        CÔNG THỨC TÍNH TOÁN CALO CHUẨN KHOA HỌC (BẮT BUỘC TUÂN THỦ):
        Bước 1: Tính BMR (Mifflin-St Jeor)
        - Nam: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
        - Nữ: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
        Bước 2: Tính TDEE = BMR × Activity Factor
        - Sedentary (Ít vận động): 1.2
        - Lightly Active (Nhẹ): 1.375
        - Moderately Active (Vừa): 1.55
        - Very Active (Năng động): 1.725
        Bước 3: Xác định Calories Mục Tiêu (Daily Target)
        - Giảm cân (Weight Loss): TDEE - 500 kcal (Lưu ý: KHÔNG thấp hơn BMR).
        - Tăng cân (Muscle Gain): TDEE + 300 kcal.
        - Giữ cân (Maintenance): = TDEE.
        LƯU Ý: Trường `dailyCalories` trong JSON PHẢI là kết quả tính toán từ công thức trên.

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

    // 1. Tính toán BMR (Mifflin-St Jeor)
    double bmr = 0;
    if (request.getGender().name().equalsIgnoreCase("MALE")) {
      bmr = (10 * request.getWeight()) + (6.25 * request.getHeight()) - (5 * request.getAge()) + 5;
    } else {
      bmr = (10 * request.getWeight()) + (6.25 * request.getHeight()) - (5 * request.getAge()) - 161;
    }

    // 2. Tính TDEE
    double activityMultiplier = switch (request.getActivityLevel()) {
      case SEDENTARY -> 1.2;
      case LIGHT -> 1.375;
      case MODERATE -> 1.55;
      case VERY_ACTIVE -> 1.725;
    };
    double tdee = bmr * activityMultiplier;

    // 3. Xác định Target
    double targetCalories = tdee;
    // Simple heuristic for initial goal (can be refined or let AI choose goal enum,
    // but here we set number)
    // Assume Maintenance as base, but we can infer goal from request if it existed.
    // However, since we don't have explicit goal input, we'll let AI decide goal
    // TEXT, but we provide TDEE as anchor.
    // BETTER STRATEGY: Calculate all 3 numeric scenarios and let AI pick based on
    // its textual analysis of BMI?
    // User wants "phù hợp". Let's provide the ANCHORS.

    // Actually, let's default to a "Healthy" adjustment based on BMI.
    double bmi = request.getWeight() / ((request.getHeight() / 100) * (request.getHeight() / 100));
    if (bmi >= 25) {
      targetCalories = tdee - 500; // Weight Loss
      if (targetCalories < bmr)
        targetCalories = bmr; // Safety
    } else if (bmi < 18.5) {
      targetCalories = tdee + 300; // Weight Gain
    }
    // Else Maintenance

    String userPrompt = String.format(
        """
                                    Dữ liệu người dùng:
                                    - Tuổi: %d
                                    - Giới tính: %s
                                    - Chiều cao: %.1f cm
                                    - Cân nặng: %.1f kg
                                    - Mức độ vận động: %s
                                    - Thời gian ngủ: %s
                                    - Mức độ stress: %s

                                    DỮ LIỆU TÍNH TOÁN TRƯỚC (BẮT BUỘC SỬ DỤNG):
                                    - BMR (Basal Metabolic Rate): %.0f kcal
                                    - TDEE (Total Daily Energy Expenditure): %.0f kcal
                                    - MỤC TIÊU CALO HẰNG NGÀY (DAILY TARGET): %.0f kcal

                                    Hãy phân tích sức khỏe tổng thể và lập kế hoạch cải thiện trong 3 tháng dựa trên các chỉ số trên.
                                    TOÀN BỘ NỘI DUNG MÔ TẢ PHẢI VIẾT BẰNG TIẾNG VIỆT.
            """,
        request.getAge(),
        request.getGender().name(),
        request.getHeight(),
        request.getWeight(),
        request.getActivityLevel().name(),
        request.getSleepDuration().name(),
        request.getStressLevel().name(),
        bmr, tdee, targetCalories);

    // GỌI AI THẬT
    return chatClient.prompt()
        .system(systemPrompt)
        .user(userPrompt)
        .call()
        .entity(AiHealthAnalysisResponse.class);
  }
}
