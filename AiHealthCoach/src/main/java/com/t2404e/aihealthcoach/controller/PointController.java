package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.entity.PointHistory;
import com.t2404e.aihealthcoach.entity.UserPoint;
import com.t2404e.aihealthcoach.service.PointService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/points")
@Tag(name = "Gamification - Points", description = "API quản lý điểm thưởng")
public class PointController {

    @Autowired
    private PointService pointService;

    @GetMapping("/current")
    @Operation(summary = "Lấy thông tin điểm hiện tại của user")
    public ResponseEntity<ApiResponse<UserPoint>> getCurrentPoints(HttpServletRequest request) {
        Long userId = RequestUtil.getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("User not authenticated"));
        }
        return ResponseEntity
                .ok(ApiResponse.success("Fetched points successfully", pointService.getUserPoints(userId)));
    }

    @GetMapping("/history")
    @Operation(summary = "Xem lịch sử tích điểm")
    public ResponseEntity<ApiResponse<Page<PointHistory>>> getPointHistory(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Long userId = RequestUtil.getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("User not authenticated"));
        }

        return ResponseEntity.ok(ApiResponse.success("Fetched history successfully",
                pointService.getPointHistory(userId, PageRequest.of(page, size))));
    }
}
