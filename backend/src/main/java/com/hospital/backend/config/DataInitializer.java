package com.hospital.backend.config;

import com.hospital.backend.entity.*;
import com.hospital.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin
        if (!userRepository.existsByEmail("admin@hospital.com")) {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@hospital.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("9999999999")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Default admin created: admin@hospital.com / admin123");
        }

        // Create default departments
        String[][] departments = {
                {"Cardiology", "Heart and cardiovascular diseases"},
                {"Neurology", "Brain and nervous system disorders"},
                {"Orthopedics", "Bone and joint care"},
                {"Pediatrics", "Child healthcare"},
                {"Dermatology", "Skin, hair, and nail health"},
                {"General Medicine", "Primary care and general health"},
                {"ENT", "Ear, Nose, and Throat care"},
                {"Ophthalmology", "Eye care and vision health"}
        };

        for (String[] dept : departments) {
            if (!departmentRepository.existsByName(dept[0])) {
                departmentRepository.save(Department.builder()
                        .name(dept[0])
                        .description(dept[1])
                        .build());
            }
        }
        System.out.println("✅ Default departments initialized");
    }
}
