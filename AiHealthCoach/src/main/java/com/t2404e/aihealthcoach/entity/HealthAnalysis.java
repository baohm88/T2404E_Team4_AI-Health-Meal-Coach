package com.t2404e.aihealthcoach.entity;

import com.t2404e.aihealthcoach.enums.HealthStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "health_analysis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Gắn với user
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    private Double bmi;

    private Double bmr;

    private Double tdee;

    @Column(name = "energy_score")
    private Integer energyScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "health_status", length = 20)
    private HealthStatus healthStatus;

    @Column(columnDefinition = "TEXT")
    private String bodyState;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
