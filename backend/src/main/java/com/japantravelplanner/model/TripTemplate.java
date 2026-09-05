package com.japantravelplanner.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "trip_template")
public class TripTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer durationDays;

    @Column(length = 2000)
    private String notes;

    @Column(name = "is_public", nullable = false)
    private boolean publicTemplate;

    @Column(length = 100, unique = true)
    private String publicKey;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TripTemplate() {
    }

    public TripTemplate(User owner, String name, Integer durationDays, String notes) {
        this.owner = owner;
        this.name = name;
        this.durationDays = durationDays;
        this.notes = notes;
        this.publicTemplate = false;
    }

    public Long getId() { return id; }
    public User getOwner() { return owner; }
    public String getName() { return name; }
    public Integer getDurationDays() { return durationDays; }
    public String getNotes() { return notes; }
    public boolean isPublicTemplate() { return publicTemplate; }
    public String getPublicKey() { return publicKey; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setName(String name) { this.name = name; }
    public void setNotes(String notes) { this.notes = notes; }

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
