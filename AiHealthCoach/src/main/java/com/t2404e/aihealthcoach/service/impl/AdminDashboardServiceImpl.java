package com.t2404e.aihealthcoach.service.impl;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.t2404e.aihealthcoach.dto.response.AdminDashboardResponse;
import com.t2404e.aihealthcoach.repository.DishLibraryRepository;
import com.t2404e.aihealthcoach.repository.UserMealLogRepository;
import com.t2404e.aihealthcoach.repository.UserRepository;
import com.t2404e.aihealthcoach.service.AdminDashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final UserRepository userRepository;
    private final DishLibraryRepository dishLibraryRepository;
    private final UserMealLogRepository userMealLogRepository;
    private final com.t2404e.aihealthcoach.repository.TransactionRepository transactionRepository;

    @Override
    public Map<String, Object> getRevenueStats(String period, String startDate, String endDate) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start;
        LocalDateTime end = now;
        String format = "dd/MM";
        boolean isMonthly = false;

        if ("custom".equalsIgnoreCase(period) && startDate != null && endDate != null) {
            start = java.time.LocalDate.parse(startDate).atStartOfDay();
            end = java.time.LocalDate.parse(endDate).atTime(LocalTime.MAX);
            
            long daysDiff = java.time.Duration.between(start, end).toDays();
            if (daysDiff > 60) {
                format = "MM/yyyy";
                isMonthly = true;
            }
        } else {
            switch (period.toLowerCase()) {
                case "week":
                    start = now.minusDays(6).with(LocalTime.MIN);
                    break;
                case "month":
                    start = now.minusDays(29).with(LocalTime.MIN);
                    break;
                case "year":
                    start = now.minusMonths(11).withDayOfMonth(1).with(LocalTime.MIN);
                    format = "MM/yyyy";
                    isMonthly = true;
                    break;
                default: 
                    start = now.minusHours(23).withMinute(0).withSecond(0).withNano(0);
                    format = "HH:00";
                    break;
            }
        }

        List<Map<String, Object>> chartData = new ArrayList<>();
        long totalRevenue = 0;

        // LocalDateTime current = start; // Unused 
        // Existing logic iterates backwards. Let's adapt.
        
        if (isMonthly) {
             // For monthly iteration, we can't easily do a simple loop if start/end are arbitrary dates.
             // Better to just loop from start to end by month.
             LocalDateTime iter = start.withDayOfMonth(1).with(LocalTime.MIN);
             while (!iter.isAfter(end)) {
                 LocalDateTime monthStart = iter;
                 LocalDateTime monthEnd = iter.withDayOfMonth(iter.toLocalDate().lengthOfMonth()).with(LocalTime.MAX);
                 if (monthEnd.isAfter(end)) monthEnd = end; // Clamp to end date

                 Long revenue = transactionRepository.sumAmountByStatusAndCreatedAtBetween(
                         com.t2404e.aihealthcoach.enums.TransactionStatus.SUCCESS, monthStart, monthEnd);
                 if (revenue == null) revenue = 0L;
                 totalRevenue += revenue;

                 Map<String, Object> point = new HashMap<>();
                 point.put("name", iter.format(DateTimeFormatter.ofPattern(format)));
                 point.put("value", revenue);
                 chartData.add(point);
                 
                 iter = iter.plusMonths(1);
             }
        } else {
            // Daily iteration
            LocalDateTime iter = start.with(LocalTime.MIN);
            while (!iter.isAfter(end)) {
                LocalDateTime dayStart = iter;
                LocalDateTime dayEnd = iter.with(LocalTime.MAX);
                if (dayEnd.isAfter(end)) dayEnd = end;

                Long revenue = transactionRepository.sumAmountByStatusAndCreatedAtBetween(
                        com.t2404e.aihealthcoach.enums.TransactionStatus.SUCCESS, dayStart, dayEnd);
                if (revenue == null) revenue = 0L;
                totalRevenue += revenue;

                Map<String, Object> point = new HashMap<>();
                point.put("name", iter.format(DateTimeFormatter.ofPattern(format)));
                point.put("value", revenue);
                chartData.add(point);
                
                iter = iter.plusDays(1);
            }
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalRevenue", totalRevenue);
        // chartData might need sorting if iterated differently? Forward iteration ensures sorted order already.
        response.put("chartData", chartData);
        return response;
    }

    @Override
    public AdminDashboardResponse getStats(String period, String startDate, String endDate) {
        long totalUsers = userRepository.count();
        long totalFoods = dishLibraryRepository.count();

        LocalDateTime startOfToday = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        long activeToday = userMealLogRepository.countDistinctUserIdsByLoggedAtAfter(startOfToday);

        // System Overview Distribution Stats
        Map<String, Map<String, Long>> systemOverview = new HashMap<>();

        // 1. User Status: Active vs Locked
        Map<String, Long> userStatus = new HashMap<>();
        userStatus.put("active", userRepository.countByStatus(1));
        userStatus.put("locked", userRepository.countByStatus(0));
        systemOverview.put("users", userStatus);

        // 2. Food Status: Verified vs Unverified
        Map<String, Long> foodStatus = new HashMap<>();
        foodStatus.put("verified", dishLibraryRepository.countByIsVerifiedTrueAndIsDeletedFalse());
        foodStatus.put("unverified", dishLibraryRepository.countByIsVerifiedFalseAndIsDeletedFalse());
        systemOverview.put("foods", foodStatus);

        // 3. Account Type: Premium vs Free
        Map<String, Long> accountStatus = new HashMap<>();
        long premiumCount = userRepository.countByIsPremiumTrue();
        accountStatus.put("premium", premiumCount);
        accountStatus.put("free", totalUsers - premiumCount);
        systemOverview.put("accounts", accountStatus);

        // User type stats (Premium vs Free) - Legacy field
        Map<String, Long> userTypeStats = new HashMap<>();
        userTypeStats.put("Premium", premiumCount);
        userTypeStats.put("Free", totalUsers - premiumCount);

        // Registration & Food stats (Dynamic Period)
        List<Map<String, Object>> registrationStats = new ArrayList<>();
        List<Map<String, Object>> premiumRegistrationStats = new ArrayList<>();
        List<Map<String, Object>> foodGrowthStats = new ArrayList<>();

        LocalDateTime rangeStart;
        LocalDateTime rangeEnd = LocalDateTime.now();
        boolean isMonthly = false;

        if ("custom".equalsIgnoreCase(period) && startDate != null && endDate != null) {
            rangeStart = java.time.LocalDate.parse(startDate).atStartOfDay();
            rangeEnd = java.time.LocalDate.parse(endDate).atTime(LocalTime.MAX);
            
            long daysDiff = java.time.Duration.between(rangeStart, rangeEnd).toDays();
            if (daysDiff > 60) {
                isMonthly = true;
            }
        } else {
             if ("year".equalsIgnoreCase(period)) {
                rangeStart =  LocalDateTime.now().minusMonths(11).withDayOfMonth(1).with(LocalTime.MIN);
                isMonthly = true;
            } else {
                int days = "month".equalsIgnoreCase(period) ? 30 : 7;
                rangeStart =  LocalDateTime.now().minusDays(days - 1).with(LocalTime.MIN);
            }
        }
        
        if (isMonthly) {
             LocalDateTime iter = rangeStart.withDayOfMonth(1).with(LocalTime.MIN);
             while (!iter.isAfter(rangeEnd)) {
                 LocalDateTime monthStart = iter;
                 LocalDateTime monthEnd = iter.withDayOfMonth(iter.toLocalDate().lengthOfMonth()).with(LocalTime.MAX);
                 if (monthEnd.isAfter(rangeEnd)) monthEnd = rangeEnd;

                 String label = iter.format(DateTimeFormatter.ofPattern("MM/yyyy"));
                 
                 addGrowthStat(registrationStats, "users", userRepository.countByCreatedAtBetween(monthStart, monthEnd), label);
                 addGrowthStat(premiumRegistrationStats, "premium", userRepository.countByIsPremiumTrueAndCreatedAtBetween(monthStart, monthEnd), label);
                 addGrowthStat(foodGrowthStats, "foods", dishLibraryRepository.countByCreatedAtBetween(monthStart, monthEnd), label);

                 iter = iter.plusMonths(1);
             }
        } else {
             LocalDateTime iter = rangeStart.with(LocalTime.MIN);
             while (!iter.isAfter(rangeEnd)) {
                 LocalDateTime dayStart = iter;
                 LocalDateTime dayEnd = iter.with(LocalTime.MAX);
                 
                 String label = "month".equalsIgnoreCase(period) || "custom".equalsIgnoreCase(period)
                        ? iter.format(DateTimeFormatter.ofPattern("dd/MM"))
                        : getVietnameseDayOfWeek(iter);

                 addGrowthStat(registrationStats, "users", userRepository.countByCreatedAtBetween(dayStart, dayEnd), label);
                 addGrowthStat(premiumRegistrationStats, "premium", userRepository.countByIsPremiumTrueAndCreatedAtBetween(dayStart, dayEnd), label);
                 addGrowthStat(foodGrowthStats, "foods", dishLibraryRepository.countByCreatedAtBetween(dayStart, dayEnd), label);

                 iter = iter.plusDays(1);
             }
        }

        // Recent activities (Combined and Sorted)
        List<AdminDashboardResponse.ActivityDto> recentActivities = new ArrayList<>();

        // Temporary list to hold items for sorting
        class TempActivity {
            AdminDashboardResponse.ActivityDto dto;
            LocalDateTime time;

            TempActivity(AdminDashboardResponse.ActivityDto dto, LocalDateTime time) {
                this.dto = dto;
                this.time = time;
            }
        }
        List<TempActivity> combined = new ArrayList<>();

        // Latest Users
        userRepository.findAll(PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent().forEach(u -> combined.add(new TempActivity(
                        AdminDashboardResponse.ActivityDto.builder()
                                .id("u_" + u.getId())
                                .type("user_register")
                                .description("Thành viên mới: " + u.getFullName())
                                .user(u.getEmail())
                                .timestamp(formatRelativeTime(u.getCreatedAt()))
                                .build(),
                        u.getCreatedAt())));

        // Latest Dishes
        dishLibraryRepository.findAll(PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent().forEach(d -> combined.add(new TempActivity(
                        AdminDashboardResponse.ActivityDto.builder()
                                .id("d_" + d.getId())
                                .type("food_added")
                                .description("Món mới: " + d.getName())
                                .user("Admin")
                                .timestamp(formatRelativeTime(d.getCreatedAt()))
                                .build(),
                        d.getCreatedAt())));

        // Sort combined and take top 10
        combined.sort((a, b) -> b.time.compareTo(a.time));
        combined.stream().limit(10).forEach(t -> recentActivities.add(t.dto));

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .activeToday(activeToday)
                .totalFoods(totalFoods)
                .totalReports(0)
                .userTypeStats(userTypeStats)
                .systemOverview(systemOverview)
                .registrationStats(registrationStats)
                .premiumRegistrationStats(premiumRegistrationStats)
                .foodGrowthStats(foodGrowthStats)
                .recentActivities(recentActivities)
                .build();
    }

    private void addGrowthStat(List<Map<String, Object>> list, String key, long value, String label) {
        Map<String, Object> stat = new HashMap<>();
        stat.put("day", label);
        stat.put(key, value);
        list.add(stat);
    }

    private String getVietnameseDayOfWeek(LocalDateTime date) {
        String[] dayNames = { "CN", "T2", "T3", "T4", "T5", "T6", "T7" };
        return dayNames[date.getDayOfWeek().getValue() % 7];
    }

    private String formatRelativeTime(LocalDateTime dateTime) {
        if (dateTime == null)
            return "N/A";
        return dateTime.format(DateTimeFormatter.ofPattern("HH:mm dd/MM"));
    }
}
