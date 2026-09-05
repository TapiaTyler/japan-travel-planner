package com.japantravelplanner.repository;

import com.japantravelplanner.model.SavedItineraryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedItineraryItemRepository extends JpaRepository<SavedItineraryItem, Long> {
    List<SavedItineraryItem> findByOwner_UsernameOrderByCreatedAtDesc(String username);
    Optional<SavedItineraryItem> findByIdAndOwner_Username(Long id, String username);
}
