package com.attendance.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll")
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "employee_id")
    private Long employeeId;
    
    private BigDecimal salary;
    
    @Column(name = "calculation_type")
    private String calculationType;
    
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    
    // Constructors
    public Payroll() {}
    
    public Payroll(Long employeeId, BigDecimal salary, String calculationType, LocalDateTime createdDate) {
        this.employeeId = employeeId;
        this.salary = salary;
        this.calculationType = calculationType;
        this.createdDate = createdDate;
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
    
    public BigDecimal getSalary() {
        return salary;
    }
    
    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }
    
    public String getCalculationType() {
        return calculationType;
    }
    
    public void setCalculationType(String calculationType) {
        this.calculationType = calculationType;
    }
    
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }
    
    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}


