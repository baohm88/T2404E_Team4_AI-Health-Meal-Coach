package com.t2404e.aihealthcoach.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyPlanResponse {

    private Integer dayIndex;
    private LocalDate planDate;
    private Integer targetCalories;
    private String note;
}
