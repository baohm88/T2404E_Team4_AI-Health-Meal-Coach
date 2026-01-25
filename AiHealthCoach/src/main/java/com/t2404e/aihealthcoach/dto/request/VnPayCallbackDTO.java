package com.t2404e.aihealthcoach.dto.request;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class VnPayCallbackDTO {
    private String vnp_Amount;
    private String vnp_BankCode;
    private String vnp_BankTranNo;
    private String vnp_CardType;
    private String vnp_OrderInfo;
    private String vnp_PayDate;
    private String vnp_ResponseCode;
    private String vnp_TmnCode;
    private String vnp_TransactionNo;
    private String vnp_TransactionStatus;
    private String vnp_TxnRef;
    private String vnp_SecureHash;

    // Helper method để chuyển về Map cho việc verify chữ ký (Checksum) bên Service
    // Vì thuật toán checksum của VNPay yêu cầu duyệt qua từng key để tạo chuỗi hash
    public Map<String, String> toMap() {
        Map<String, String> map = new HashMap<>();
        if (vnp_Amount != null) map.put("vnp_Amount", vnp_Amount);
        if (vnp_BankCode != null) map.put("vnp_BankCode", vnp_BankCode);
        if (vnp_BankTranNo != null) map.put("vnp_BankTranNo", vnp_BankTranNo);
        if (vnp_CardType != null) map.put("vnp_CardType", vnp_CardType);
        if (vnp_OrderInfo != null) map.put("vnp_OrderInfo", vnp_OrderInfo);
        if (vnp_PayDate != null) map.put("vnp_PayDate", vnp_PayDate);
        if (vnp_ResponseCode != null) map.put("vnp_ResponseCode", vnp_ResponseCode);
        if (vnp_TmnCode != null) map.put("vnp_TmnCode", vnp_TmnCode);
        if (vnp_TransactionNo != null) map.put("vnp_TransactionNo", vnp_TransactionNo);
        if (vnp_TransactionStatus != null) map.put("vnp_TransactionStatus", vnp_TransactionStatus);
        if (vnp_TxnRef != null) map.put("vnp_TxnRef", vnp_TxnRef);
        if (vnp_SecureHash != null) map.put("vnp_SecureHash", vnp_SecureHash);
        return map;
    }
}