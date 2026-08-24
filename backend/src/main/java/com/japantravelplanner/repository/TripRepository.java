package com.japantravelplanner.repository;

import com.japantravelplanner.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip,Long> {

    List<Trip> findByUser_Id(Long userId);

}
