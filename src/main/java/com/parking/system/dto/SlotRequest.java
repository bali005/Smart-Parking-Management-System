package com.parking.system.dto;

import com.parking.system.model.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SlotRequest {
    @NotBlank
    private String slotNumber;
    @NotNull
    private VehicleType type;

    public String getSlotNumber() { return slotNumber; }
    public void setSlotNumber(String slotNumber) { this.slotNumber = slotNumber; }
    public VehicleType getType() { return type; }
    public void setType(VehicleType type) { this.type = type; }
}
