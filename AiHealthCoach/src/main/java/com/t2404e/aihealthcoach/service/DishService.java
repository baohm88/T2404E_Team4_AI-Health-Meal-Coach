package com.t2404e.aihealthcoach.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.t2404e.aihealthcoach.dto.request.DishRequest;
import com.t2404e.aihealthcoach.entity.DishLibrary;
import com.t2404e.aihealthcoach.enums.MealTimeSlot;

public interface DishService {
    /**
     * Lấy danh sách món ăn (có lọc và phân trang)
     */
    Page<DishLibrary> getDishes(String keyword, MealTimeSlot category, Pageable pageable);

    DishLibrary getDishById(Long id);

    DishLibrary createDish(DishRequest request);

    DishLibrary updateDish(Long id, DishRequest request);

    void toggleDishStatus(Long id);
}
