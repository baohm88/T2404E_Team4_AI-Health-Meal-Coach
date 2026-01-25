package com.t2404e.aihealthcoach.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_meal_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMealLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "food_name")
    private String foodName;

    @Column(name = "estimated_calories")
    private Integer estimatedCalories;

    @Column(name = "planned_meal_id")
    private Long plannedMealId;

    @Column(name = "dish_id")
    private Long dishId;

    @Builder.Default
    @Column(name = "is_plan_compliant")
    private Boolean isPlanCompliant = true;

    @Builder.Default
    @Column(name = "checked_in")
    private Boolean checkedIn = false;

    @Column(name = "day_number")
    private Integer dayNumber;

    @Column(name = "category")
    private String category;

    @Column(columnDefinition = "TEXT")
    private String nutritionDetails;

    @CreationTimestamp
    @Column(name = "logged_at")
    private LocalDateTime loggedAt;
}
