package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.response.AdminDashboardResponse;

public interface AdminDashboardService {
    AdminDashboardResponse getStats();
    
    java.util.Map<String, Object> getRevenueStats(String period);
}
