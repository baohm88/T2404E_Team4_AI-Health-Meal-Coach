// package com.t2404e.aihealthcoach.service.impl;

// import java.net.URLEncoder;
// import java.nio.charset.StandardCharsets;
// import java.text.SimpleDateFormat;
// import java.util.ArrayList;
// import java.util.Calendar;
// import java.util.Collections;
// import java.util.HashMap;
// import java.util.Iterator;
// import java.util.List;
// import java.util.Map;
// import java.util.Optional;
// import java.util.TimeZone;

// import org.springframework.stereotype.Service;

// import com.t2404e.aihealthcoach.config.VNPayConfig;
// import com.t2404e.aihealthcoach.entity.Transaction;
// import com.t2404e.aihealthcoach.entity.User;
// import com.t2404e.aihealthcoach.enums.TransactionStatus;
// import com.t2404e.aihealthcoach.exception.InvalidSignatureException;
// import com.t2404e.aihealthcoach.repository.TransactionRepository;
// import com.t2404e.aihealthcoach.repository.UserRepository;
// import com.t2404e.aihealthcoach.service.PaymentService;

// import jakarta.servlet.http.HttpServletRequest;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;

// @Service
// @RequiredArgsConstructor
// @Slf4j
// public class PaymentServiceImpl implements PaymentService {

//     private final UserRepository userRepository;
//     private final TransactionRepository transactionRepository;

//     @Override
//     public String createPaymentUrl(Long userId, long amount, HttpServletRequest req) throws Exception {
//         String vnp_Version = "2.1.0";
//         String vnp_Command = "pay";
//         String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
//         String vnp_IpAddr = VNPayConfig.getIpAddress(req);
//         String vnp_TmnCode = VNPayConfig.vnp_TmnCode;

//         // Lưu UserID vào OrderInfo để đối soát sau này
//         String orderInfo = "Payment_User_" + userId;

//         Map<String, String> vnp_Params = new HashMap<>();
//         vnp_Params.put("vnp_Version", vnp_Version);
//         vnp_Params.put("vnp_Command", vnp_Command);
//         vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
//         vnp_Params.put("vnp_Amount", String.valueOf(amount * 100)); // x100 theo quy định VNPay
//         vnp_Params.put("vnp_CurrCode", "VND");
//         vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
//         vnp_Params.put("vnp_OrderInfo", orderInfo);
//         vnp_Params.put("vnp_OrderType", "other");
//         vnp_Params.put("vnp_Locale", "vn");
//         vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
//         vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

//         Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
//         SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
//         String vnp_CreateDate = formatter.format(cld.getTime());
//         vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

//         cld.add(Calendar.MINUTE, 15);
//         String vnp_ExpireDate = formatter.format(cld.getTime());
//         vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

//         // Build Hash Data
//         List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
//         Collections.sort(fieldNames);
//         StringBuilder hashData = new StringBuilder();
//         StringBuilder query = new StringBuilder();
//         Iterator<String> itr = fieldNames.iterator();
//         while (itr.hasNext()) {
//             String fieldName = itr.next();
//             String fieldValue = vnp_Params.get(fieldName);
//             if ((fieldValue != null) && (fieldValue.length() > 0)) {
//                 // Build hash data
//                 hashData.append(fieldName);
//                 hashData.append('=');
//                 hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
//                 // Build query
//                 query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
//                 query.append('=');
//                 query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
//                 if (itr.hasNext()) {
//                     query.append('&');
//                     hashData.append('&');
//                 }
//             }
//         }
//         String queryUrl = query.toString();
//         String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
//         queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

//         // --- NEW: Save Pending Transaction ---
//         User user = userRepository.findById(userId)
//                 .orElseThrow(() -> new RuntimeException("User not found: " + userId));

//         Transaction transaction = Transaction.builder()
//                 .user(user)
//                 .amount(amount)
//                 .vnpTxnRef(vnp_TxnRef)
//                 .vnpOrderInfo(orderInfo)
//                 .status(TransactionStatus.PENDING)
//                 .build();

//         transactionRepository.save(transaction);
//         // -------------------------------------

//         return VNPayConfig.vnp_PayUrl + "?" + queryUrl;
//     }

//     @Override
//     public boolean processPaymentReturn(Map<String, String> requestParams) {
//         // 1. Verify SecureHash
//         String vnp_SecureHash = requestParams.get("vnp_SecureHash");
//         if (vnp_SecureHash == null) return false;

//         // Remove hash params from data to be hashed
//         Map<String, String> hashParams = new HashMap<>(requestParams);
//         hashParams.remove("vnp_SecureHash");
//         hashParams.remove("vnp_SecureHashType");

//         // Sort fields
//         List<String> fieldNames = new ArrayList<>(hashParams.keySet());
//         Collections.sort(fieldNames);

//         // Build hash data string
//         StringBuilder hashData = new StringBuilder();
//         Iterator<String> itr = fieldNames.iterator();
//         while (itr.hasNext()) {
//             String fieldName = itr.next();
//             String fieldValue = hashParams.get(fieldName);
//             if ((fieldValue != null) && (fieldValue.length() > 0)) {
//                 hashData.append(fieldName);
//                 hashData.append('=');
//                 try {
//                     // VNPay requires encoding values when hashing for return URL as well
//                     hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
//                 } catch (Exception e) {
//                     return false;
//                 }
//                 if (itr.hasNext()) {
//                     hashData.append('&');
//                 }
//             }
//         }

//         String checkSum = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
//         if (!checkSum.equalsIgnoreCase(vnp_SecureHash)) {
//             throw new InvalidSignatureException("Invalid Checksum. Transaction may have been tampered with.");
//         }

//         // 2. Process Result and Update Transaction
//         String vnp_TxnRef = requestParams.get("vnp_TxnRef");
//         String vnp_ResponseCode = requestParams.get("vnp_ResponseCode");
//         String vnp_TransactionNo = requestParams.get("vnp_TransactionNo");

//         // Find Transaction
//         Optional<Transaction> transactionOpt = transactionRepository.findByVnpTxnRef(vnp_TxnRef);

//         if (transactionOpt.isPresent()) {
//             Transaction transaction = transactionOpt.get();
//             transaction.setVnpTransactionNo(vnp_TransactionNo);
//             transaction.setVnpResponseCode(vnp_ResponseCode);

//             // "00" = Giao dịch thành công
//             if ("00".equals(vnp_ResponseCode)) {
//                 transaction.setStatus(TransactionStatus.SUCCESS);
//                 transactionRepository.save(transaction);

//                 // Auto Upgrade Premium
//                 User user = transaction.getUser();
//                 if (!user.getIsPremium()) {
//                     user.setIsPremium(true);
//                     userRepository.save(user);
//                 }
//                 return true;
//             } else {
//                 transaction.setStatus(TransactionStatus.FAILED);
//                 transactionRepository.save(transaction);
//                 return false;
//             }
//         } else {
//             // Transaction Not Found (Should record error or log)
//             System.err.println("Transaction not found for ref: " + vnp_TxnRef);
//             return false;
//         }
//     }

//     @Override
//     public com.t2404e.aihealthcoach.dto.TransactionDTO getTransactionStatus(String vnpTransactionNo) {
//         return transactionRepository.findByVnpTransactionNo(vnpTransactionNo)
//                 .map(txn -> com.t2404e.aihealthcoach.dto.TransactionDTO.builder()
//                         .transactionId(txn.getVnpTransactionNo())
//                         .status(txn.getStatus())
//                         .amount(txn.getAmount())
//                         .isPremium(txn.getUser().getIsPremium())
//                         .paidAt(txn.getCreatedAt())
//                         .build())
//                 .orElse(null);
//     }
// }



package com.t2404e.aihealthcoach.service.impl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import org.springframework.stereotype.Service;

import com.t2404e.aihealthcoach.config.VNPayConfig;
import com.t2404e.aihealthcoach.entity.Transaction;
import com.t2404e.aihealthcoach.entity.User;
import com.t2404e.aihealthcoach.enums.TransactionStatus;
import com.t2404e.aihealthcoach.exception.InvalidSignatureException;
import com.t2404e.aihealthcoach.repository.TransactionRepository;
import com.t2404e.aihealthcoach.repository.UserRepository;
import com.t2404e.aihealthcoach.service.PaymentService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    // VNPay hay match tốt nhất với: URLEncoder + replace + -> %20
    private static String vnpEncode(String value) {
        try {
            return URLEncoder.encode(value, StandardCharsets.UTF_8.toString())
                    .replace("+", "%20");
        } catch (Exception e) {
            return value;
        }
    }

    @Override
    public String createPaymentUrl(Long userId, long amount, HttpServletRequest req) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = VNPayConfig.getRandomNumber(8);

        String ip = VNPayConfig.getIpAddress(req);
        String vnp_IpAddr = (ip != null && ip.contains(":")) ? "127.0.0.1" : ip;

        String orderInfo = "Payment_User_" + userId;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100)); // x100
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfo);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // timezone fix
        TimeZone tz = TimeZone.getTimeZone("Asia/Ho_Chi_Minh");
        Calendar cld = Calendar.getInstance(tz);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(tz);

        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // sort keys
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        // ====== IMPORTANT PART ======
        // hashData: fieldName=ENCODED(fieldValue)
        // query   : ENCODED(fieldName)=ENCODED(fieldValue)
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        boolean first = true;

        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue == null || fieldValue.isEmpty()) continue;

            if (!first) {
                hashData.append('&');
                query.append('&');
            }
            first = false;

            String encValue = vnpEncode(fieldValue);

            // hashData: KHÔNG encode fieldName, CHỈ encode value
            hashData.append(fieldName).append('=').append(encValue);

            // query: encode cả name và value
            query.append(vnpEncode(fieldName)).append('=').append(encValue);
        }

        // thêm SecureHashType (nhiều merchant sandbox yêu cầu rõ)
        query.append("&vnp_SecureHashType=HmacSHA512");

        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
        String paymentUrl = VNPayConfig.vnp_PayUrl
                + "?" + query
                + "&vnp_SecureHash=" + vnp_SecureHash;

        // Save pending transaction
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Transaction transaction = Transaction.builder()
                .user(user)
                .amount(amount)
                .vnpTxnRef(vnp_TxnRef)
                .vnpOrderInfo(orderInfo)
                .status(TransactionStatus.PENDING)
                .build();
        transactionRepository.save(transaction);

        // Logs
        log.info("[VNPay] tmnCode='{}' length={}", VNPayConfig.vnp_TmnCode, VNPayConfig.vnp_TmnCode.length());
        log.info("[VNPay] hashSecret length={}", VNPayConfig.vnp_HashSecret == null ? -1 : VNPayConfig.vnp_HashSecret.length());
        log.info("[VNPay] createDate={} expireDate={}", vnp_CreateDate, vnp_ExpireDate);
        log.info("[VNPay] hashData(encodedValue) = {}", hashData);
        log.info("[VNPay] secureHash = {}", vnp_SecureHash);
        log.info("[VNPay] paymentUrl = {}", paymentUrl);

        return paymentUrl;
    }

    @Override
    public boolean processPaymentReturn(Map<String, String> requestParams) {
        String vnp_SecureHash = requestParams.get("vnp_SecureHash");
        if (vnp_SecureHash == null || vnp_SecureHash.isEmpty()) return false;

        Map<String, String> hashParams = new HashMap<>(requestParams);
        hashParams.remove("vnp_SecureHash");
        hashParams.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(hashParams.keySet());
        Collections.sort(fieldNames);

        // Verify theo đúng logic đang dùng lúc create: encode value
        StringBuilder hashData = new StringBuilder();
        boolean first = true;

        for (String fieldName : fieldNames) {
            String fieldValue = hashParams.get(fieldName);
            if (fieldValue == null || fieldValue.isEmpty()) continue;

            if (!first) hashData.append('&');
            first = false;

            hashData.append(fieldName).append('=').append(vnpEncode(fieldValue));
        }

        String checkSum = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
        if (!checkSum.equalsIgnoreCase(vnp_SecureHash)) {
            log.warn("[VNPay] RETURN hashData(encodedValue) = {}", hashData);
            log.warn("[VNPay] RETURN calculatedHash = {}", checkSum);
            log.warn("[VNPay] RETURN receivedHash = {}", vnp_SecureHash);
            throw new InvalidSignatureException("Invalid Checksum. Transaction may have been tampered with.");
        }

        String vnp_TxnRef = requestParams.get("vnp_TxnRef");
        String vnp_ResponseCode = requestParams.get("vnp_ResponseCode");
        String vnp_TransactionNo = requestParams.get("vnp_TransactionNo");

        Optional<Transaction> transactionOpt = transactionRepository.findByVnpTxnRef(vnp_TxnRef);
        if (transactionOpt.isEmpty()) {
            log.error("[VNPay] Transaction not found for ref: {}", vnp_TxnRef);
            return false;
        }

        Transaction transaction = transactionOpt.get();
        transaction.setVnpTransactionNo(vnp_TransactionNo);
        transaction.setVnpResponseCode(vnp_ResponseCode);

        if ("00".equals(vnp_ResponseCode)) {
            transaction.setStatus(TransactionStatus.SUCCESS);
            transactionRepository.save(transaction);

            User user = transaction.getUser();
            if (!Boolean.TRUE.equals(user.getIsPremium())) {
                user.setIsPremium(true);
                userRepository.save(user);
            }
            return true;
        } else {
            transaction.setStatus(TransactionStatus.FAILED);
            transactionRepository.save(transaction);
            return false;
        }
    }

    @Override
    public com.t2404e.aihealthcoach.dto.TransactionDTO getTransactionStatus(String vnpTransactionNo) {
        return transactionRepository.findByVnpTransactionNo(vnpTransactionNo)
                .map(txn -> com.t2404e.aihealthcoach.dto.TransactionDTO.builder()
                        .transactionId(txn.getVnpTransactionNo())
                        .status(txn.getStatus())
                        .amount(txn.getAmount())
                        .isPremium(txn.getUser().getIsPremium())
                        .paidAt(txn.getCreatedAt())
                        .build())
                .orElse(null);
    }
}