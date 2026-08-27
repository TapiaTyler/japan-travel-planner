package com.japantravelplanner.repository;

import com.japantravelplanner.model.TripItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripItemRepository extends JpaRepository<TripItem,Long> {

    List<TripItem> findByTrip_Id(Long tripId);
    List<TripItem> findByTrip_IdOrderByDateAsc(Long tripId);

    void deleteByTrip_Id(Long tripId);

}
