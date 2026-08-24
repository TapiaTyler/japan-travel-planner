package com.japantravelplanner.controller;

import com.japantravelplanner.dto.TripRequest;
import com.japantravelplanner.dto.TripResponse;
import com.japantravelplanner.model.Trip;
import com.japantravelplanner.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    private TripResponse toTripResponse(Trip trip) {
        return new TripResponse(
                trip.getId(),
                trip.getName(),
                trip.getStartDate(),
                trip.getEndDate(),
                trip.getNotes(),
                trip.getCreatedAt(),
                trip.getUpdatedAt()
        );
    }

    @GetMapping
    public ResponseEntity<List<TripResponse>> getTrips(
            Authentication authentication) {

        List<TripResponse> trips = tripService
                .getTripsByUsername(authentication.getName())
                .stream()
                .map(this::toTripResponse)
                .toList();

        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<TripResponse> getTripById(
            @PathVariable Long tripId,
            Authentication authentication) {

        Trip trip = tripService.getTripById(
                tripId,
                authentication.getName()
        );

        return ResponseEntity.ok(toTripResponse(trip));
    }

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(
            @Valid @RequestBody TripRequest request,
            Authentication authentication) {

        Trip createdTrip = tripService.createTrip(
                authentication.getName(),
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toTripResponse(createdTrip));
    }

    @PutMapping("/{tripId}")
    public ResponseEntity<TripResponse> updateTrip(
            @PathVariable Long tripId,
            @Valid @RequestBody TripRequest request,
            Authentication authentication) {

        Trip updatedTrip = tripService.updateTrip(
                tripId,
                authentication.getName(),
                request
        );

        return ResponseEntity.ok(toTripResponse(updatedTrip));
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deleteTrip(
            @PathVariable Long tripId,
            Authentication authentication) {

        tripService.deleteTrip(
                tripId,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }

}
