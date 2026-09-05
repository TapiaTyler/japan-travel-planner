package com.japantravelplanner.model;

import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
@Table(name = "trip_template_item")
public class TripTemplateItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "template_id", nullable = false)
    private TripTemplate template;

    @Column(nullable = false, length = 30)
    private String itemType;

    @Column(nullable = false, length = 100)
    private String name;

    private Integer dateOffset;
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
    private Integer departureDateOffset;
    private LocalTime departureTime;
    private Integer arrivalDateOffset;
    private LocalTime arrivalTime;

    private Integer checkInDateOffset;
    private Integer checkOutDateOffset;

    public TripTemplateItem() {
    }

    public Long getId() { return id; }
    public TripTemplate getTemplate() { return template; }
    public void setTemplate(TripTemplate template) { this.template = template; }
    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getDateOffset() { return dateOffset; }
    public void setDateOffset(Integer dateOffset) { this.dateOffset = dateOffset; }
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
    public Integer getDepartureDateOffset() { return departureDateOffset; }
    public void setDepartureDateOffset(Integer departureDateOffset) { this.departureDateOffset = departureDateOffset; }
    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }
    public Integer getArrivalDateOffset() { return arrivalDateOffset; }
    public void setArrivalDateOffset(Integer arrivalDateOffset) { this.arrivalDateOffset = arrivalDateOffset; }
    public LocalTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }
    public Integer getCheckInDateOffset() { return checkInDateOffset; }
    public void setCheckInDateOffset(Integer checkInDateOffset) { this.checkInDateOffset = checkInDateOffset; }
    public Integer getCheckOutDateOffset() { return checkOutDateOffset; }
    public void setCheckOutDateOffset(Integer checkOutDateOffset) { this.checkOutDateOffset = checkOutDateOffset; }
}
