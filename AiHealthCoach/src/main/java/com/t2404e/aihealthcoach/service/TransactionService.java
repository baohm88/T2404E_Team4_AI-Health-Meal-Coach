package com.t2404e.aihealthcoach.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.t2404e.aihealthcoach.dto.TransactionDTO;

public interface TransactionService {
    Page<TransactionDTO> getAllTransactions(String keyword, com.t2404e.aihealthcoach.enums.TransactionStatus status, String startDate, String endDate, Pageable pageable);
}
