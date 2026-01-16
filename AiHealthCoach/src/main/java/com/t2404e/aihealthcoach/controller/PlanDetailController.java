package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.exception.PremiumRequiredException;
import com.t2404e.aihealthcoach.service.UserService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/plans")
public class PlanDetailController {

    private final UserService userService;

    public PlanDetailController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/monthly/detail")
    public ResponseEntity<ApiResponse<?>> getMonthlyDetail(HttpServletRequest request) {

        Long userId = RequestUtil.getUserId(request);

        if (!userService.isPremium(userId)) {
            throw new PremiumRequiredException(
                    "Upgrade to premium to view detailed plans"
            );
        }

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Detailed plan loaded",
                        "DETAIL_DATA_PLACEHOLDER"
                )
        );
    }
}
