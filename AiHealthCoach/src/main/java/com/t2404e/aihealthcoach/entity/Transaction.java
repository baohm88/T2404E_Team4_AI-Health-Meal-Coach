package com.t2404e.aihealthcoach.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.t2404e.aihealthcoach.enums.TransactionStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Long amount;

    @Column(name = "vnp_txn_ref", nullable = false, unique = true)
    private String vnpTxnRef; // Unique Order ID sent to VNPay

    @Column(name = "vnp_transaction_no")
    private String vnpTransactionNo; // VNPay's Transaction ID

    @Column(name = "vnp_order_info")
    private String vnpOrderInfo;

    @Column(name = "vnp_response_code")
    private String vnpResponseCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status; // PENDING, SUCCESS, FAILED

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
