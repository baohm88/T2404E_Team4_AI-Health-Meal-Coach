package com.t2404e.aihealthcoach.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_points")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "total_points", nullable = false)
    @Builder.Default
    private Integer totalPoints = 0;

    @Column(name = "current_month_points", nullable = false)
    @Builder.Default
    private Integer currentMonthPoints = 0;

    @Column(name = "last_earned_at")
    private LocalDateTime lastEarnedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
