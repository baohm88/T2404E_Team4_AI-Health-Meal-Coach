package com.t2404e.aihealthcoach.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;


import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "meal_plans")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class MealPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "total_days", nullable = false)
    private Integer totalDays; // 90

    @Lob
    @Column(name = "plan_json", columnDefinition = "LONGTEXT", nullable = false)
    private String planJson;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
