package com.t2404e.aihealthcoach.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
public class AdminDashboardResponse {
    private long totalUsers;
    private long activeToday;
    private long totalFoods;
    private long totalReports;
    private Map<String, Long> userTypeStats; // Premium vs Free
    private Map<String, Map<String, Long>> systemOverview; // Distribution stats
    private List<Map<String, Object>> registrationStats;
    private List<Map<String, Object>> premiumRegistrationStats;
    private List<Map<String, Object>> foodGrowthStats;
    private List<ActivityDto> recentActivities;

    @Getter
    @Setter
    @Builder
    public static class ActivityDto {
        private String id;
        private String type;
        private String description;
        private String user;
        private String timestamp;
    }
}
