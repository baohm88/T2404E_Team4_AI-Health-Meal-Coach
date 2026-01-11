package com.t2404e.aihealthcoach.entity;

import com.t2404e.aihealthcoach.enums.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "health_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthProfile {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Gender gender;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private Double height; // cm

    @Column(nullable = false)
    private Double weight; // kg

    @Enumerated(EnumType.STRING)
    @Column(name = "goal", nullable = false, length = 30)
    private GoalType goal;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_level", nullable = false, length = 30)
    private ActivityLevel activityLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "stress_level", nullable = false, length = 30)
    private StressLevel stressLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "sleep_duration", nullable = false, length = 30)
    private SleepDuration sleepDuration;

    @UpdateTimestamp
    @Column(name = "last_modified_at")
    private LocalDateTime lastModifiedAt;
}
