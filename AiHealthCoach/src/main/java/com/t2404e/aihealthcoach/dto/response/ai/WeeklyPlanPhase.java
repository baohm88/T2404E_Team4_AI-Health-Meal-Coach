package com.t2404e.aihealthcoach.dto.response.ai;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyPlanPhase {
    private int week; // 1, 2, 3, 4
    private String title; // Ví dụ: Làm quen, Tăng tốc, Duy trì
    private String nutritionFocus; // Trọng tâm dinh dưỡng
    private String mealTips; // Gợi ý ăn uống cụ thể
    private String note; // Ghi chú thêm
}
