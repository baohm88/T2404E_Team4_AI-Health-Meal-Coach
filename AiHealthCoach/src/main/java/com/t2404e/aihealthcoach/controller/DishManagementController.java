package com.t2404e.aihealthcoach.controller;

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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.request.DishRequest;
import com.t2404e.aihealthcoach.entity.DishLibrary;
import com.t2404e.aihealthcoach.enums.MealTimeSlot;
import com.t2404e.aihealthcoach.service.DishService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/dishes")
@RequiredArgsConstructor
@Tag(name = "Admin - Dish Management", description = "Quản lý món ăn trong thư viện")
public class DishManagementController {
    private final DishService dishService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy danh sách món ăn", description = "Tìm kiếm, lọc theo category, phân trang.")
    public ResponseEntity<ApiResponse<Page<DishLibrary>>> getDishes(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) MealTimeSlot category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {
        String[] sortParams = sort.split(",");
        Sort sortObj = Sort.by(Sort.Direction.fromString(sortParams[1]), sortParams[0]);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<DishLibrary> dishes = dishService.getDishes(keyword, category, pageable);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách món ăn thành công", dishes));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xem chi tiết món ăn", description = "Lấy thông tin chi tiết một món ăn theo ID.")
    public ResponseEntity<ApiResponse<DishLibrary>> getDish(@PathVariable Long id) {
        DishLibrary dish = dishService.getDishById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin món ăn thành công", dish));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Thêm mới món ăn", description = "Thêm món ăn vào thư viện chuẩn.")
    public ResponseEntity<ApiResponse<DishLibrary>> createDish(@Valid @RequestBody DishRequest request) {
        DishLibrary dish = dishService.createDish(request);
        return ResponseEntity.ok(ApiResponse.success("Thêm món ăn thành công", dish));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cập nhật món ăn", description = "Sửa thông tin món ăn.")
    public ResponseEntity<ApiResponse<DishLibrary>> updateDish(
            @PathVariable Long id,
            @Valid @RequestBody DishRequest request) {
        DishLibrary dish = dishService.updateDish(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật món ăn thành công", dish));
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Ẩn/Hiện món ăn", description = "Chuyển đổi trạng thái xóa mềm (ẩn/hiện) của món ăn.")
    public ResponseEntity<ApiResponse<Void>> toggleDishStatus(@PathVariable Long id) {
        dishService.toggleDishStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Thay đổi trạng thái hiển thị thành công", null));
    }

    @PatchMapping("/{id}/toggle-verify")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xác nhận/Hủy xác nhận món ăn", description = "Chuyển đổi trạng thái xác thực của món ăn.")
    public ResponseEntity<ApiResponse<Void>> toggleVerifyStatus(@PathVariable Long id) {
        dishService.toggleVerifyStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Thay đổi trạng thái xác thực thành công", null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xóa vĩnh viễn món ăn", description = "Xóa hoàn toàn món ăn khỏi database.")
    public ResponseEntity<ApiResponse<Void>> deleteDish(@PathVariable Long id) {
        dishService.deleteDish(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa món ăn thành công", null));
    }
}
