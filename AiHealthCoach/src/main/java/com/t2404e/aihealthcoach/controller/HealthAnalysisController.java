package com.t2404e.aihealthcoach.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.service.HealthAnalysisService;
import com.t2404e.aihealthcoach.util.RequestUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/health-analysis")
@Tag(name = "Health Analysis History", description = "Lịch sử phân tích sức khỏe người dùng")
public class HealthAnalysisController {

    private final HealthAnalysisService service;

    public HealthAnalysisController(HealthAnalysisService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Lưu kết quả phân tích", description = "Lưu lại JSON kết quả phân tích AI vào lịch sử.")
    public ResponseEntity<ApiResponse<Void>> save(
            @RequestBody String analysisJson,
            HttpServletRequest request) {

        Long userId = RequestUtil.getUserId(request);

        service.saveOrUpdate(userId, analysisJson);

        return ResponseEntity.ok(
                ApiResponse.success("Health analysis saved successfully", null));
    }

    @GetMapping
    @Operation(summary = "Lấy lịch sử phân tích gần nhất", description = "Lấy kết quả phân tích AI gần nhất của người dùng.")
    public ResponseEntity<ApiResponse<String>> get(
            HttpServletRequest request) {

        Long userId = RequestUtil.getUserId(request);
        if (userId == null) {
            return ResponseEntity
                    .ok(ApiResponse.error("Vui lòng đăng nhập hoặc hoàn thành khảo sát để xem kết quả phân tích."));
        }

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Health analysis fetched successfully",
                        service.getByUserId(userId)));
    }
}
