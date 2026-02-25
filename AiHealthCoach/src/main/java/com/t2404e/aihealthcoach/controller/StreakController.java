package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.entity.UserStreak;
import com.t2404e.aihealthcoach.service.StreakService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/streak")
@Tag(name = "Gamification - Streaks", description = "API quản lý streak (chuỗi ngày liên tiếp)")
public class StreakController {

    @Autowired
    private StreakService streakService;

    @GetMapping("/current")
    @Operation(summary = "Lấy thông tin streak hiện tại")
    public ResponseEntity<ApiResponse<UserStreak>> getCurrentStreak(HttpServletRequest request) {
        Long userId = RequestUtil.getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("User not authenticated"));
        }
        return ResponseEntity
                .ok(ApiResponse.success("Fetched streak successfully", streakService.getUserStreak(userId)));
    }

    @PostMapping("/freeze/purchase")
    @Operation(summary = "Mua Streak Freeze bằng điểm")
    public ResponseEntity<ApiResponse<Void>> purchaseFreeze(HttpServletRequest request) {
        Long userId = RequestUtil.getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("User not authenticated"));
        }
        try {
            streakService.purchaseFreeze(userId);
            return ResponseEntity.ok(ApiResponse.success("Purchased freeze successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/recover")
    @Operation(summary = "Phục hồi streak đã mất trong vòng 24h")
    public ResponseEntity<ApiResponse<Void>> recoverStreak(HttpServletRequest request) {
        Long userId = RequestUtil.getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("User not authenticated"));
        }
        try {
            streakService.recoverStreak(userId);
            return ResponseEntity.ok(ApiResponse.success("Recovered streak successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
