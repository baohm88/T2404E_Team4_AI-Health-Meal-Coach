package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.request.VnPayCallbackDTO;
import com.t2404e.aihealthcoach.service.PaymentService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
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

    @Operation(summary = "VNPay Return Callback", description = "Handles the callback from VNPay after payment.")
    @GetMapping("/vnpay-return")
    public void handleReturn(
            // Khai báo rõ từng param, set required = false
            @RequestParam(value = "vnp_Amount", required = false) String vnp_Amount,
            @RequestParam(value = "vnp_BankCode", required = false) String vnp_BankCode,
            @RequestParam(value = "vnp_BankTranNo", required = false) String vnp_BankTranNo,
            @RequestParam(value = "vnp_CardType", required = false) String vnp_CardType,
            @RequestParam(value = "vnp_OrderInfo", required = false) String vnp_OrderInfo,
            @RequestParam(value = "vnp_PayDate", required = false) String vnp_PayDate,
            @RequestParam(value = "vnp_ResponseCode", required = false) String vnp_ResponseCode,
            @RequestParam(value = "vnp_TmnCode", required = false) String vnp_TmnCode,
            @RequestParam(value = "vnp_TransactionNo", required = false) String vnp_TransactionNo,
            @RequestParam(value = "vnp_TransactionStatus", required = false) String vnp_TransactionStatus,
            @RequestParam(value = "vnp_TxnRef", required = false) String vnp_TxnRef,
            @RequestParam(value = "vnp_SecureHash", required = false) String vnp_SecureHash,
            HttpServletResponse response
    ) throws IOException {

        // 1. Package các param rời rạc lại thành Map để gửi xuống Service
        Map<String, String> vnpParams = new HashMap<>();

        if (vnp_Amount != null) vnpParams.put("vnp_Amount", vnp_Amount);
        if (vnp_BankCode != null) vnpParams.put("vnp_BankCode", vnp_BankCode);
        if (vnp_BankTranNo != null) vnpParams.put("vnp_BankTranNo", vnp_BankTranNo);
        if (vnp_CardType != null) vnpParams.put("vnp_CardType", vnp_CardType);
        if (vnp_OrderInfo != null) vnpParams.put("vnp_OrderInfo", vnp_OrderInfo);
        if (vnp_PayDate != null) vnpParams.put("vnp_PayDate", vnp_PayDate);
        if (vnp_ResponseCode != null) vnpParams.put("vnp_ResponseCode", vnp_ResponseCode);
        if (vnp_TmnCode != null) vnpParams.put("vnp_TmnCode", vnp_TmnCode);
        if (vnp_TransactionNo != null) vnpParams.put("vnp_TransactionNo", vnp_TransactionNo);
        if (vnp_TransactionStatus != null) vnpParams.put("vnp_TransactionStatus", vnp_TransactionStatus);
        if (vnp_TxnRef != null) vnpParams.put("vnp_TxnRef", vnp_TxnRef);
        if (vnp_SecureHash != null) vnpParams.put("vnp_SecureHash", vnp_SecureHash);

        // 2. Gọi Service xử lý (Code Service giữ nguyên logic nhận Map)
        try {
            boolean success = paymentService.processPaymentReturn(vnpParams);

            if (success) {
                response.sendRedirect("http://localhost:3000/dashboard?payment=success");
            } else {
                response.sendRedirect("http://localhost:3000/dashboard?payment=failed");
            }
        } catch (Exception e) {
            response.sendRedirect("http://localhost:3000/dashboard?payment=error&msg=" + e.getMessage());
        }
    }
}