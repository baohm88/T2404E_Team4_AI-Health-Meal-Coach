package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.response.DashboardResponse;

public interface DashboardService {
    DashboardResponse getDashboard(Long userId);
}
