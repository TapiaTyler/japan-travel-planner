package com.japantravelplanner.controller;

import com.japantravelplanner.dto.TripRequest;
import com.japantravelplanner.dto.TripResponse;
import com.japantravelplanner.model.Trip;
import com.japantravelplanner.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TripResponse>> getTripsByUserId(
            @PathVariable Long userId) {

        List<TripResponse> trips = tripService.getTripsByUserId(userId)
                .stream()
                .map(this::toTripResponse)
                .toList();

        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<TripResponse> getTripById(@PathVariable Long tripId) {
        Trip trip = tripService.getTripById(tripId);

        return ResponseEntity.ok(toTripResponse(trip));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<TripResponse> createTrip(@PathVariable Long userId, @Valid @RequestBody TripRequest tripRequest) {
        Trip createdTrip = tripService.createTrip(userId, tripRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(toTripResponse(createdTrip));
    }

    @PutMapping("/{tripId}")
    public ResponseEntity<TripResponse> updateTrip(@PathVariable Long tripId, @Valid @RequestBody TripRequest tripRequest) {
        Trip updatedTrip = tripService.updateTrip(tripId, tripRequest);
        return ResponseEntity.ok(toTripResponse(updatedTrip));
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Trip> deleteTrip(@PathVariable Long tripId) {
        tripService.deleteTrip(tripId);
        return ResponseEntity.noContent().build();
    }

}
