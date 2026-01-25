package com.t2404e.aihealthcoach.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.response.UserResponse;
import com.t2404e.aihealthcoach.service.MealPlanService;
import com.t2404e.aihealthcoach.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Tag(name = "Admin - User Management", description = "Quản lý người dùng")
public class AdminController {

    private final UserService userService;
    private final MealPlanService mealPlanService;

    @GetMapping("/ping")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Kiểm tra quyền Admin", description = "API chỉ dành cho Admin để kiểm tra kết nối và quyền truy cập.")
    public ResponseEntity<ApiResponse<?>> ping() {
        return ResponseEntity.ok(ApiResponse.success("Admin access granted", null));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy danh sách User", description = "Phân trang, tìm kiếm theo tên hoặc email. Sắp xếp mặc định theo ID giảm dần.")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        // Xử lý sort format "field,asc"
        String[] sortParams = sort.split(",");
        Sort sortObj = Sort.by(Sort.Direction.fromString(sortParams[1]), sortParams[0]);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<UserResponse> users = userService.getUsers(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách user thành công", users));
    }

    @GetMapping("/users/{userId}/plan")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xem kế hoạch ăn uống của User", description = "Admin xem chi tiết thực đơn của một user cụ thể.")
    public ResponseEntity<ApiResponse<?>> getUserPlan(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy kế hoạch user thành công", mealPlanService.getByUserId(userId)));
    }

    @PatchMapping("/users/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Kích hoạt/Vô hiệu hóa người dùng", description = "Chuyển đổi trạng thái hoạt động của người dùng (Active/Inactive).")
    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(@PathVariable Long id) {
        userService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Thay đổi trạng thái người dùng thành công", null));
    }

}
