package com.t2404e.aihealthcoach.dto.response.ai;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealPlanDetail {
    private String mealName; // Ví dụ: Bánh bao nhân thịt + trứng cút
    private String quantity; // Ví dụ: 2 cái
    private Integer calories; // Ví dụ: 300
    private String type; // Sáng, Trưa, Tối, Phụ
}
