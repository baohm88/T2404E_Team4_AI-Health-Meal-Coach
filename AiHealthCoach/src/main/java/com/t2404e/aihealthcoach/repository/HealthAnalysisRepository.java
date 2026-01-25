//package com.t2404e.aihealthcoach.repository;
//
//import com.t2404e.aihealthcoach.entity.HealthAnalysis;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.Optional;
//
//public interface HealthAnalysisRepository extends JpaRepository<HealthAnalysis, Long> {
//
//    Optional<HealthAnalysis> findByUserId(Long userId);
//
//    void deleteByUserId(Long userId);
//}


package com.t2404e.aihealthcoach.repository;
import com.t2404e.aihealthcoach.entity.User;
import com.t2404e.aihealthcoach.entity.HealthAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HealthAnalysisRepository extends JpaRepository<HealthAnalysis, Long> {

    Optional<HealthAnalysis> findByUserId(Long userId);
    Optional<HealthAnalysis> findTopByUserIdOrderByCreatedAtDesc(Long userId);
}
