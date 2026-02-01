package com.t2404e.aihealthcoach.dto;

import java.time.LocalDateTime;

import com.t2404e.aihealthcoach.enums.TransactionStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TransactionDTO {
    private String transactionId; // VNPay Transaction No
    private TransactionStatus status;
    private Long amount;
    private Boolean isPremium;
    private LocalDateTime paidAt;
    private String error;
}
