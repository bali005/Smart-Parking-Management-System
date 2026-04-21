package com.parking.system.dto;

import java.time.LocalDateTime;

public class BookingResponse {
    private Long id;
    private UserSummary user;
    private SlotSummary slot;
    private String vehicleNumber;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private Double amount;
    private String status;

    public BookingResponse(Long id, UserSummary user, SlotSummary slot, String vehicleNumber, LocalDateTime entryTime,
            LocalDateTime exitTime, Double amount, String status) {
        this.id = id;
        this.user = user;
        this.slot = slot;
        this.vehicleNumber = vehicleNumber;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.amount = amount;
        this.status = status;
    }

    public Long getId() { return id; }
    public UserSummary getUser() { return user; }
    public SlotSummary getSlot() { return slot; }
    public String getVehicleNumber() { return vehicleNumber; }
    public LocalDateTime getEntryTime() { return entryTime; }
    public LocalDateTime getExitTime() { return exitTime; }
    public Double getAmount() { return amount; }
    public String getStatus() { return status; }

    public record UserSummary(Long id, String name, String email) {
    }

    public record SlotSummary(Long id, String slotNumber, String type, String status) {
    }
}
