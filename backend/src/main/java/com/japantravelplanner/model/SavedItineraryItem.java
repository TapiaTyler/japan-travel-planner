package com.japantravelplanner.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "saved_itinerary_item")
public class SavedItineraryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 30)
    private String itemType;

    @Column(nullable = false, length = 100)
    private String name;

    private Long cost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CostStatus costStatus = CostStatus.UNKNOWN;

    @Column(length = 2000)
    private String notes;

    @Column(length = 500)
    private String mapSearchQuery;

    private String location;
    private LocalTime startTime;
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    private TransportationType transportationType;

    private String departureLocation;
    private String arrivalLocation;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private Integer endDateOffset;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SavedItineraryItem() {
    }

    public Long getId() { return id; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getCost() { return cost; }
    public void setCost(Long cost) { this.cost = cost; }
    public CostStatus getCostStatus() { return costStatus; }
    public void setCostStatus(CostStatus costStatus) { this.costStatus = costStatus == null ? CostStatus.UNKNOWN : costStatus; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getMapSearchQuery() { return mapSearchQuery; }
    public void setMapSearchQuery(String mapSearchQuery) { this.mapSearchQuery = mapSearchQuery; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public TransportationType getTransportationType() { return transportationType; }
    public void setTransportationType(TransportationType transportationType) { this.transportationType = transportationType; }
    public String getDepartureLocation() { return departureLocation; }
    public void setDepartureLocation(String departureLocation) { this.departureLocation = departureLocation; }
    public String getArrivalLocation() { return arrivalLocation; }
    public void setArrivalLocation(String arrivalLocation) { this.arrivalLocation = arrivalLocation; }
    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }
    public LocalTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }
    public Integer getEndDateOffset() { return endDateOffset; }
    public void setEndDateOffset(Integer endDateOffset) { this.endDateOffset = endDateOffset; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
