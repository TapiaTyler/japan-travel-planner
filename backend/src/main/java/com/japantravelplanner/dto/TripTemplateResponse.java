package com.japantravelplanner.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TripTemplateResponse {
    private final Long id;
    private final String name;
    private final Integer durationDays;
    private final String notes;
    private final boolean publicTemplate;
    private final int itemCount;
    private final List<String> destinations;
    private final Long totalCost;
    private final List<TripTemplateItemResponse> items;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public TripTemplateResponse(
            Long id, String name, Integer durationDays, String notes,
            boolean publicTemplate, int itemCount, List<String> destinations,
            Long totalCost, List<TripTemplateItemResponse> items,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.durationDays = durationDays;
        this.notes = notes;
        this.publicTemplate = publicTemplate;
        this.itemCount = itemCount;
        this.destinations = destinations;
        this.totalCost = totalCost;
        this.items = items;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Integer getDurationDays() { return durationDays; }
    public String getNotes() { return notes; }
    public boolean isPublicTemplate() { return publicTemplate; }
    public int getItemCount() { return itemCount; }
    public List<String> getDestinations() { return destinations; }
    public Long getTotalCost() { return totalCost; }
    public List<TripTemplateItemResponse> getItems() { return items; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
