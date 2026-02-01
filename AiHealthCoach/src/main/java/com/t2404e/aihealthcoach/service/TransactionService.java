package com.t2404e.aihealthcoach.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.t2404e.aihealthcoach.dto.TransactionDTO;

public interface TransactionService {
    Page<TransactionDTO> getAllTransactions(Pageable pageable);
}
