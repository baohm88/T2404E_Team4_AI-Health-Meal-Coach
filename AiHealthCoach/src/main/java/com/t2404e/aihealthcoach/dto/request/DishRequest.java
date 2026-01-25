package com.t2404e.aihealthcoach.dto.request;

import com.t2404e.aihealthcoach.enums.MealTimeSlot;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DishRequest {
    @NotBlank(message = "Tên món ăn không được để trống")
    private String name;

    @Min(value = 0, message = "Calo phải lớn hơn hoặc bằng 0")
    private Integer baseCalories;

    @NotBlank(message = "Đơn vị tính không được để trống")
    private String unit;

    private MealTimeSlot category;

    private String description;
}
