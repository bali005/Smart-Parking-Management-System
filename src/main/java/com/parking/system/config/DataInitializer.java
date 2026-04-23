package com.parking.system.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.parking.system.model.ParkingSlot;
import com.parking.system.model.Role;
import com.parking.system.model.SlotStatus;
import com.parking.system.model.User;
import com.parking.system.model.VehicleType;
import com.parking.system.repository.ParkingSlotRepository;
import com.parking.system.repository.UserRepository;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedData(ParkingSlotRepository parkingSlotRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed admin user
            if (userRepository.count() == 0) {
                User admin = new User(
                        "Admin User",
                        "admin@parking.com",
                        passwordEncoder.encode("admin123"),
                        Role.ADMIN);
                userRepository.save(admin);
            }

            // Seed parking slots
            if (parkingSlotRepository.count() == 0) {
                List<ParkingSlot> defaults = List.of(
                        new ParkingSlot("A1", VehicleType.CAR, SlotStatus.AVAILABLE),
                        new ParkingSlot("A2", VehicleType.CAR, SlotStatus.AVAILABLE),
                        new ParkingSlot("A3", VehicleType.CAR, SlotStatus.AVAILABLE),
                        new ParkingSlot("B1", VehicleType.BIKE, SlotStatus.AVAILABLE),
                        new ParkingSlot("B2", VehicleType.BIKE, SlotStatus.AVAILABLE),
                        new ParkingSlot("B3", VehicleType.BIKE, SlotStatus.AVAILABLE));

                parkingSlotRepository.saveAll(defaults);
            }
        };
    }
}
