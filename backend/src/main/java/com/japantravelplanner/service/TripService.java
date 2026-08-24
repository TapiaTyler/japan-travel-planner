package com.japantravelplanner.service;

import com.japantravelplanner.dto.TripRequest;
import com.japantravelplanner.exception.TripNotFoundException;
import com.japantravelplanner.model.Trip;
import com.japantravelplanner.model.User;
import com.japantravelplanner.repository.TripRepository;
import com.japantravelplanner.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public TripService(TripRepository tripRepository, UserRepository userRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    public List<Trip> getTripsByUsername(String username) {
        return tripRepository.findByUser_Username(username);
    }

    public Trip getTripById(Long tripId, String username) {
        return tripRepository.findByIdAndUser_Username(tripId, username).orElseThrow(() -> new TripNotFoundException());
    }

    public Trip createTrip(String username, TripRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User account could not be found.")
                );

        Trip trip = new Trip(
                user,
                request.getName(),
                request.getStartDate(),
                request.getEndDate(),
                request.getNotes()
        );

        validateTripDates(trip);

        return tripRepository.save(trip);
    }

    public Trip updateTrip(Long tripId, String username, TripRequest request) {

        Trip existingTrip = tripRepository
                .findByIdAndUser_Username(tripId, username)
                .orElseThrow(TripNotFoundException::new);

        existingTrip.setName(request.getName());
        existingTrip.setStartDate(request.getStartDate());
        existingTrip.setEndDate(request.getEndDate());
        existingTrip.setNotes(request.getNotes());

        validateTripDates(existingTrip);

        return tripRepository.save(existingTrip);
    }

    private void validateTripDates(Trip trip) {
        if (trip.getStartDate() != null
                && trip.getEndDate() != null
                && trip.getEndDate().isBefore(trip.getStartDate())) {
            throw new IllegalArgumentException("Start date cannot be after end date.");
        }
    }

    public void deleteTrip(Long tripId, String username) {
        Trip existingTrip = tripRepository
                .findByIdAndUser_Username(tripId, username)
                .orElseThrow(TripNotFoundException::new);

        tripRepository.delete(existingTrip);
    }

}
