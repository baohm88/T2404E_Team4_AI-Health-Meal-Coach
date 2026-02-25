package com.t2404e.aihealthcoach.enums;

public enum PointActionType {
    MEAL_LOG_COMPLIANT, // +10 points
    DAILY_COMPLETE, // +30 points
    STREAK_MILESTONE_7, // +100 points
    STREAK_MILESTONE_30, // +500 points
    STREAK_MILESTONE_90, // +1500 points
    STREAK_FREEZE_PURCHASE, // -50 points
    STREAK_RECOVERY // Cost depends on logic
}
