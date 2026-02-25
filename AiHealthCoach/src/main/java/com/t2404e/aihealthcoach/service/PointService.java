package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.entity.PointHistory;
import com.t2404e.aihealthcoach.entity.UserPoint;
import com.t2404e.aihealthcoach.enums.PointActionType;
import com.t2404e.aihealthcoach.repository.PointHistoryRepository;
import com.t2404e.aihealthcoach.repository.UserPointRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PointService {

    @Autowired
    private UserPointRepository userPointRepository;

    @Autowired
    private PointHistoryRepository pointHistoryRepository;

    @Transactional
    public void awardPoints(Long userId, PointActionType actionType, String description, Long relatedEntityId) {
        int points = getPointsForAction(actionType);

        UserPoint userPoint = userPointRepository.findByUserId(userId)
                .orElse(UserPoint.builder().userId(userId).build());

        userPoint.setTotalPoints(userPoint.getTotalPoints() + points);
        userPoint.setCurrentMonthPoints(userPoint.getCurrentMonthPoints() + points);
        userPoint.setLastEarnedAt(LocalDateTime.now());

        userPointRepository.save(userPoint);

        PointHistory history = PointHistory.builder()
                .userId(userId)
                .actionType(actionType)
                .pointsEarned(points)
                .description(description)
                .relatedEntityId(relatedEntityId)
                .build();

        pointHistoryRepository.save(history);
    }

    @Transactional
    public void deductPoints(Long userId, int amount, String description) {
        UserPoint userPoint = userPointRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User points not found"));

        if (userPoint.getTotalPoints() < amount) {
            throw new RuntimeException("Not enough points");
        }

        userPoint.setTotalPoints(userPoint.getTotalPoints() - amount);
        userPointRepository.save(userPoint);

        PointHistory history = PointHistory.builder()
                .userId(userId)
                .actionType(PointActionType.STREAK_FREEZE_PURCHASE) // Assuming this is mostly used for
                                                                    // purchases/penalties
                .pointsEarned(-amount)
                .description(description)
                .build();

        pointHistoryRepository.save(history);
    }

    public UserPoint getUserPoints(Long userId) {
        return userPointRepository.findByUserId(userId)
                .orElse(UserPoint.builder().userId(userId).build());
    }

    public Page<PointHistory> getPointHistory(Long userId, Pageable pageable) {
        return pointHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    private int getPointsForAction(PointActionType actionType) {
        return switch (actionType) {
            case MEAL_LOG_COMPLIANT -> 10;
            case DAILY_COMPLETE -> 30;
            case STREAK_MILESTONE_7 -> 100;
            case STREAK_MILESTONE_30 -> 500;
            case STREAK_MILESTONE_90 -> 1500;
            default -> 0;
        };
    }
}
