package com.t2404e.aihealthcoach.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_streaks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStreak {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "current_streak", nullable = false)
    @Builder.Default
    private Integer currentStreak = 0;

    @Column(name = "longest_streak", nullable = false)
    @Builder.Default
    private Integer longestStreak = 0;

    @com.fasterxml.jackson.annotation.JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "last_completed_date")
    private LocalDate lastCompletedDate;

    @Column(name = "freeze_count", nullable = false)
    @Builder.Default
    private Integer freezeCount = 0;

    @Column(name = "can_recover", nullable = false)
    @Builder.Default
    private Boolean canRecover = false;

    @Column(name = "recovery_deadline")
    private LocalDateTime recoveryDeadline;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
