package com.parking.system.service;

import com.parking.system.dto.SlotRequest;
import com.parking.system.model.ParkingSlot;
import com.parking.system.model.SlotStatus;
import com.parking.system.repository.ParkingSlotRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SlotService {
    private final ParkingSlotRepository slotRepository;

    public SlotService(ParkingSlotRepository slotRepository) {
        this.slotRepository = slotRepository;
    }

    public List<ParkingSlot> getAllSlots() {
        return slotRepository.findAllByOrderBySlotNumberAsc();
    }

    public ParkingSlot createSlot(SlotRequest request) {
        if (slotRepository.existsBySlotNumber(request.getSlotNumber().trim().toUpperCase())) {
            throw new IllegalArgumentException("Slot number already exists");
        }

        ParkingSlot slot = new ParkingSlot(
                request.getSlotNumber().trim().toUpperCase(),
                request.getType(),
                SlotStatus.AVAILABLE);
        return slotRepository.save(slot);
    }

    public ParkingSlot updateSlot(Long id, SlotRequest request) {
        ParkingSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Slot not found"));
        slot.setSlotNumber(request.getSlotNumber().trim().toUpperCase());
        slot.setType(request.getType());
        return slotRepository.save(slot);
    }

    public void deleteSlot(Long id) {
        ParkingSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Slot not found"));
        if (slot.getStatus() == SlotStatus.OCCUPIED) {
            throw new IllegalStateException("Occupied slot cannot be deleted");
        }
        slotRepository.delete(slot);
    }
}
