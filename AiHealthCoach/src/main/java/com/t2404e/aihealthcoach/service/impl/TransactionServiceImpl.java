package com.t2404e.aihealthcoach.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.t2404e.aihealthcoach.dto.TransactionDTO;
import com.t2404e.aihealthcoach.entity.Transaction;
import com.t2404e.aihealthcoach.repository.TransactionRepository;
import com.t2404e.aihealthcoach.service.TransactionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    @Override
    public Page<TransactionDTO> getAllTransactions(String keyword, com.t2404e.aihealthcoach.enums.TransactionStatus status, String startDate, String endDate, Pageable pageable) {
        java.time.LocalDateTime start = null;
        java.time.LocalDateTime end = null;

        try {
            if (startDate != null && !startDate.isEmpty()) {
                start = java.time.LocalDate.parse(startDate).atStartOfDay();
            }
            if (endDate != null && !endDate.isEmpty()) {
                end = java.time.LocalDate.parse(endDate).atTime(java.time.LocalTime.MAX);
            }
        } catch (Exception e) {
            // Log error or ignore invalid dates
            System.err.println("Invalid date format: " + e.getMessage());
        }

        Page<Transaction> transactions = transactionRepository.searchTransactions(keyword, status, start, end, pageable);
        return transactions.map(this::mapToDTO);
    }

    private TransactionDTO mapToDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .transactionId(transaction.getVnpTransactionNo())
                .status(transaction.getStatus())
                .amount(transaction.getAmount())
                .isPremium(transaction.getUser() != null ? transaction.getUser().getIsPremium() : false)
                .paidAt(transaction.getCreatedAt())
                .userEmail(transaction.getUser() != null ? transaction.getUser().getEmail() : "Unknown")
                .userName(transaction.getUser() != null ? transaction.getUser().getFullName() : "Unknown")
                .build();
    }
}
