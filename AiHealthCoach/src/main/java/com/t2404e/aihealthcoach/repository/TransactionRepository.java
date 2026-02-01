package com.t2404e.aihealthcoach.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.t2404e.aihealthcoach.entity.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByVnpTxnRef(String vnpTxnRef);

    Optional<Transaction> findByVnpTransactionNo(String vnpTransactionNo);
}
