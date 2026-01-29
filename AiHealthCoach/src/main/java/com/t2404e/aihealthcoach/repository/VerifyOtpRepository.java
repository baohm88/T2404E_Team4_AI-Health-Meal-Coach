package com.t2404e.aihealthcoach.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.t2404e.aihealthcoach.entity.VerifyOtp;

@Repository
public interface VerifyOtpRepository extends JpaRepository<VerifyOtp, Long> {

    /**
     * Find the latest OTP record for an email (most recent createdDate first)
     */
    Optional<VerifyOtp> findTopByEmailOrderByCreatedDateDesc(String email);

    /**
     * Delete old OTP records that are older than the specified time
     */
    @Modifying
    @Query("DELETE FROM VerifyOtp v WHERE v.createdDate < :threshold")
    int deleteOldRecords(@Param("threshold") LocalDateTime threshold);
}
