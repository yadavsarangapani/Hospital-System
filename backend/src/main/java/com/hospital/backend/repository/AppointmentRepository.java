package com.hospital.backend.repository;

import com.hospital.backend.entity.Appointment;
import com.hospital.backend.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientIdOrderByAppointmentDateDesc(Long patientId);

    List<Appointment> findByDoctorIdOrderByAppointmentDateDesc(Long doctorId);

    List<Appointment> findByDoctorIdAndStatus(Long doctorId, AppointmentStatus status);

    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);

    // Check for doctor appointment overlap
    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentDate = :date " +
           "AND a.status NOT IN ('REJECTED', 'CANCELLED') " +
           "AND a.startTime < :endTime AND a.endTime > :startTime")
    boolean existsDoctorOverlap(@Param("doctorId") Long doctorId,
                                @Param("date") LocalDate date,
                                @Param("startTime") LocalTime startTime,
                                @Param("endTime") LocalTime endTime);

    // Check for patient appointment overlap
    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.patient.id = :patientId " +
           "AND a.appointmentDate = :date " +
           "AND a.status NOT IN ('REJECTED', 'CANCELLED') " +
           "AND a.startTime < :endTime AND a.endTime > :startTime")
    boolean existsPatientOverlap(@Param("patientId") Long patientId,
                                 @Param("date") LocalDate date,
                                 @Param("startTime") LocalTime startTime,
                                 @Param("endTime") LocalTime endTime);

    // Report: Count appointments per doctor
    @Query("SELECT a.doctor.id, a.doctor.user.name, COUNT(a) FROM Appointment a " +
           "GROUP BY a.doctor.id, a.doctor.user.name")
    List<Object[]> countAppointmentsPerDoctor();

    // Report: Revenue per department
    @Query("SELECT a.doctor.department.name, SUM(a.doctor.consultationFee) FROM Appointment a " +
           "WHERE a.status = 'COMPLETED' GROUP BY a.doctor.department.name")
    List<Object[]> revenuePerDepartment();

    // Report: Daily stats
    @Query("SELECT a.appointmentDate, COUNT(a) FROM Appointment a " +
           "WHERE a.appointmentDate BETWEEN :startDate AND :endDate " +
           "GROUP BY a.appointmentDate ORDER BY a.appointmentDate")
    List<Object[]> dailyStats(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Report: Monthly stats
    @Query("SELECT FUNCTION('MONTH', a.appointmentDate), FUNCTION('YEAR', a.appointmentDate), COUNT(a) " +
           "FROM Appointment a GROUP BY FUNCTION('YEAR', a.appointmentDate), FUNCTION('MONTH', a.appointmentDate) " +
           "ORDER BY FUNCTION('YEAR', a.appointmentDate), FUNCTION('MONTH', a.appointmentDate)")
    List<Object[]> monthlyStats();

    // Total counts
    long countByStatus(AppointmentStatus status);
}
