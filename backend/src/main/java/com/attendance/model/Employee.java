package com.attendance.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Tên nhân viên không được để trống")
    @Size(min = 2, max = 100, message = "Tên phải có từ 2 đến 100 ký tự")
    @Column(nullable = false)
    private String name;
    
    @NotBlank(message = "Vị trí không được để trống")
    @Size(min = 2, max = 100, message = "Vị trí phải có từ 2 đến 100 ký tự")
    @Column(nullable = false)
    private String position;
    
    @NotNull(message = "Loại hợp đồng không được để trống")
    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", nullable = false)
    private ContractType contractType;
    
    @Column(name = "salary_base")
    private BigDecimal salaryBase;
    
    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate;
    
    @Column(name = "product_rate")
    private BigDecimal productRate;
    
    @Column(name = "kpi_bonus")
    private BigDecimal kpiBonus;
    
    // Constructors
    public Employee() {}
    
    public Employee(String name, String position, ContractType contractType) {
        this.name = name;
        this.position = position;
        this.contractType = contractType;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getPosition() {
        return position;
    }
    
    public void setPosition(String position) {
        this.position = position;
    }
    
    public ContractType getContractType() {
        return contractType;
    }
    
    public void setContractType(ContractType contractType) {
        this.contractType = contractType;
    }
    
    public BigDecimal getSalaryBase() {
        return salaryBase;
    }
    
    public void setSalaryBase(BigDecimal salaryBase) {
        this.salaryBase = salaryBase;
    }
    
    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }
    
    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }
    
    public BigDecimal getProductRate() {
        return productRate;
    }
    
    public void setProductRate(BigDecimal productRate) {
        this.productRate = productRate;
    }
    
    public BigDecimal getKpiBonus() {
        return kpiBonus;
    }
    
    public void setKpiBonus(BigDecimal kpiBonus) {
        this.kpiBonus = kpiBonus;
    }
}


