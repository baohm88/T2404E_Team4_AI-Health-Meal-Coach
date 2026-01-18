package com.t2404e.aihealthcoach.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "weekly_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Gắn với MonthlyPlan
    @Column(name = "monthly_plan_id", nullable = false)
    private Long monthlyPlanId;

    // Tuần thứ mấy trong tháng (1–4)
    @Column(name = "week_index", nullable = false)
    private Integer weekIndex;

    /**
     * Mục tiêu thay đổi cân nặng trong tuần (kg)
     * Ví dụ: -0.6 kg
     */
    @Column(name = "target_weight_change", nullable = false)
    private Double targetWeightChange;

    /**
     * Calories trung bình mỗi ngày trong tuần
     */
    @Column(name = "daily_calories", nullable = false)
    private Integer dailyCalories;

    /**
     * Ghi chú hướng dẫn
     */
    @Column(columnDefinition = "TEXT")
    private String note;

    private Integer adherenceScore; // 0–100
    @Column(columnDefinition = "TEXT")
    private String adjustmentNote;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
