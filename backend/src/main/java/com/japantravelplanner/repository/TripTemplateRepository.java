package com.japantravelplanner.repository;

import com.japantravelplanner.model.TripTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TripTemplateRepository extends JpaRepository<TripTemplate, Long> {
    List<TripTemplate> findByPublicTemplateTrueOrderByNameAsc();
    List<TripTemplate> findByOwner_UsernameOrderByCreatedAtDesc(String username);
    Optional<TripTemplate> findByIdAndOwner_Username(Long id, String username);
}
