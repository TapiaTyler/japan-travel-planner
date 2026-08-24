package com.japantravelplanner.repository;

import com.japantravelplanner.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip,Long> {

    List<Trip> findByUser_Username(String username);
    Optional<Trip> findByIdAndUser_Username(Long tripId, String username);

}
