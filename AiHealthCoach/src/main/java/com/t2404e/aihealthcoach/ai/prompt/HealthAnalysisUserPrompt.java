package com.t2404e.aihealthcoach.ai.prompt;

import com.t2404e.aihealthcoach.enums.*;

public class HealthAnalysisUserPrompt {

    public static String build(
            int age,
            Gender gender,
            double heightCm,
            double weightKg,
            ActivityLevel activityLevel,
            SleepDuration sleepDuration,
            StressLevel stressLevel
    ) {
        return String.format("""
Dữ liệu người dùng:
- Tuổi: %d
- Giới tính: %s
- Chiều cao: %.1f cm
- Cân nặng: %.1f kg
- Mức độ vận động: %s
- Thời gian ngủ: %s
- Mức độ stress: %s

Hãy phân tích sức khỏe tổng thể và lập kế hoạch cải thiện trong 3 tháng.
""",
                age,
                gender.name(),
                heightCm,
                weightKg,
                activityLevel.name(),
                sleepDuration.name(),
                stressLevel.name()
        );
    }
}
