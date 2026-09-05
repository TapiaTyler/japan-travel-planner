package com.japantravelplanner.service;

import com.japantravelplanner.dto.SavedItineraryItemResponse;
import com.japantravelplanner.exception.ApiErrorCode;
import com.japantravelplanner.exception.ApiException;
import com.japantravelplanner.exception.TripNotFoundException;
import com.japantravelplanner.model.*;
import com.japantravelplanner.repository.SavedItineraryItemRepository;
import com.japantravelplanner.repository.TripItemRepository;
import com.japantravelplanner.repository.TripRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class SavedItineraryItemService {

    private final SavedItineraryItemRepository savedItemRepository;
    private final TripRepository tripRepository;
    private final TripItemRepository tripItemRepository;
    private final TripItemService tripItemService;

    public SavedItineraryItemService(
            SavedItineraryItemRepository savedItemRepository,
            TripRepository tripRepository,
            TripItemRepository tripItemRepository,
            TripItemService tripItemService) {
        this.savedItemRepository = savedItemRepository;
        this.tripRepository = tripRepository;
        this.tripItemRepository = tripItemRepository;
        this.tripItemService = tripItemService;
    }

    public List<SavedItineraryItemResponse> getSavedItems(String username) {
        return savedItemRepository.findByOwner_UsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public SavedItineraryItemResponse saveFromTrip(
            Long tripId,
            Long itemId,
            String username) {
        Trip trip = tripRepository.findByIdAndUser_Username(tripId, username)
                .orElseThrow(TripNotFoundException::new);
        TripItem item = tripItemRepository.findById(itemId)
                .filter(candidate -> candidate.getTrip().getId().equals(trip.getId()))
                .orElseThrow(() -> new ApiException(ApiErrorCode.ITEM_NOT_FOUND));

        SavedItineraryItem snapshot = new SavedItineraryItem();
        snapshot.setOwner(trip.getUser());
        snapshot.setItemType(item.getItemType());
        snapshot.setName(item.getName());
        snapshot.setCost(item.getCost());
        snapshot.setCostStatus(item.getCostStatus());
        snapshot.setNotes(item.getNotes());
        snapshot.setMapSearchQuery(item.getMapSearchQuery());

        if (item instanceof Activity activity) {
            snapshot.setLocation(activity.getLocation());
            snapshot.setStartTime(activity.getStartTime());
            snapshot.setEndTime(activity.getEndTime());
        } else if (item instanceof Transportation transportation) {
            snapshot.setTransportationType(transportation.getTransportationType());
            snapshot.setDepartureLocation(transportation.getDepartureLocation());
            snapshot.setArrivalLocation(transportation.getArrivalLocation());
            snapshot.setDepartureTime(transportation.getDepartureTime());
            snapshot.setArrivalTime(transportation.getArrivalTime());
            snapshot.setEndDateOffset(calculateEndOffset(
                    transportation.getDepartureDate(),
                    transportation.getArrivalDate()
            ));
        } else if (item instanceof Lodging lodging) {
            snapshot.setLocation(lodging.getLocation());
            snapshot.setEndDateOffset(calculateEndOffset(
                    lodging.getCheckInDate(),
                    lodging.getCheckOutDate()
            ));
        } else {
            throw new ApiException(ApiErrorCode.ITEM_TYPE_UNSUPPORTED);
        }

        return toResponse(savedItemRepository.save(snapshot));
    }

    @Transactional
    public void addToTrip(
            Long savedItemId,
            Long tripId,
            LocalDate anchorDate,
            String username) {
        SavedItineraryItem savedItem = getOwnedItem(savedItemId, username);
        TripItem tripItem = toTripItem(savedItem, anchorDate);
        tripItemService.saveTripItem(tripId, username, tripItem);
    }

    @Transactional
    public void deleteSavedItem(Long savedItemId, String username) {
        savedItemRepository.delete(getOwnedItem(savedItemId, username));
    }

    private SavedItineraryItem getOwnedItem(Long savedItemId, String username) {
        return savedItemRepository.findByIdAndOwner_Username(savedItemId, username)
                .orElseThrow(() -> new ApiException(ApiErrorCode.LIBRARY_ITEM_NOT_FOUND));
    }

    private TripItem toTripItem(SavedItineraryItem savedItem, LocalDate anchorDate) {
        TripItem tripItem;

        if ("Activity".equals(savedItem.getItemType())) {
            tripItem = new Activity(
                    null, savedItem.getName(), anchorDate, savedItem.getCost(),
                    savedItem.getCostStatus(), savedItem.getNotes(), savedItem.getLocation(),
                    savedItem.getStartTime(), savedItem.getEndTime()
            );
        } else if ("Transportation".equals(savedItem.getItemType())) {
            tripItem = new Transportation(
                    null, savedItem.getName(), anchorDate, savedItem.getCost(),
                    savedItem.getCostStatus(), savedItem.getNotes(),
                    savedItem.getTransportationType(), savedItem.getDepartureLocation(),
                    savedItem.getArrivalLocation(), anchorDate, savedItem.getDepartureTime(),
                    offsetDate(anchorDate, savedItem.getEndDateOffset()), savedItem.getArrivalTime()
            );
        } else if ("Lodging".equals(savedItem.getItemType())) {
            tripItem = new Lodging(
                    null, savedItem.getName(), anchorDate, savedItem.getCost(),
                    savedItem.getCostStatus(), savedItem.getNotes(), savedItem.getLocation(),
                    anchorDate, offsetDate(anchorDate, savedItem.getEndDateOffset())
            );
        } else {
            throw new ApiException(ApiErrorCode.ITEM_TYPE_UNSUPPORTED);
        }

        tripItem.setMapSearchQuery(savedItem.getMapSearchQuery());
        return tripItem;
    }

    private Integer calculateEndOffset(LocalDate startDate, LocalDate endDate) {
        if (endDate == null) return null;
        if (startDate == null) return 0;
        return Math.toIntExact(ChronoUnit.DAYS.between(startDate, endDate));
    }

    private LocalDate offsetDate(LocalDate date, Integer offset) {
        return offset == null ? null : date.plusDays(offset);
    }

    private SavedItineraryItemResponse toResponse(SavedItineraryItem item) {
        return new SavedItineraryItemResponse(
                item.getId(), item.getItemType(), item.getName(), item.getCost(),
                item.getCostStatus(), item.getNotes(), item.getMapSearchQuery(),
                item.getLocation(), item.getStartTime(), item.getEndTime(),
                item.getTransportationType(), item.getDepartureLocation(),
                item.getArrivalLocation(), item.getDepartureTime(), item.getArrivalTime(),
                item.getEndDateOffset(), item.getCreatedAt(), item.getUpdatedAt()
        );
    }
}
