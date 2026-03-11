package com.hospital.backend.service;

import com.hospital.backend.entity.AppointmentStatus;
import com.hospital.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Map<String, Object>> appointmentsPerDoctor() {
        return appointmentRepository.countAppointmentsPerDoctor().stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("doctorId", row[0]);
                    map.put("doctorName", row[1]);
                    map.put("totalAppointments", row[2]);
                    return map;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> revenuePerDepartment() {
        return appointmentRepository.revenuePerDepartment().stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("department", row[0]);
                    map.put("revenue", row[1]);
                    return map;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> dailyStats(LocalDate startDate, LocalDate endDate) {
        return appointmentRepository.dailyStats(startDate, endDate).stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", row[0].toString());
                    map.put("count", row[1]);
                    return map;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> monthlyStats() {
        return appointmentRepository.monthlyStats().stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("month", row[0]);
                    map.put("year", row[1]);
                    map.put("count", row[2]);
                    return map;
                })
                .collect(Collectors.toList());
    }

    public Map<String, Object> systemOverview() {
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalDoctors", doctorRepository.count());
        overview.put("totalPatients", userRepository.findAll().stream()
                .filter(u -> u.getRole().name().equals("PATIENT")).count());
        overview.put("totalDepartments", departmentRepository.count());
        overview.put("totalAppointments", appointmentRepository.count());
        overview.put("pendingAppointments", appointmentRepository.countByStatus(AppointmentStatus.PENDING));
        overview.put("completedAppointments", appointmentRepository.countByStatus(AppointmentStatus.COMPLETED));
        overview.put("cancelledAppointments", appointmentRepository.countByStatus(AppointmentStatus.CANCELLED));
        return overview;
    }
}
