package com.japantravelplanner.dto;

import com.japantravelplanner.model.CostStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class ActivityResponse {

    private Long id;
    private String itemType;
    private String name;
    private LocalDate date;
    private Long cost;
    private CostStatus costStatus;
    private String notes;
    private String location;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ActivityResponse() {

    }

    public ActivityResponse(
            Long id,
            String itemType,
            String name,
            LocalDate date,
            Long cost,
            CostStatus costStatus,
            String notes,
            String location,
            LocalTime startTime,
            LocalTime endTime,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.itemType = itemType;
        this.name = name;
        this.date = date;
        this.cost = cost;
        this.costStatus = costStatus;
        this.notes = notes;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getItemType() {
        return itemType;
    }

    public String getName() {
        return name;
    }

    public LocalDate getDate() {
        return date;
    }

    public Long getCost() {
        return cost;
    }

    public CostStatus getCostStatus() {
        return costStatus;
    }

    public String getNotes() {
        return notes;
    }

    public String getLocation() {
        return location;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}