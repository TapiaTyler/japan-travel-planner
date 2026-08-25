package com.japantravelplanner.model;

import jakarta.persistence.Entity;

import java.time.LocalTime;

@Entity
public class Activity extends TripItem {

    private String location;
    private LocalTime startTime;
    private LocalTime endTime;

    //Constructors
    public Activity() {

    }

    public Activity(Trip trip, String name, java.time.LocalDate date, Long cost, CostStatus costStatus, String notes,
                    String location, LocalTime startTime, LocalTime endTime) {
        super(trip, name, date, cost, costStatus, notes);
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    //Getters and Setters
    @Override
    public String getItemType() {
        return "Activity";
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
