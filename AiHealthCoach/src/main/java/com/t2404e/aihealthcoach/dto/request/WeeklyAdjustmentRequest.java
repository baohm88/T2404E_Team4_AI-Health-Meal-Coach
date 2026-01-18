package com.t2404e.aihealthcoach.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeeklyAdjustmentRequest {

    @NotNull(message = "Adherence score is required")
    @Min(value = 0, message = "Adherence score must be >= 0")
    @Max(value = 100, message = "Adherence score must be <= 100")
    private Integer adherenceScore;

    private String note;
}
