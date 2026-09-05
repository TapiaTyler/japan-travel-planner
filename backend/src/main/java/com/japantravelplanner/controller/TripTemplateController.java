package com.japantravelplanner.controller;

import com.japantravelplanner.dto.*;
import com.japantravelplanner.model.Trip;
import com.japantravelplanner.service.TripService;
import com.japantravelplanner.service.TripTemplateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
public class TripTemplateController {

    private final TripTemplateService templateService;
    private final TripService tripService;

    public TripTemplateController(TripTemplateService templateService, TripService tripService) {
        this.templateService = templateService;
        this.tripService = tripService;
    }

    @GetMapping("/public")
    public ResponseEntity<List<TripTemplateResponse>> getPublicTemplates() {
        return ResponseEntity.ok(templateService.getPublicTemplates());
    }

    @GetMapping("/public/{templateId}")
    public ResponseEntity<TripTemplateResponse> getPublicTemplate(@PathVariable Long templateId) {
        return ResponseEntity.ok(templateService.getPublicTemplate(templateId));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<TripTemplateResponse>> getOwnedTemplates(Authentication authentication) {
        return ResponseEntity.ok(templateService.getOwnedTemplates(authentication.getName()));
    }

    @PostMapping("/from-trip/{tripId}")
    public ResponseEntity<TripTemplateResponse> createFromTrip(
            @PathVariable Long tripId,
            @Valid @RequestBody CreateTripTemplateRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                templateService.createFromTrip(tripId, authentication.getName(), request)
        );
    }

    @PostMapping("/{templateId}/instantiate")
    public ResponseEntity<TripResponse> instantiate(
            @PathVariable Long templateId,
            @Valid @RequestBody InstantiateTripTemplateRequest request,
            Authentication authentication) {
        Trip trip = templateService.instantiate(templateId, authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(tripService.toTripResponse(trip));
    }

    @DeleteMapping("/{templateId}")
    public ResponseEntity<Void> deleteTemplate(
            @PathVariable Long templateId,
            Authentication authentication) {
        templateService.deleteOwnedTemplate(templateId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
