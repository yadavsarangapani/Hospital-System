package com.hospital.backend.controller;

import com.hospital.backend.dto.DoctorDTO;
import com.hospital.backend.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@Tag(name = "Doctors", description = "Doctor management and search")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    @Operation(summary = "Get all doctors")
    public ResponseEntity<List<DoctorDTO>> getAll() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get doctor by ID")
    public ResponseEntity<DoctorDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search doctors by keyword")
    public ResponseEntity<List<DoctorDTO>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(doctorService.searchDoctors(keyword));
    }

    @GetMapping("/department/{departmentId}")
    @Operation(summary = "Get doctors by department")
    public ResponseEntity<List<DoctorDTO>> getByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(doctorService.getDoctorsByDepartment(departmentId));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get doctor by user ID")
    public ResponseEntity<DoctorDTO> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(doctorService.getDoctorByUserId(userId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add new doctor (Admin only)")
    public ResponseEntity<DoctorDTO> create(@Valid @RequestBody DoctorDTO dto) {
        return ResponseEntity.ok(doctorService.createDoctor(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Update doctor profile")
    public ResponseEntity<DoctorDTO> update(@PathVariable Long id, @Valid @RequestBody DoctorDTO dto) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remove doctor (Admin only)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}
