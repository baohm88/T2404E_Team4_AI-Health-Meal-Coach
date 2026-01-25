package com.t2404e.aihealthcoach.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.t2404e.aihealthcoach.dto.request.DishRequest;
import com.t2404e.aihealthcoach.entity.DishLibrary;
import com.t2404e.aihealthcoach.enums.MealTimeSlot;
import com.t2404e.aihealthcoach.exception.ResourceNotFoundException;
import com.t2404e.aihealthcoach.repository.DishLibraryRepository;
import com.t2404e.aihealthcoach.service.DishService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DishServiceImpl implements DishService {

    private final DishLibraryRepository dishRepository;

    @Override
    public Page<DishLibrary> getDishes(String keyword, MealTimeSlot category, Pageable pageable) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return dishRepository.findByNameContainingIgnoreCaseAndIsDeletedFalse(keyword, pageable);
        }
        if (category != null) {
            return dishRepository.findByCategoryAndIsDeletedFalse(category, pageable);
        }
        return dishRepository.findAllByIsDeletedFalse(pageable);
    }

    @Override
    public DishLibrary getDishById(Long id) {
        return dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Món ăn không tồn tại: " + id));
    }

    @Override
    public DishLibrary createDish(DishRequest request) {
        DishLibrary dish = DishLibrary.builder()
                .name(request.getName())
                .baseCalories(request.getBaseCalories())
                .unit(request.getUnit())
                .category(request.getCategory())
                .description(request.getDescription())
                .isAiSuggested(false) // Món do admin tạo thì là chuẩn, ko phải gợi ý
                .isDeleted(false)
                .isVerified(true)
                .build();
        return dishRepository.save(dish);
    }

    @Override
    public DishLibrary updateDish(Long id, DishRequest request) {
        DishLibrary dish = getDishById(id);

        dish.setName(request.getName());
        dish.setBaseCalories(request.getBaseCalories());
        dish.setUnit(request.getUnit());
        dish.setCategory(request.getCategory());
        dish.setDescription(request.getDescription());

        return dishRepository.save(dish);
    }

    @Override
    public void toggleDishStatus(Long id) {
        DishLibrary dish = getDishById(id);
        dish.setIsDeleted(!Boolean.TRUE.equals(dish.getIsDeleted())); // Toggle status
        dishRepository.save(dish);
    }
}
