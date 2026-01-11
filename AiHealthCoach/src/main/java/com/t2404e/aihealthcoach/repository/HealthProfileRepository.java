package com.t2404e.aihealthcoach.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.t2404e.aihealthcoach.entity.HealthProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HealthProfileRepository extends JpaRepository<HealthProfile, Long> {
}
