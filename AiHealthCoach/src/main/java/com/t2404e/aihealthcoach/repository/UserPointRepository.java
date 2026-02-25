package com.t2404e.aihealthcoach.repository;

import com.t2404e.aihealthcoach.entity.UserPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPointRepository extends JpaRepository<UserPoint, Long> {
    Optional<UserPoint> findByUserId(Long userId);
}
