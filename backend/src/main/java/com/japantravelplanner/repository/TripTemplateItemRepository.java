package com.japantravelplanner.repository;

import com.japantravelplanner.model.TripTemplateItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripTemplateItemRepository extends JpaRepository<TripTemplateItem, Long> {
    List<TripTemplateItem> findByTemplate_IdOrderByIdAsc(Long templateId);
}
