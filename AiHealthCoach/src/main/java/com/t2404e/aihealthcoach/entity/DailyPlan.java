package com.t2404e.aihealthcoach.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Gắn với WeeklyPlan
    @Column(name = "weekly_plan_id", nullable = false)
    private Long weeklyPlanId;

    // Ngày thứ mấy trong tuần (1–7)
    @Column(name = "day_index", nullable = false)
    private Integer dayIndex;

    // Ngày thực tế (optional nhưng rất ăn điểm)
    @Column(name = "plan_date")
    private LocalDate planDate;

    /**
     * Calories mục tiêu trong ngày
     */
    @Column(name = "target_calories", nullable = false)
    private Integer targetCalories;

    /**
     * Ghi chú / lời khuyên
     */
    @Column(columnDefinition = "TEXT")
    private String note;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
