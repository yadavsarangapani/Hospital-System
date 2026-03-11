package com.hospital.backend.repository;

import com.hospital.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.doctor.id = :doctorId")
    Double averageRatingByDoctorId(@Param("doctorId") Long doctorId);

    boolean existsByDoctorIdAndPatientId(Long doctorId, Long patientId);
}
