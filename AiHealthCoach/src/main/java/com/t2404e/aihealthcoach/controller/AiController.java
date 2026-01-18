package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.request.AiMealSuggestionRequest;
import com.t2404e.aihealthcoach.service.AiMealService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final AiMealService service;

    public AiController(AiMealService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/meal-suggestion")
    public ResponseEntity<ApiResponse<?>> suggestMeal(
            @Valid @RequestBody AiMealSuggestionRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "AI meal suggestion generated",
                        service.suggestMeal(request)
                )
        );
    }
}
