package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.request.HealthProfileRequest;
import com.t2404e.aihealthcoach.dto.response.ai.AiHealthAnalysisResponse;
import com.t2404e.aihealthcoach.service.AiHealthAnalysisService;
import com.t2404e.aihealthcoach.service.HealthAnalysisService;
import com.t2404e.aihealthcoach.util.RequestUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiHealthAnalysisService aiService;
    private final HealthAnalysisService storageService;
    private final ObjectMapper objectMapper;

    @PostMapping("/health-analysis")
    public ApiResponse<AiHealthAnalysisResponse> analyze(
            @Valid @RequestBody HealthProfileRequest request,
            HttpServletRequest httpRequest) {

        // 1. Chạy AI phân tích
        AiHealthAnalysisResponse analysis = aiService.analyze(request);

        // 2. Tự động lưu nếu người dùng đã đăng nhập (Sync logic)
        Long userId = RequestUtil.getUserId(httpRequest);
        if (userId != null) {
            try {
                String json = objectMapper.writeValueAsString(analysis);
                storageService.saveOrUpdate(userId, json);
            } catch (Exception e) {
                System.err.println("❌ Failed to auto-save health analysis: " + e.getMessage());
            }
        }

        return ApiResponse.success("Health analysis completed", analysis);
    }
}
