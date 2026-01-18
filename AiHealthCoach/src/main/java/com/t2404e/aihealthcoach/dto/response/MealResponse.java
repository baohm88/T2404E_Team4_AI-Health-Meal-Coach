package com.t2404e.aihealthcoach.dto.response;

import com.t2404e.aihealthcoach.enums.MealTimeSlot;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealResponse {

    private MealTimeSlot timeSlot;
    private Integer recommendedCalories;
    private String note;
}
