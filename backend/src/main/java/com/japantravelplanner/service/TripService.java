package com.japantravelplanner.service;

import com.japantravelplanner.dto.TripRequest;
import com.japantravelplanner.exception.TripNotFoundException;
import com.japantravelplanner.model.*;
import com.japantravelplanner.repository.TripItemRepository;
import com.japantravelplanner.repository.TripRepository;
import com.japantravelplanner.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final TripItemRepository tripItemRepository;

    public TripService(TripRepository tripRepository, UserRepository userRepository, TripItemRepository tripItemRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.tripItemRepository = tripItemRepository;
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

    @Transactional
    public void deleteTrip(Long tripId, String username) {

        Trip trip = tripRepository
                .findByIdAndUser_Username(tripId, username)
                .orElseThrow(TripNotFoundException::new);

        tripItemRepository.deleteByTrip_Id(tripId);

        tripRepository.delete(trip);
    }

    @Transactional
    public Trip duplicateTrip(
            Long tripId,
            String username) {

        Trip originalTrip = tripRepository
                .findByIdAndUser_Username(tripId, username)
                .orElseThrow(TripNotFoundException::new);

        Trip duplicatedTrip = new Trip(
                originalTrip.getUser(),
                originalTrip.getName() + " - Copy",
                originalTrip.getStartDate(),
                originalTrip.getEndDate(),
                originalTrip.getNotes()
        );

        Trip savedTrip = tripRepository.save(duplicatedTrip);

        List<TripItem> originalItems =
                tripItemRepository.findByTrip_Id(tripId);

        for (TripItem originalItem : originalItems) {
            TripItem duplicatedItem =
                    duplicateTripItem(originalItem, savedTrip);

            tripItemRepository.save(duplicatedItem);
        }

        return savedTrip;
    }

    private TripItem duplicateTripItem(
            TripItem originalItem,
            Trip duplicatedTrip) {

        if (originalItem instanceof Activity activity) {
            return new Activity(
                    duplicatedTrip,
                    activity.getName(),
                    activity.getDate(),
                    activity.getCost(),
                    activity.getCostStatus(),
                    activity.getNotes(),
                    activity.getLocation(),
                    activity.getStartTime(),
                    activity.getEndTime()
            );
        }

        if (originalItem instanceof Transportation transportation) {
            return new Transportation(
                    duplicatedTrip,
                    transportation.getName(),
                    transportation.getDate(),
                    transportation.getCost(),
                    transportation.getCostStatus(),
                    transportation.getNotes(),
                    transportation.getTransportationType(),
                    transportation.getDepartureLocation(),
                    transportation.getArrivalLocation(),
                    transportation.getDepartureDate(),
                    transportation.getDepartureTime(),
                    transportation.getArrivalDate(),
                    transportation.getArrivalTime()
            );
        }

        if (originalItem instanceof Lodging lodging) {
            return new Lodging(
                    duplicatedTrip,
                    lodging.getName(),
                    lodging.getDate(),
                    lodging.getCost(),
                    lodging.getCostStatus(),
                    lodging.getNotes(),
                    lodging.getLocation(),
                    lodging.getCheckInDate(),
                    lodging.getCheckOutDate()
            );
        }

        throw new IllegalArgumentException(
                "Unsupported itinerary item type."
        );
    }

}
