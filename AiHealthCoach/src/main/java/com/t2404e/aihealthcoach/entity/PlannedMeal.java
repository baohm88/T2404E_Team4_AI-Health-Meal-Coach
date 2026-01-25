package com.t2404e.aihealthcoach.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "planned_meals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlannedMeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meal_plan_id", nullable = false)
    private Long mealPlanId;

    @Column(name = "day_number", nullable = false)
    private Integer dayNumber; // 1-90

    @Column(name = "category", nullable = false)
    private String category; // Sáng, Trưa, Tối, Phụ

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dish_id")
    private DishLibrary dish;

    @Column(name = "meal_name")
    private String mealName;

    @Column(name = "quantity")
    private String quantity;

    @Column(name = "calories")
    private Integer calories;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
