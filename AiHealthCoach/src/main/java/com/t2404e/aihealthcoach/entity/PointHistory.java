package com.t2404e.aihealthcoach.entity;

import com.t2404e.aihealthcoach.enums.PointActionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "point_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private PointActionType actionType;

    @Column(name = "points_earned", nullable = false)
    private Integer pointsEarned;

    @Column(name = "description")
    private String description;

    @Column(name = "related_entity_id")
    private Long relatedEntityId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
