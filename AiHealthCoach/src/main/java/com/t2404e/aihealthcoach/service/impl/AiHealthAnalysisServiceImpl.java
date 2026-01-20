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
                Bạn là chuyên gia dinh dưỡng và huấn luyện sức khỏe người Việt.
                
                NHIỆM VỤ DUY NHẤT:
                Trả về MỘT JSON DUY NHẤT, HỢP LỆ, ĐÚNG CẤU TRÚC.
                
                QUY TẮC BẮT BUỘC (KHÔNG ĐƯỢC VI PHẠM):
                - CHỈ TRẢ JSON (no text, no markdown)
                - KHÔNG giải thích
                - KHÔNG ghi chú
                - KHÔNG dùng tiếng Anh trong nội dung mô tả
                - TẤT CẢ giá trị kiểu string PHẢI BẰNG TIẾNG VIỆT
                - CHỈ RIÊNG:
                  - field name
                  - enum value (UNDERWEIGHT, NORMAL, OVERWEIGHT, OBESE, WEIGHT_LOSS, ...)
                  → GIỮ NGUYÊN TIẾNG ANH
                
                RÀNG BUỘC NGÔN NGỮ (CỰC KỲ QUAN TRỌNG):
                - analysis.summary → TIẾNG VIỆT
                - lifestyleInsights.activity → TIẾNG VIỆT
                - lifestyleInsights.sleep → TIẾNG VIỆT
                - lifestyleInsights.stress → TIẾNG VIỆT
                - threeMonthPlan.months[].title → TIẾNG VIỆT
                - threeMonthPlan.months[].note → TIẾNG VIỆT
                
                NẾU BẤT KỲ CHUỖI NÀO KHÔNG PHẢI TIẾNG VIỆT → KẾT QUẢ BỊ COI LÀ SAI.
                
                CẤU TRÚC JSON BẮT BUỘC:
                
                {
                  "analysis": {
                    "bmi": number,
                    "bmr": number,
                    "tdee": number,
                    "healthStatus": "UNDERWEIGHT | NORMAL | OVERWEIGHT | OBESE",
                    "summary": "string (TIẾNG VIỆT)"
                  },
                  "lifestyleInsights": {
                    "activity": "string (TIẾNG VIỆT)",
                    "sleep": "string (TIẾNG VIỆT)",
                    "stress": "string (TIẾNG VIỆT)"
                  },
                  "threeMonthPlan": {
                    "goal": "WEIGHT_LOSS | MUSCLE_GAIN | MAINTENANCE",
                    "totalTargetWeightChangeKg": number,
                    "months": [
                      {
                        "month": number,
                        "title": "string (TIẾNG VIỆT)",
                        "dailyCalories": number,
                        "note": "string (TIẾNG VIỆT)"
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
                request.getStressLevel().name()
        );

        // GỌI AI THẬT
        return chatClient.prompt()
                .system(systemPrompt)
                .user(userPrompt)
                .call()
                .entity(AiHealthAnalysisResponse.class);
    }
}
