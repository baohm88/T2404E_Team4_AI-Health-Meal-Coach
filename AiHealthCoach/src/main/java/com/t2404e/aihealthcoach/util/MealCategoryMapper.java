package com.t2404e.aihealthcoach.util;

import com.t2404e.aihealthcoach.enums.MealTimeSlot;

public class MealCategoryMapper {

    public static MealTimeSlot mapVietnameseToEnum(String vietnameseCategory) {
        if (vietnameseCategory == null)
            return MealTimeSlot.SNACK;

        return switch (vietnameseCategory.toUpperCase()) {
            case "SÁNG", "BREAKFAST" -> MealTimeSlot.BREAKFAST;
            case "TRƯA", "LUNCH" -> MealTimeSlot.LUNCH;
            case "TỐI", "DINNER" -> MealTimeSlot.DINNER;
            default -> MealTimeSlot.SNACK;
        };
    }
}
