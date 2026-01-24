package com.t2404e.aihealthcoach.repository;

import com.t2404e.aihealthcoach.entity.UserMealLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMealLogRepository extends JpaRepository<UserMealLog, Long> {
    List<UserMealLog> findByUserIdOrderByLoggedAtDesc(Long userId);
}
