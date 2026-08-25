package com.japantravelplanner.controller;

import com.japantravelplanner.dto.*;
import com.japantravelplanner.model.Activity;
import com.japantravelplanner.model.Lodging;
import com.japantravelplanner.model.Transportation;
import com.japantravelplanner.service.TripItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/api/trips/{tripId}/items")
public class TripItemController {

    private final TripItemService tripItemService;

    public TripItemController(TripItemService tripItemService) {
        this.tripItemService = tripItemService;
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