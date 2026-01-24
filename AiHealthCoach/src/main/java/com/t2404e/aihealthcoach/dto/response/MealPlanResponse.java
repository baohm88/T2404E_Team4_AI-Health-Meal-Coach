package com.t2404e.aihealthcoach.dto.response;

import java.time.LocalDate;

public record MealPlanResponse(
        LocalDate startDate,
        Integer totalDays,
        Object plan // Map<String, Object>
) {}
