package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.response.AdminDashboardResponse;

public interface AdminDashboardService {
    AdminDashboardResponse getStats(String period, String startDate, String endDate);
    
    java.util.Map<String, Object> getRevenueStats(String period, String startDate, String endDate);
}
