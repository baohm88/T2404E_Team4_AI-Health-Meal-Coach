package com.t2404e.aihealthcoach.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import com.t2404e.aihealthcoach.enums.MealTimeSlot;

import java.time.LocalDateTime;

@Entity
@Table(name = "dish_library")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishLibrary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "base_calories")
    private Integer baseCalories;

    private String unit; // e.g., "bát", "100g", "đĩa"

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private MealTimeSlot category; // Sáng, Trưa, Tối, Phụ

    @Builder.Default
    @Column(name = "is_ai_suggested")
    private Boolean isAiSuggested = false;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
