package com.hospital.backend.repository;

import com.hospital.backend.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);

    List<Doctor> findByDepartmentId(Long departmentId);

    Optional<Doctor> findByUserId(Long userId);

    @Query("SELECT d FROM Doctor d WHERE " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.user.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.department.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Doctor> searchDoctors(@Param("keyword") String keyword);
}
