package com.t2404e.aihealthcoach.service;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

public interface PaymentService {
    
    // Tạo URL thanh toán VNPay
    String createPaymentUrl(Long userId, long amount, HttpServletRequest req) throws Exception;

    // Xử lý callback trả về từ VNPay -> Tự động kích hoạt Premium
    boolean processPaymentReturn(Map<String, String> requestParams);
}