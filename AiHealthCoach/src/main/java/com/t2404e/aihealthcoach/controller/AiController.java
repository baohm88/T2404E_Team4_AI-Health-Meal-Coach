package com.t2404e.aihealthcoach.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.request.HealthProfileRequest;
import com.t2404e.aihealthcoach.dto.response.ai.AiHealthAnalysisResponse;
import com.t2404e.aihealthcoach.service.AiHealthAnalysisService;
import com.t2404e.aihealthcoach.service.HealthAnalysisService;
import com.t2404e.aihealthcoach.util.RequestUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Tag(name = "AI Analysis", description = "Phân tích sức khỏe và đề xuất lộ trình bằng AI")
@lombok.extern.slf4j.Slf4j
public class AiController {

    private final AiHealthAnalysisService aiService;
    private final HealthAnalysisService storageService;
    private final com.t2404e.aihealthcoach.service.HealthProfileService profileService; // Inject Profile Service
    private final ObjectMapper objectMapper;

    @PostMapping("/health-analysis")
    @Operation(summary = "Phân tích chỉ số sức khỏe", description = "Gửi thông tin cơ bản (chiêu cao, cân nặng, v.v) để AI phân tích BMI, BMR, TDEE và lộ trình.")
    public ApiResponse<AiHealthAnalysisResponse> analyze(
            @Valid @RequestBody HealthProfileRequest request,
            HttpServletRequest httpRequest) {

        // 1. Chạy AI phân tích
        AiHealthAnalysisResponse analysis = aiService.analyze(request);

        // 2. Tự động lưu nếu người dùng đã đăng nhập (Sync logic)
        Long userId = RequestUtil.getUserId(httpRequest);
        if (userId != null) {
            try {
                // Save Health Analysis JSON
                String json = objectMapper.writeValueAsString(analysis);
                storageService.saveOrUpdate(userId, json);

                // Save Health Profile (Height, Weight, etc) to prevent 404 on /health-profile
                try {
                    profileService.saveOrUpdate(userId, request);
                } catch (Exception e) {
                    log.error("Failed to auto-save health profile: {}", e.getMessage()); // Use log.error
                }

            } catch (Exception e) {
                log.error("Failed to auto-save health analysis: {}", e.getMessage()); // Use log.error
            }
        }

        return ApiResponse.success("Health analysis completed", analysis);
    }
}
