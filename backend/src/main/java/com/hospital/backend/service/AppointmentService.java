package com.hospital.backend.service;

import com.hospital.backend.dto.AppointmentDTO;
import com.hospital.backend.entity.*;
import com.hospital.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public AppointmentDTO bookAppointment(AppointmentDTO dto, Long patientId) {
        // Validate future date
        if (dto.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Appointment must be scheduled for a future date");
        }
        if (dto.getAppointmentDate().isEqual(LocalDate.now()) &&
            dto.getStartTime().isBefore(java.time.LocalTime.now())) {
            throw new RuntimeException("Appointment must be scheduled for a future time");
        }

        // Check doctor overlap
        if (appointmentRepository.existsDoctorOverlap(
                dto.getDoctorId(), dto.getAppointmentDate(), dto.getStartTime(), dto.getEndTime())) {
            throw new RuntimeException("Doctor already has an appointment at this time");
        }

        // Check patient overlap
        if (appointmentRepository.existsPatientOverlap(
                patientId, dto.getAppointmentDate(), dto.getStartTime(), dto.getEndTime())) {
            throw new RuntimeException("You already have an appointment at this time");
        }

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Appointment appointment = Appointment.builder()
                .doctor(doctor)
                .patient(patient)
                .appointmentDate(dto.getAppointmentDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .status(AppointmentStatus.PENDING)
                .notes(dto.getNotes())
                .build();

        return toDTO(appointmentRepository.save(appointment));
    }

    public List<AppointmentDTO> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(patientId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateDesc(doctorId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getDoctorPendingAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorIdAndStatus(doctorId, AppointmentStatus.PENDING).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getDoctorDailySchedule(Long doctorId, LocalDate date) {
        return appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date).stream()
                .filter(a -> a.getStatus() == AppointmentStatus.CONFIRMED || a.getStatus() == AppointmentStatus.PENDING)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentDTO confirmAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new RuntimeException("Only pending appointments can be confirmed");
        }
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        return toDTO(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentDTO rejectAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new RuntimeException("Only pending appointments can be rejected");
        }
        appointment.setStatus(AppointmentStatus.REJECTED);
        return toDTO(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentDTO completeAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new RuntimeException("Only confirmed appointments can be marked as completed");
        }
        appointment.setStatus(AppointmentStatus.COMPLETED);
        return toDTO(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentDTO cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Completed appointments cannot be cancelled");
        }
        appointment.setStatus(AppointmentStatus.CANCELLED);
        return toDTO(appointmentRepository.save(appointment));
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private AppointmentDTO toDTO(Appointment a) {
        return AppointmentDTO.builder()
                .id(a.getId())
                .doctorId(a.getDoctor().getId())
                .patientId(a.getPatient().getId())
                .doctorName(a.getDoctor().getUser().getName())
                .patientName(a.getPatient().getName())
                .specialization(a.getDoctor().getSpecialization())
                .departmentName(a.getDoctor().getDepartment().getName())
                .appointmentDate(a.getAppointmentDate())
                .startTime(a.getStartTime())
                .endTime(a.getEndTime())
                .status(a.getStatus().name())
                .notes(a.getNotes())
                .consultationFee(a.getDoctor().getConsultationFee())
                .createdAt(a.getCreatedAt() != null ? a.getCreatedAt().toString() : null)
                .build();
    }
}
