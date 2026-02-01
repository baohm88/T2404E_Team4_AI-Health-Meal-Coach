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

    @org.springframework.data.jpa.repository.Query("SELECT t FROM Transaction t WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR CAST(t.id AS string) LIKE %:keyword% OR t.vnpTxnRef LIKE %:keyword% OR LOWER(t.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.user.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:status IS NULL OR t.status = :status) AND " +
            "(:startDate IS NULL OR t.createdAt >= :startDate) AND " +
            "(:endDate IS NULL OR t.createdAt <= :endDate)")
    org.springframework.data.domain.Page<Transaction> searchTransactions(
            @org.springframework.data.repository.query.Param("keyword") String keyword,
            @org.springframework.data.repository.query.Param("status") com.t2404e.aihealthcoach.enums.TransactionStatus status,
            @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
            @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate,
            org.springframework.data.domain.Pageable pageable
    );
}
