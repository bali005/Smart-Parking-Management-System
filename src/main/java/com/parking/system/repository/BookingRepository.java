package com.parking.system.repository;

import com.parking.system.model.Booking;
import com.parking.system.model.BookingStatus;
import com.parking.system.model.ParkingSlot;
import com.parking.system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserOrderByEntryTimeDesc(User user);
    List<Booking> findAllByOrderByEntryTimeDesc();
    boolean existsBySlotAndStatus(ParkingSlot slot, BookingStatus status);
}
