package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping("/vnpay-return")
    public ResponseEntity<ApiResponse<?>> handleReturn(@RequestParam Map<String, String> allParams) {
        boolean success = paymentService.processPaymentReturn(allParams);
        
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("Payment successful. User upgraded to Premium.", null));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Payment failed or invalid signature."));
        }
    }
}