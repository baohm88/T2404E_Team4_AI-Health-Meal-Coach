package com.t2404e.aihealthcoach.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.t2404e.aihealthcoach.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);

    /**
     * Tìm kiếm user theo tên hoặc email (phân trang)
     */
    Page<User> findByFullNameContainingOrEmailContaining(String fullName, String email, Pageable pageable);
}
