package com.japantravelplanner.controller;

import com.japantravelplanner.dto.*;
import com.japantravelplanner.model.*;
import com.japantravelplanner.service.TripItemService;
import com.japantravelplanner.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/items")
public class TripItemController {

    private final TripItemService tripItemService;
    private final TripService tripService;

    public TripItemController(TripItemService tripItemService, TripService tripService) {
        this.tripItemService = tripItemService;
        this.tripService = tripService;
    }

    private TripItemResponse toTripItemResponse(TripItem tripItem, Trip trip) {

        TripItemResponse response = new TripItemResponse();

        response.setId(tripItem.getId());
        response.setItemType(tripItem.getItemType());
        response.setName(tripItem.getName());
        response.setDate(tripItem.getDate());
        response.setCost(tripItem.getCost());
        response.setCostStatus(tripItem.getCostStatus());
        response.setNotes(tripItem.getNotes());
        response.setCreatedAt(tripItem.getCreatedAt());
        response.setUpdatedAt(tripItem.getUpdatedAt());

        if (tripItem instanceof Activity activity) {
            response.setLocation(activity.getLocation());
            response.setStartTime(activity.getStartTime());
            response.setEndTime(activity.getEndTime());
        }

        if (tripItem instanceof Transportation transportation) {
            response.setTransportationType(
                    transportation.getTransportationType() != null
                            ? transportation.getTransportationType().name()
                            : null
            );

            response.setDepartureLocation(transportation.getDepartureLocation());
            response.setArrivalLocation(transportation.getArrivalLocation());
            response.setDepartureDate(transportation.getDepartureDate());
            response.setDepartureTime(transportation.getDepartureTime());
            response.setArrivalDate(transportation.getArrivalDate());
            response.setArrivalTime(transportation.getArrivalTime());
        }

        if (tripItem instanceof Lodging lodging) {
            response.setLocation(lodging.getLocation());
            response.setCheckInDate(lodging.getCheckInDate());
            response.setCheckOutDate(lodging.getCheckOutDate());

            if (lodging.getCheckInDate() != null
                    && lodging.getCheckOutDate() != null) {

                response.setNumberOfNights(
                        ChronoUnit.DAYS.between(
                                lodging.getCheckInDate(),
                                lodging.getCheckOutDate()
                        )
                );
            }
        }

        if (tripItem.getDate() != null && trip.getStartDate() != null) {
            response.setDayNumber(
                    ChronoUnit.DAYS.between(
                            trip.getStartDate(),
                            tripItem.getDate()
                    ) + 1
            );
        }

        return response;
    }

    @GetMapping
    public ResponseEntity<List<TripItemResponse>> getTripItems(
            @PathVariable Long tripId,
            Authentication authentication) {

        String username = authentication.getName();

        Trip trip = tripService.getTripById(tripId, username);

        List<TripItemResponse> response =
                tripItemService
                        .getTripItems(tripId, username)
                        .stream()
                        .map(item -> toTripItemResponse(item, trip))
                        .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/activities")
    public ResponseEntity<ActivityResponse> createActivity(@PathVariable Long tripId,
            @Valid @RequestBody ActivityRequest request,
            Authentication authentication) {

        Activity activity = tripItemService.createActivity(
                tripId,
                authentication.getName(),
                request
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(toActivityResponse(activity));
    }

    private ActivityResponse toActivityResponse(Activity activity) {
        return new ActivityResponse(
                activity.getId(),
                activity.getItemType(),
                activity.getName(),
                activity.getDate(),
                activity.getCost(),
                activity.getCostStatus(),
                activity.getNotes(),
                activity.getLocation(),
                activity.getStartTime(),
                activity.getEndTime(),
                activity.getCreatedAt(),
                activity.getUpdatedAt()
        );
    }

    @PostMapping("/transportation")
    public ResponseEntity<TransportationResponse> createTransportation(
            @PathVariable Long tripId,
            @Valid @RequestBody TransportationRequest request,
            Authentication authentication) {

        Transportation transportation =
                tripItemService.createTransportation(
                        tripId,
                        authentication.getName(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toTransportationResponse(transportation));
    }

    private TransportationResponse toTransportationResponse(
            Transportation transportation) {

        return new TransportationResponse(
                transportation.getId(),
                transportation.getItemType(),
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
                transportation.getArrivalTime(),
                transportation.getCreatedAt(),
                transportation.getUpdatedAt()
        );
    }

    @PostMapping("/lodging")
    public ResponseEntity<LodgingResponse> createLodging(
            @PathVariable Long tripId,
            @Valid @RequestBody LodgingRequest request,
            Authentication authentication) {

        Lodging lodging = tripItemService.createLodging(
                tripId,
                authentication.getName(),
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toLodgingResponse(lodging));
    }

    private LodgingResponse toLodgingResponse(Lodging lodging) {

        Long numberOfNights = null;

        if (lodging.getCheckInDate() != null
                && lodging.getCheckOutDate() != null) {

            numberOfNights = ChronoUnit.DAYS.between(
                    lodging.getCheckInDate(),
                    lodging.getCheckOutDate()
            );
        }

        return new LodgingResponse(
                lodging.getId(),
                lodging.getItemType(),
                lodging.getName(),
                lodging.getDate(),
                lodging.getCost(),
                lodging.getCostStatus(),
                lodging.getNotes(),
                lodging.getLocation(),
                lodging.getCheckInDate(),
                lodging.getCheckOutDate(),
                numberOfNights,
                lodging.getCreatedAt(),
                lodging.getUpdatedAt()
        );
    }
}