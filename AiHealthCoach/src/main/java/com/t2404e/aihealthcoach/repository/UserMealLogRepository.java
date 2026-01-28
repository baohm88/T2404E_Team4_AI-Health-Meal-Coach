package com.t2404e.aihealthcoach.repository;

import com.t2404e.aihealthcoach.entity.UserMealLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMealLogRepository extends JpaRepository<UserMealLog, Long> {
    List<UserMealLog> findByUserIdOrderByLoggedAtAsc(Long userId);

    List<UserMealLog> findByUserIdOrderByLoggedAtDesc(Long userId);

    java.util.Optional<UserMealLog> findFirstByPlannedMealIdOrderByLoggedAtDesc(Long plannedMealId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT l.userId) FROM UserMealLog l WHERE l.loggedAt >= :startOfDay")
    long countDistinctUserIdsByLoggedAtAfter(java.time.LocalDateTime startOfDay);
}
