package com.japantravelplanner.dto;

import com.japantravelplanner.model.CostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public class ActivityRequest {

    @NotBlank(message = "Activity name is required.")
    @Size(max = 100, message = "Activity name must be 100 characters or fewer.")
    private String name;

    private LocalDate date;
    private Long cost;
    private CostStatus costStatus;

    @Size(max = 2000, message = "Notes must be 2000 characters or fewer.")
    private String notes;

    private String location;
    private LocalTime startTime;
    private LocalTime endTime;

    public ActivityRequest() {

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getCost() {
        return cost;
    }

    public void setCost(Long cost) {
        this.cost = cost;
    }

    public CostStatus getCostStatus() {
        return costStatus;
    }

    public void setCostStatus(CostStatus costStatus) {
        this.costStatus = costStatus;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
}
