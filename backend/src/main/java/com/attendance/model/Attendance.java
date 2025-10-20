package com.attendance.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "employee_id")
    private Long employeeId;
    
    @Column(name = "check_in")
    private LocalDateTime checkIn;
    
    @Column(name = "check_out")
    private LocalDateTime checkOut;
    
    @Column(name = "working_hours")
    private Integer workingHours;
    
    // Constructors
    public Attendance() {}
    
    public Attendance(Long employeeId, LocalDateTime checkIn, LocalDateTime checkOut, Integer workingHours) {
        this.employeeId = employeeId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.workingHours = workingHours;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getEmployeeId() {
        return employeeId;
    }
    
    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }
    
    public LocalDateTime getCheckIn() {
        return checkIn;
    }
    
    public void setCheckIn(LocalDateTime checkIn) {
        this.checkIn = checkIn;
    }
    
    public LocalDateTime getCheckOut() {
        return checkOut;
    }
    
    public void setCheckOut(LocalDateTime checkOut) {
        this.checkOut = checkOut;
    }
    
    public Integer getWorkingHours() {
        return workingHours;
    }
    
    public void setWorkingHours(Integer workingHours) {
        this.workingHours = workingHours;
    }
}


