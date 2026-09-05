package com.japantravelplanner.controller;

import com.japantravelplanner.dto.AddSavedItineraryItemRequest;
import com.japantravelplanner.dto.SavedItineraryItemResponse;
import com.japantravelplanner.service.SavedItineraryItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library-items")
public class SavedItineraryItemController {

    private final SavedItineraryItemService savedItemService;

    public SavedItineraryItemController(SavedItineraryItemService savedItemService) {
        this.savedItemService = savedItemService;
    }

    @GetMapping
    public ResponseEntity<List<SavedItineraryItemResponse>> getSavedItems(
            Authentication authentication) {
        return ResponseEntity.ok(savedItemService.getSavedItems(authentication.getName()));
    }

    @PostMapping("/from-trip/{tripId}/items/{itemId}")
    public ResponseEntity<SavedItineraryItemResponse> saveFromTrip(
            @PathVariable Long tripId,
            @PathVariable Long itemId,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                savedItemService.saveFromTrip(tripId, itemId, authentication.getName())
        );
    }

    @PostMapping("/{savedItemId}/add-to-trip/{tripId}")
    public ResponseEntity<Void> addToTrip(
            @PathVariable Long savedItemId,
            @PathVariable Long tripId,
            @Valid @RequestBody AddSavedItineraryItemRequest request,
            Authentication authentication) {
        savedItemService.addToTrip(
                savedItemId, tripId, request.getDate(), authentication.getName()
        );
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{savedItemId}")
    public ResponseEntity<Void> deleteSavedItem(
            @PathVariable Long savedItemId,
            Authentication authentication) {
        savedItemService.deleteSavedItem(savedItemId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
