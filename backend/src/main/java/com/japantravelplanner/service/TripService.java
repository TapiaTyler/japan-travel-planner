package com.japantravelplanner.service;

import com.japantravelplanner.dto.TripRequest;
import com.japantravelplanner.dto.TripResponse;
import com.japantravelplanner.exception.ApiErrorCode;
import com.japantravelplanner.exception.ApiException;
import com.japantravelplanner.exception.TripNotFoundException;
import com.japantravelplanner.model.*;
import com.japantravelplanner.repository.TripItemRepository;
import com.japantravelplanner.repository.TripRepository;
import com.japantravelplanner.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

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
            throw new ApiException(ApiErrorCode.TRIP_DATES_INVALID);
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

        throw new ApiException(ApiErrorCode.ITEM_TYPE_UNSUPPORTED);
    }

    private List<String> getDestinations(List<TripItem> tripItems) {
        Set<String> destinations = new LinkedHashSet<>();

        for (TripItem item : tripItems) {
            if (item instanceof Activity activity) {
                addDestination(destinations, activity.getLocation());
            }

            if (item instanceof Lodging lodging) {
                addDestination(destinations, lodging.getLocation());
            }

            if (item instanceof Transportation transportation) {
                addDestination(
                        destinations,
                        transportation.getDepartureLocation()
                );

                addDestination(
                        destinations,
                        transportation.getArrivalLocation()
                );
            }
        }

        return new ArrayList<>(destinations);
    }

    private void addDestination(
            Set<String> destinations,
            String location
    ) {
        if (location != null && !location.isBlank()) {
            destinations.add(location.trim());
        }
    }

    private Long getTotalCost(List<TripItem> tripItems) {
        return tripItems.stream()
                .filter(item -> item.getCost() != null)
                .mapToLong(TripItem::getCost)
                .sum();
    }

    public TripResponse toTripResponse(Trip trip) {
        List<TripItem> tripItems =
                tripItemRepository.findByTrip_Id(trip.getId());

        List<String> destinations =
                getDestinations(tripItems);

        Long totalCost =
                getTotalCost(tripItems);

        return new TripResponse(
                trip.getId(),
                trip.getName(),
                trip.getStartDate(),
                trip.getEndDate(),
                trip.getNotes(),
                destinations,
                totalCost,
                trip.getCreatedAt(),
                trip.getUpdatedAt()
        );
    }

}
