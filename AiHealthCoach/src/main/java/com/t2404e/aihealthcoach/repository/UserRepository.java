package com.t2404e.aihealthcoach.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.t2404e.aihealthcoach.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);
    boolean existsByEmail(String email);
    long countByIsPremiumTrue();
    long countByStatus(Integer status);

    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE " +
            "(:keyword IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:status IS NULL OR u.status = :status) AND " +
            "(:isPremium IS NULL OR u.isPremium = :isPremium) AND " +
            "(cast(:startDate as date) IS NULL OR u.createdAt >= :startDate) AND " +
            "(cast(:endDate as date) IS NULL OR u.createdAt <= :endDate)")
    org.springframework.data.domain.Page<User> searchUsers(
            String keyword,
            Integer status,
            Boolean isPremium,
            java.time.LocalDateTime startDate,
            java.time.LocalDateTime endDate,
            org.springframework.data.domain.Pageable pageable
    );

    /**
     * Tìm kiếm user theo tên hoặc email (phân trang)
     */
    Page<User> findByFullNameContainingOrEmailContaining(String fullName, String email, Pageable pageable);
}
