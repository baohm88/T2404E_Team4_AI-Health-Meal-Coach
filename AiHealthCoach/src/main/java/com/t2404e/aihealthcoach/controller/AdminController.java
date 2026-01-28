package com.t2404e.aihealthcoach.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper; // Add import
import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.response.AdminDashboardResponse;
import com.t2404e.aihealthcoach.dto.response.UserResponse;
import com.t2404e.aihealthcoach.service.AdminDashboardService;
import com.t2404e.aihealthcoach.service.DishService;
import com.t2404e.aihealthcoach.service.HealthAnalysisService;
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
    private final HealthAnalysisService healthAnalysisService;
    private final MealPlanService mealPlanService;
    private final AdminDashboardService adminDashboardService;
    private final DishService dishService;
    private final ObjectMapper objectMapper;

    @GetMapping("/ping")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Kiểm tra quyền Admin", description = "API chỉ dành cho Admin để kiểm tra kết nối và quyền truy cập.")
    public ResponseEntity<ApiResponse<?>> ping() {
        return ResponseEntity.ok(ApiResponse.success("Admin access granted", null));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy thống kê Dashboard", description = "Lấy các chỉ số tổng quan, biểu đồ tăng trưởng và hoạt động gần đây.")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success("Lấy thống kê thành công", adminDashboardService.getStats()));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy danh sách User", description = "Phân trang, tìm kiếm theo tên hoặc email. Sắp xếp mặc định theo ID giảm dần.")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Boolean isPremium,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {
        // Xử lý sort format "field,asc"
        String[] sortParams = sort.split(",");
        Sort sortObj = Sort.by(Sort.Direction.fromString(sortParams[1]), sortParams[0]);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<UserResponse> users = userService.getUsers(keyword, status, isPremium, startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách user thành công", users));
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy chi tiết User", description = "Lấy thông tin chi tiết của một user theo ID.")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin user thành công", userService.getUserById(id)));
    }

    @GetMapping("/users/{userId}/plan")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xem kế hoạch sức khỏe của User", description = "Admin xem chi tiết phân tích sức khỏe (Roadmap) của một user cụ thể.")
    public ResponseEntity<ApiResponse<?>> getUserPlan(@PathVariable Long userId) {
        String analysisJson = healthAnalysisService.getByUserId(userId);

        // DEBUG: Log raw data from database
        System.out.println("========== DEBUG getUserPlan ==========");
        System.out.println("User ID: " + userId);
        System.out.println("Raw analysisJson from DB: " + analysisJson);

        if (analysisJson == null) {
            System.out.println("analysisJson is NULL - User has no health analysis");
            return ResponseEntity.ok(ApiResponse.success("User chưa có phân tích sức khỏe", null));
        }

        try {
            // Parse JSON string to Object to prevent double-stringification
            Object parsedJson = objectMapper.readValue(analysisJson, Object.class);

            // DEBUG: Log parsed object
            System.out.println("Parsed Object type: " + parsedJson.getClass().getName());
            System.out.println("Parsed Object: " + objectMapper.writeValueAsString(parsedJson));

            Map<String, Object> response = new HashMap<>();
            response.put("analysisJson", parsedJson);

            // DEBUG: Log final response
            System.out.println("Final response: " + objectMapper.writeValueAsString(response));
            System.out.println("=======================================");

            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin phân tích người dùng thành công", response));
        } catch (Exception e) {
            System.err.println("ERROR parsing analysisJson: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(ApiResponse.success("Lỗi parse dữ liệu phân tích", null));
        }
    }

    @GetMapping("/users/{userId}/meal-plan")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xem thực đơn của User", description = "Admin xem chi tiết thực đơn 7 ngày của một user cụ thể.")
    public ResponseEntity<ApiResponse<?>> getUserMealPlan(@PathVariable Long userId) {

        return ResponseEntity
                .ok(ApiResponse.success("Lấy thực đơn user thành công", mealPlanService.getByUserId(userId)));
    }

    @PatchMapping("/users/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Kích hoạt/Vô hiệu hóa người dùng", description = "Chuyển đổi trạng thái hoạt động của người dùng (Active/Inactive).")
    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(@PathVariable Long id) {
        userService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Thay đổi trạng thái người dùng thành công", null));
    }

    @PatchMapping("/users/{id}/toggle-premium")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Kích hoạt/Hủy gói Premium", description = "Chuyển đổi trạng thái Premium của người dùng.")
    public ResponseEntity<ApiResponse<Void>> togglePremiumStatus(@PathVariable Long id) {
        userService.togglePremiumStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Thay đổi trạng thái Premium thành công", null));
    }

    @PatchMapping("/users/batch/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cập nhật trạng thái hàng loạt", description = "Cập nhật trạng thái cho nhiều người dùng cùng lúc.")
    public ResponseEntity<ApiResponse<Void>> batchUpdateStatus(@RequestBody Map<String, Object> request) {
        java.util.List<Long> ids = ((java.util.List<?>) request.get("ids")).stream()
                .map(id -> Long.valueOf(id.toString()))
                .toList();
        Integer status = Integer.valueOf(request.get("status").toString());
        userService.batchUpdateStatus(ids, status);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái hàng loạt thành công", null));
    }

    @PatchMapping("/users/batch/premium")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cập nhật Premium hàng loạt", description = "Cập nhật gói Premium cho nhiều người dùng cùng lúc.")
    public ResponseEntity<ApiResponse<Void>> batchUpdatePremium(@RequestBody Map<String, Object> request) {
        java.util.List<Long> ids = ((java.util.List<?>) request.get("ids")).stream()
                .map(id -> Long.valueOf(id.toString()))
                .toList();
        Boolean isPremium = Boolean.valueOf(request.get("isPremium").toString());
        userService.batchUpdatePremium(ids, isPremium);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật Premium hàng loạt thành công", null));
    }

    @DeleteMapping("/dishes/batch")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xóa món ăn hàng loạt", description = "Xóa vĩnh viễn nhiều món ăn cùng lúc.")
    public ResponseEntity<ApiResponse<Void>> batchDeleteDishes(@RequestBody Map<String, Object> request) {
        java.util.List<Long> ids = ((java.util.List<?>) request.get("ids")).stream()
                .map(id -> Long.valueOf(id.toString()))
                .toList();
        dishService.batchDelete(ids);
        return ResponseEntity.ok(ApiResponse.success("Xóa món ăn hàng loạt thành công", null));
    }

    @PatchMapping("/dishes/batch/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Ẩn/Hiện món ăn hàng loạt", description = "Cập nhật trạng thái hiển thị cho nhiều món ăn.")
    public ResponseEntity<ApiResponse<Void>> batchUpdateDishStatus(@RequestBody Map<String, Object> request) {
        java.util.List<Long> ids = ((java.util.List<?>) request.get("ids")).stream()
                .map(id -> Long.valueOf(id.toString()))
                .toList();
        Boolean isDeleted = Boolean.valueOf(request.get("isDeleted").toString());
        dishService.batchUpdateStatus(ids, isDeleted);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái món ăn hàng loạt thành công", null));
    }

    @PatchMapping("/dishes/batch/verify")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xác nhận món ăn hàng loạt", description = "Cập nhật trạng thái xác nhận cho nhiều món ăn.")
    public ResponseEntity<ApiResponse<Void>> batchVerifyDishes(@RequestBody Map<String, Object> request) {
        java.util.List<Long> ids = ((java.util.List<?>) request.get("ids")).stream()
                .map(id -> Long.valueOf(id.toString()))
                .toList();
        Boolean isVerified = Boolean.valueOf(request.get("isVerified").toString());
        dishService.batchVerify(ids, isVerified);
        return ResponseEntity.ok(ApiResponse.success("Xác nhận món ăn hàng loạt thành công", null));
    }
}
