package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // 1. API Tạo link thanh toán (Gọi khi bấm nút "Mua ngay")
    // Frontend gửi userId và amount lên
    @GetMapping("/create-url")
    public ResponseEntity<ApiResponse<String>> createPayment(
            @RequestParam Long userId,
            @RequestParam long amount,
            HttpServletRequest request
    ) {
        try {
            String url = paymentService.createPaymentUrl(userId, amount, request);
            return ResponseEntity.ok(ApiResponse.success("URL generated", url));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to generate URL"));
        }
    }

    // 2. API Callback (Frontend gọi API này sau khi VNPay redirect về)
    // Frontend gom toàn bộ URL Params gửi vào đây
    @Operation(summary = "VNPay Return Callback", description = "Handles the callback from VNPay after payment. Verifies signature and updates user status. Redirects to Frontend.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "302", description = "Redirect to Frontend (Success/Fail)")
    @GetMapping("/vnpay-return")
    public void handleReturn(@RequestParam Map<String, String> allParams, HttpServletResponse response) throws IOException {
        try {
            boolean success = paymentService.processPaymentReturn(allParams);
            
            if (success) {
                // Redirect về trang thành công của Frontend (Next.js)
                response.sendRedirect("http://localhost:3000/dashboard?payment=success");
            } else {
                // Redirect về trang thất bại
                response.sendRedirect("http://localhost:3000/dashboard?payment=failed");
            }
        } catch (Exception e) {
             // Lỗi hệ thống hoặc Checksum sai
             response.sendRedirect("http://localhost:3000/dashboard?payment=error&msg=" + e.getMessage());
        }
    }
}