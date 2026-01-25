package com.t2404e.aihealthcoach.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.t2404e.aihealthcoach.entity.DishLibrary;
import com.t2404e.aihealthcoach.enums.MealTimeSlot;

@Repository
public interface DishLibraryRepository extends JpaRepository<DishLibrary, Long> {
    List<DishLibrary> findByCategory(MealTimeSlot category); // Giữ lại method cũ cho logic cũ
    List<DishLibrary> findByNameContainingIgnoreCase(String name); // Giữ lại method cũ for logic cũ

    /**
     * Tìm kiếm món ăn theo tên (phân trang) - Chỉ lấy món chưa xóa
     */
    Page<DishLibrary> findByNameContainingIgnoreCaseAndIsDeletedFalse(String name, Pageable pageable);

    /**
     * Lọc món ăn theo category (phân trang) - Chỉ lấy món chưa xóa
     */
    Page<DishLibrary> findByCategoryAndIsDeletedFalse(MealTimeSlot category, Pageable pageable);

    /**
     * Lấy tất cả món ăn chưa xóa
     */
    Page<DishLibrary> findAllByIsDeletedFalse(Pageable pageable);
}
