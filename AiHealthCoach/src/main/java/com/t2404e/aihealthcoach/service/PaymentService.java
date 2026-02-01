package com.t2404e.aihealthcoach.service;

import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    
    // Tạo URL thanh toán VNPay
    String createPaymentUrl(Long userId, long amount, HttpServletRequest req) throws Exception;

    // Xử lý callback trả về từ VNPay -> Tự động kích hoạt Premium
    boolean processPaymentReturn(Map<String, String> requestParams);

    // Kiểm tra trạng thái giao dịch
    com.t2404e.aihealthcoach.dto.TransactionDTO getTransactionStatus(String vnpTransactionNo);
}