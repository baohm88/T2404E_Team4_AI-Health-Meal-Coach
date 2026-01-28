package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.response.AdminDashboardResponse;
import com.t2404e.aihealthcoach.repository.DishLibraryRepository;
import com.t2404e.aihealthcoach.repository.UserMealLogRepository;
import com.t2404e.aihealthcoach.repository.UserRepository;
import com.t2404e.aihealthcoach.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final UserRepository userRepository;
    private final DishLibraryRepository dishLibraryRepository;
    private final UserMealLogRepository userMealLogRepository;

    @Override
    public AdminDashboardResponse getStats() {
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

        // Registration & Food stats (Last 7 days)
        List<Map<String, Object>> registrationStats = new ArrayList<>();
        List<Map<String, Object>> premiumRegistrationStats = new ArrayList<>();
        List<Map<String, Object>> foodGrowthStats = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            LocalDateTime date = LocalDateTime.now().minusDays(i);
            String[] dayNames = { "CN", "T2", "T3", "T4", "T5", "T6", "T7" };
            String dayName = dayNames[date.getDayOfWeek().getValue() % 7];

            LocalDateTime start = date.with(LocalTime.MIN);
            LocalDateTime end = date.with(LocalTime.MAX);

            long regCount = userRepository.countByCreatedAtBetween(start, end);
            long premiumRegCount = userRepository.countByIsPremiumTrueAndCreatedAtBetween(start, end);
            long foodCount = dishLibraryRepository.countByCreatedAtBetween(start, end);

            Map<String, Object> regStat = new HashMap<>();
            regStat.put("day", dayName);
            regStat.put("users", regCount);
            registrationStats.add(regStat);

            Map<String, Object> premiumStat = new HashMap<>();
            premiumStat.put("day", dayName);
            premiumStat.put("premium", premiumRegCount);
            premiumRegistrationStats.add(premiumStat);

            Map<String, Object> foodStat = new HashMap<>();
            foodStat.put("day", dayName);
            foodStat.put("foods", foodCount);
            foodGrowthStats.add(foodStat);
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

    private String formatRelativeTime(LocalDateTime dateTime) {
        if (dateTime == null)
            return "N/A";
        return dateTime.format(DateTimeFormatter.ofPattern("HH:mm dd/MM"));
    }
}
