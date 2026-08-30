package com.japantravelplanner.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class TripResponse {

    private Long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;
    private List<String> destinations;
    private Long totalCost;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TripResponse() {
    }

    public TripResponse(
            Long id,
            String name,
            LocalDate startDate,
            LocalDate endDate,
            String notes,
            List<String> destinations,
            Long totalCost,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.notes = notes;
        this.destinations = destinations;
        this.totalCost = totalCost;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getNotes() {
        return notes;
    }

    public List<String> getDestinations() {
        return destinations;
    }

    public Long getTotalCost() {
        return totalCost;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}