package com.japantravelplanner.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class TripItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private String name;

    private LocalDate date;
    private Long cost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CostStatus costStatus = CostStatus.UNKNOWN;

    @Column(length = 2000)
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    //Constructors
    public TripItem() {

    }

    public TripItem(Trip trip, String name, LocalDate date, Long cost, CostStatus costStatus, String notes) {
        this.trip = trip;
        this.name = name;
        this.date = date;
        this.cost = cost;
        this.costStatus = costStatus != null ? costStatus : CostStatus.UNKNOWN;
        this.notes = notes;
    }

    //Getters and Setters
    public abstract String getItemType();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
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
        this.costStatus = costStatus != null ? costStatus : CostStatus.UNKNOWN;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;

        if (costStatus == null) {
            costStatus = CostStatus.UNKNOWN;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
