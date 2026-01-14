package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.response.DashboardResponse;
import com.t2404e.aihealthcoach.service.DashboardService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<?>> summary(HttpServletRequest req) {
        Long userId = RequestUtil.getUserId(req);
        return ResponseEntity.ok(ApiResponse.success("Dashboard loaded", service.getDashboard(userId)));
    }

}
