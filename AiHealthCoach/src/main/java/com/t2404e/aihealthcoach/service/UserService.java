package com.t2404e.aihealthcoach.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.t2404e.aihealthcoach.dto.response.UserResponse;
import com.t2404e.aihealthcoach.entity.User;

public interface UserService {
    /**
     * Lấy danh sách user có phân trang, tìm kiếm và lọc
     */
    Page<UserResponse> getUsers(String keyword, Integer status, Boolean isPremium, String startDate, String endDate, Pageable pageable);

    /**
     * Lấy chi tiết user (Admin view)
     */
    UserResponse getUserById(Long id);

    /**
     * Helper: Tìm entity User gốc (dùng nội bộ)
     */
    User findUserEntityById(Long id);

    /**
     * Chuyển đổi trạng thái user (Active <-> Inactive)
     */
    void toggleUserStatus(Long id);

    /**
     * Chuyển đổi trạng thái Premium (true <-> false)
     */
    void togglePremiumStatus(Long id);


}
