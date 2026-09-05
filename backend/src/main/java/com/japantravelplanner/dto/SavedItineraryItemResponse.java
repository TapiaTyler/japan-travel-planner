package com.japantravelplanner.dto;

import com.japantravelplanner.model.CostStatus;
import com.japantravelplanner.model.TransportationType;

import java.time.LocalDateTime;
import java.time.LocalTime;

public record SavedItineraryItemResponse(
        Long id,
        String itemType,
        String name,
        Long cost,
        CostStatus costStatus,
        String notes,
        String mapSearchQuery,
        String location,
        LocalTime startTime,
        LocalTime endTime,
        TransportationType transportationType,
        String departureLocation,
        String arrivalLocation,
        LocalTime departureTime,
        LocalTime arrivalTime,
        Integer endDateOffset,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
