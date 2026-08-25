package com.japantravelplanner.model;

import jakarta.persistence.Entity;

import java.time.LocalDate;

@Entity
public class Lodging extends TripItem {

    private String location;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    //Constructors
    public Lodging() {

    }

    public Lodging(Trip trip, String name, LocalDate date, Long cost, CostStatus costStatus, String notes,
            String location, LocalDate checkInDate, LocalDate checkOutDate) {
        super(trip, name, date, cost, costStatus, notes);
        this.location = location;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
    }

    //Getters and Setters
    @Override
    public String getItemType() {
        return "Lodging";
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }
}
