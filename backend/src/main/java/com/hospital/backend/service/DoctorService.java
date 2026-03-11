package com.hospital.backend.service;

import com.hospital.backend.dto.DoctorDTO;
import com.hospital.backend.entity.*;
import com.hospital.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return toDTO(doctor);
    }

    public DoctorDTO getDoctorByUserId(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
        return toDTO(doctor);
    }

    public List<DoctorDTO> searchDoctors(String keyword) {
        return doctorRepository.searchDoctors(keyword).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<DoctorDTO> getDoctorsByDepartment(Long departmentId) {
        return doctorRepository.findByDepartmentId(departmentId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DoctorDTO createDoctor(DoctorDTO dto) {
        // Create user account for doctor
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode("doctor123")) // default password
                .phone(dto.getPhone())
                .role(Role.DOCTOR)
                .build();
        user = userRepository.save(user);

        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Doctor doctor = Doctor.builder()
                .user(user)
                .department(dept)
                .specialization(dto.getSpecialization())
                .qualification(dto.getQualification())
                .experienceYears(dto.getExperienceYears())
                .consultationFee(dto.getConsultationFee())
                .averageRating(0.0)
                .build();

        return toDTO(doctorRepository.save(doctor));
    }

    @Transactional
    public DoctorDTO updateDoctor(Long id, DoctorDTO dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            doctor.setDepartment(dept);
        }

        doctor.setSpecialization(dto.getSpecialization());
        doctor.setQualification(dto.getQualification());
        doctor.setExperienceYears(dto.getExperienceYears());
        doctor.setConsultationFee(dto.getConsultationFee());

        // Update user info
        User user = doctor.getUser();
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        return toDTO(doctorRepository.save(doctor));
    }

    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctorRepository.delete(doctor);
        userRepository.delete(doctor.getUser());
    }

    private DoctorDTO toDTO(Doctor doctor) {
        return DoctorDTO.builder()
                .id(doctor.getId())
                .userId(doctor.getUser().getId())
                .name(doctor.getUser().getName())
                .email(doctor.getUser().getEmail())
                .phone(doctor.getUser().getPhone())
                .departmentId(doctor.getDepartment().getId())
                .departmentName(doctor.getDepartment().getName())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .experienceYears(doctor.getExperienceYears())
                .consultationFee(doctor.getConsultationFee())
                .averageRating(doctor.getAverageRating())
                .build();
    }
}
