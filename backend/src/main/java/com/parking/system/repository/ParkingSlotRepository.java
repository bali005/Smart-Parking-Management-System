package com.parking.system.repository;

import com.parking.system.model.ParkingSlot;
import com.parking.system.model.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
    boolean existsBySlotNumber(String slotNumber);
    List<ParkingSlot> findAllByOrderBySlotNumberAsc();
    long countByStatus(SlotStatus status);
}
