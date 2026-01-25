package com.t2404e.aihealthcoach.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.request.HealthProfileRequest;
import com.t2404e.aihealthcoach.dto.response.HealthProfileResponse;
import com.t2404e.aihealthcoach.service.HealthProfileService;
import com.t2404e.aihealthcoach.util.RequestUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/health-profile")
@Tag(name = "Health Profile", description = "Quản lý hồ sơ sức khỏe (chiều cao, cân nặng, mục tiêu)")
public class HealthProfileController {

    private final HealthProfileService service;

    public HealthProfileController(HealthProfileService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @Operation(summary = "Tạo hồ sơ sức khỏe", description = "Tạo mới thông tin sức khỏe cho người dùng.")
    public ResponseEntity<ApiResponse<?>> create(
            @Valid @RequestBody HealthProfileRequest request,
            HttpServletRequest httpRequest) {

        Long userId = RequestUtil.getUserId(httpRequest);
        service.saveOrUpdate(userId, request);

        return ResponseEntity.ok(ApiResponse.success("Health profile saved successfully", null));
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @Operation(summary = "Cập nhật hồ sơ sức khỏe", description = "Cập nhật thông tin sức khỏe hiện tại.")
    public ResponseEntity<ApiResponse<?>> update(
            @Valid @RequestBody HealthProfileRequest request,
            HttpServletRequest httpRequest) {

        Long userId = RequestUtil.getUserId(httpRequest);
        service.saveOrUpdate(userId, request);

        return ResponseEntity.ok(ApiResponse.success("Health profile updated successfully", null));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @Operation(summary = "Lấy hồ sơ sức khỏe", description = "Xem thông tin sức khỏe hiện tại của người dùng.")
    public ResponseEntity<ApiResponse<HealthProfileResponse>> getProfile(
            HttpServletRequest request) {

        Long userId = RequestUtil.getUserId(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Health profile fetched successfully",
                        service.getByUserId(userId)
                )
        );
    }

}
