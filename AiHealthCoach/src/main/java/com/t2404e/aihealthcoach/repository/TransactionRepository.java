package com.t2404e.aihealthcoach.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.t2404e.aihealthcoach.entity.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByVnpTxnRef(String vnpTxnRef);

    Optional<Transaction> findByVnpTransactionNo(String vnpTransactionNo);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.status = :status AND t.createdAt BETWEEN :start AND :end")
    Long sumAmountByStatusAndCreatedAtBetween(
            @org.springframework.web.bind.annotation.RequestParam("status") com.t2404e.aihealthcoach.enums.TransactionStatus status,
            @org.springframework.web.bind.annotation.RequestParam("start") java.time.LocalDateTime start,
            @org.springframework.web.bind.annotation.RequestParam("end") java.time.LocalDateTime end
    );

    // Pagination support is already provided by JpaRepository
    org.springframework.data.domain.Page<Transaction> findAll(org.springframework.data.domain.Pageable pageable);
}
