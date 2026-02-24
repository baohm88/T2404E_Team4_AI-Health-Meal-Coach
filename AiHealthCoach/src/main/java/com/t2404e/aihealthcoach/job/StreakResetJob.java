package com.t2404e.aihealthcoach.job;

import com.t2404e.aihealthcoach.entity.UserStreak;
import com.t2404e.aihealthcoach.repository.UserStreakRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class StreakResetJob {

    private final UserStreakRepository userStreakRepository;

    // Run every day at 00:30 UTC+7 (assuming server time is configured or just use
    // cron)
    // "0 30 0 * * ?"
    @Scheduled(cron = "0 30 0 * * ?")
    public void resetStreaks() {
        log.info("Starting daily streak reset job...");

        LocalDate yesterday = LocalDate.now().minusDays(1);
        List<UserStreak> streaks = userStreakRepository.findAll();

        for (UserStreak streak : streaks) {
            try {
                LocalDate lastDate = streak.getLastCompletedDate();

                // If user didn't complete yesterday (and didn't complete today yet obviously)
                // And wasn't just created today/yesterday without activity?
                // Logic: if lastDate < yesterday, streak is broken.

                if (lastDate != null && lastDate.isBefore(yesterday)) {
                    if (streak.getCurrentStreak() > 0) {
                        // Handle Freeze
                        if (streak.getFreezeCount() > 0) {
                            streak.setFreezeCount(streak.getFreezeCount() - 1);
                            // Set last completed to yesterday to "fake" it?
                            // Or just don't reset. Better not to change lastCompletedDate so we know they
                            // missed.
                            // But next day check would fail again.
                            // So effectively we "skip" the check for one day.
                            // Simple way: "Extend" lastCompletedDate to yesterday so it looks like they did
                            // it.
                            streak.setLastCompletedDate(yesterday);
                            log.info("Used freeze for user {}", streak.getUserId());
                        } else {
                            // Reset
                            streak.setCurrentStreak(0);
                            streak.setCanRecover(true);
                            streak.setRecoveryDeadline(LocalDateTime.now().plusHours(24));
                            log.info("Reset streak for user {}", streak.getUserId());
                        }
                        userStreakRepository.save(streak);
                    }
                }
            } catch (Exception e) {
                log.error("Error processing streak for user {}: {}", streak.getUserId(), e.getMessage());
            }
        }

        log.info("Streak reset job completed.");
    }
}
