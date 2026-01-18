package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.request.AiMealSuggestionRequest;
import com.t2404e.aihealthcoach.dto.response.AiMealSuggestionResponse;

public interface AiMealService {

    AiMealSuggestionResponse suggestMeal(AiMealSuggestionRequest request);
}
