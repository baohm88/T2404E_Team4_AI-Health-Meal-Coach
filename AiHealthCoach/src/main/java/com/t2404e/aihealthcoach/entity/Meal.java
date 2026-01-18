package com.t2404e.aihealthcoach.entity;

import com.t2404e.aihealthcoach.enums.MealTimeSlot;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "meals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Gắn với DailyPlan
    @Column(name = "daily_plan_id", nullable = false)
    private Long dailyPlanId;

    @Enumerated(EnumType.STRING)
    @Column(name = "time_slot", nullable = false, length = 20)
    private MealTimeSlot timeSlot;

    /**
     * Calories gợi ý cho bữa này
     */
    @Column(name = "recommended_calories", nullable = false)
    private Integer recommendedCalories;

    /**
     * Ghi chú / gợi ý
     * Ví dụ: "Ưu tiên protein, hạn chế tinh bột"
     */
    @Column(columnDefinition = "TEXT")
    private String note;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
