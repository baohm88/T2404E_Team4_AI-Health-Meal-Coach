package com.t2404e.aihealthcoach.repository;

import com.t2404e.aihealthcoach.entity.DishLibrary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DishLibraryRepository extends JpaRepository<DishLibrary, Long> {
    List<DishLibrary> findByCategory(String category);

    List<DishLibrary> findByNameContainingIgnoreCase(String name);
}
