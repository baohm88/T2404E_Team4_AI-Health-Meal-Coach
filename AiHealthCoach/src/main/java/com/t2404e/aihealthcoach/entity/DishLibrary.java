package com.t2404e.aihealthcoach.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.t2404e.aihealthcoach.enums.MealTimeSlot;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Builder.Default
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @Builder.Default
    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
