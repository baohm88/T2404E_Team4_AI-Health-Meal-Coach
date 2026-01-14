package com.t2404e.aihealthcoach.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "monthly_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Gắn với user
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // Tháng thứ mấy trong lộ trình (1, 2, 3)
    @Column(name = "month_index", nullable = false)
    private Integer monthIndex;

    /**
     * Số kg cần tăng / giảm trong tháng
     * Ví dụ: -2.5 = giảm 2.5kg
     */
    @Column(name = "target_weight_change", nullable = false)
    private Double targetWeightChange;

    /**
     * Số kcal khuyến nghị mỗi ngày trong tháng
     */
    @Column(name = "daily_calories", nullable = false)
    private Integer dailyCalories;

    /**
     * Ghi chú AI / hệ thống
     */
    @Column(columnDefinition = "TEXT")
    private String note;

    /**
     * Thời điểm tạo plan (lần generate)
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
