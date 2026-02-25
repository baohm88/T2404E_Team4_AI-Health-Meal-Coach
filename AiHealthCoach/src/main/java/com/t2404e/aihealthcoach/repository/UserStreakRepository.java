package com.t2404e.aihealthcoach.repository;

import com.t2404e.aihealthcoach.entity.UserStreak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserStreakRepository extends JpaRepository<UserStreak, Long> {
    Optional<UserStreak> findByUserId(Long userId);
}
