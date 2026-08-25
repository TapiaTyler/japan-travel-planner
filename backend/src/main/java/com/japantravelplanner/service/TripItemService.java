package com.japantravelplanner.service;

import com.japantravelplanner.dto.ActivityRequest;
import com.japantravelplanner.dto.LodgingRequest;
import com.japantravelplanner.dto.TransportationRequest;
import com.japantravelplanner.exception.TripNotFoundException;
import com.japantravelplanner.model.*;
import com.japantravelplanner.repository.TripItemRepository;
import com.japantravelplanner.repository.TripRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

@Service
public class TripItemService {

    private final TripItemRepository tripItemRepository;
    private final TripRepository tripRepository;

    public TripItemService(TripItemRepository tripItemRepository,  TripRepository tripRepository) {
        this.tripItemRepository = tripItemRepository;
        this.tripRepository = tripRepository;
    }

    public Activity createActivity(
            Long tripId,
            String username,
            ActivityRequest request) {

        Trip trip = tripRepository
                .findByIdAndUser_Username(tripId, username)
                .orElseThrow(TripNotFoundException::new);

        Activity activity = new Activity(
                trip,
                request.getName(),
                request.getDate(),
                request.getCost(),
                request.getCostStatus(),
                request.getNotes(),
                request.getLocation(),
                request.getStartTime(),
                request.getEndTime()
        );

        validateActivity(activity);

        return tripItemRepository.save(activity);
    }

    public Transportation createTransportation(
            Long tripId,
            String username,
            TransportationRequest request) {

        Trip trip = tripRepository
                .findByIdAndUser_Username(tripId, username)
                .orElseThrow(TripNotFoundException::new);

        Transportation transportation = new Transportation(
                trip,
                request.getName(),
                request.getDepartureDate(),
                request.getCost(),
                request.getCostStatus(),
                request.getNotes(),
                request.getTransportationType(),
                request.getDepartureLocation(),
                request.getArrivalLocation(),
                request.getDepartureDate(),
                request.getDepartureTime(),
                request.getArrivalDate(),
                request.getArrivalTime()
        );

        validateTransportation(transportation);

        return tripItemRepository.save(transportation);
    }

    public Lodging createLodging(
            Long tripId,
            String username,
            LodgingRequest request) {

        Trip trip = tripRepository
                .findByIdAndUser_Username(tripId, username)
                .orElseThrow(TripNotFoundException::new);

        Lodging lodging = new Lodging(
                trip,
                request.getName(),
                request.getCheckInDate(),
                request.getCost(),
                request.getCostStatus(),
                request.getNotes(),
                request.getLocation(),
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        validateLodging(lodging);

        return tripItemRepository.save(lodging);
    }

    public TripItem saveTripItem(Long tripId, String username, TripItem tripItem) {

        Trip trip = tripRepository
                .findByIdAndUser_Username(tripId, username)
                .orElseThrow(TripNotFoundException::new);

        tripItem.setTrip(trip);

        if (tripItem instanceof Activity activity) {
            validateActivity(activity);
        } else if (tripItem instanceof Transportation transportation) {
            validateTransportation(transportation);
        } else if (tripItem instanceof Lodging lodging) {
            validateLodging(lodging);
        }

        return tripItemRepository.save(tripItem);
    }

    public List<TripItem> getTripItems(Long tripId, String username) {

        tripRepository
                .findByIdAndUser_Username(tripId, username)
                .orElseThrow(TripNotFoundException::new);

        List<TripItem> tripItems =
                tripItemRepository.findByTrip_Id(tripId);

        tripItems.sort(
                Comparator
                        .comparing(
                                TripItem::getDate,
                                Comparator.nullsLast(Comparator.naturalOrder())
                        )
                        .thenComparing(
                                this::getSortTime,
                                Comparator.nullsLast(Comparator.naturalOrder())
                        )
                        .thenComparing(
                                TripItem::getName,
                                String.CASE_INSENSITIVE_ORDER
                        )
        );

        return tripItems;
    }

    private LocalTime getSortTime(TripItem tripItem) {

        if (tripItem instanceof Activity activity) {
            return activity.getStartTime();
        }

        if (tripItem instanceof Transportation transportation) {
            return transportation.getDepartureTime();
        }

        return null;
    }

    //Validation methods
    private void validateDateWithinTrip(LocalDate date, Trip trip) {

        if (date == null || trip == null) {
            return;
        }

        if (date.isBefore(trip.getStartDate()) || date.isAfter(trip.getEndDate())) {
            throw new IllegalArgumentException("The item date must fall within the trip dates.");
        }

    }

    public void validateActivity(Activity activity) {

        validateDateWithinTrip(activity.getDate(), activity.getTrip());

        validateCost(activity);

        if (activity.getStartTime() != null && activity.getEndTime() != null
                && activity.getEndTime().isBefore(activity.getStartTime())) {
            throw new IllegalArgumentException("Activity end time cannot be before the start time.");
        }

    }

    public void validateTransportation(Transportation transportation) {

        transportation.setDate(transportation.getDepartureDate());

        validateDateWithinTrip(
                transportation.getDepartureDate(),
                transportation.getTrip()
        );

        validateDateWithinTrip(
                transportation.getArrivalDate(),
                transportation.getTrip()
        );

        validateCost(transportation);

        LocalDate departureDate = transportation.getDepartureDate();
        LocalDate arrivalDate = transportation.getArrivalDate();

        if (transportation.getTransportationType() != TransportationType.FLIGHT
                && departureDate != null
                && arrivalDate != null
                && arrivalDate.isBefore(departureDate)) {

            throw new IllegalArgumentException(
                    "Transportation arrival date cannot be before the departure date."
            );
        }

        if (transportation.getTransportationType() != TransportationType.FLIGHT
                && departureDate != null
                && departureDate.equals(arrivalDate)
                && transportation.getDepartureTime() != null
                && transportation.getArrivalTime() != null
                && transportation.getArrivalTime()
                .isBefore(transportation.getDepartureTime())) {

            throw new IllegalArgumentException(
                    "Transportation arrival time cannot be before the departure time."
            );
        }
    }

    public void validateLodging(Lodging lodging) {

        lodging.setDate(lodging.getCheckInDate());

        validateDateWithinTrip(
                lodging.getCheckInDate(),
                lodging.getTrip()
        );

        validateDateWithinTrip(
                lodging.getCheckOutDate(),
                lodging.getTrip()
        );

        validateCost(lodging);

        LocalDate checkInDate = lodging.getCheckInDate();
        LocalDate checkOutDate = lodging.getCheckOutDate();

        if (checkInDate != null
                && checkOutDate != null
                && checkOutDate.isBefore(checkInDate)) {

            throw new IllegalArgumentException(
                    "Lodging check-out date cannot be before the check-in date."
            );
        }
    }

    private void validateCost(TripItem tripItem) {

        if (tripItem.getCost() != null && tripItem.getCost() < 0) {
            throw new IllegalArgumentException(
                    "Cost cannot be negative."
            );
        }

        if ((tripItem.getCostStatus() == CostStatus.CONFIRMED
                || tripItem.getCostStatus() == CostStatus.ESTIMATED)
                && tripItem.getCost() == null) {

            throw new IllegalArgumentException(
                    "A cost is required when the cost status is Confirmed or Estimated."
            );
        }
    }

}
