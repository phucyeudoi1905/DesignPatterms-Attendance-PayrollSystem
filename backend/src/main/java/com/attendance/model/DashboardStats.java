package com.attendance.model;

import java.math.BigDecimal;

public class DashboardStats {
    private int totalEmployees;
    private int totalAttendances;
    private int totalPayrolls;
    private BigDecimal totalSalaryPaid;
    private int fixedContractCount;
    private int hourlyContractCount;
    private int productBasedContractCount;
    private int kpiBasedContractCount;
    private String appVersion;
    private long uptimeInSeconds;
    
    // Constructors
    public DashboardStats() {}
    
    // Getters and Setters
    public int getTotalEmployees() {
        return totalEmployees;
    }
    
    public void setTotalEmployees(int totalEmployees) {
        this.totalEmployees = totalEmployees;
    }
    
    public int getTotalAttendances() {
        return totalAttendances;
    }
    
    public void setTotalAttendances(int totalAttendances) {
        this.totalAttendances = totalAttendances;
    }
    
    public int getTotalPayrolls() {
        return totalPayrolls;
    }
    
    public void setTotalPayrolls(int totalPayrolls) {
        this.totalPayrolls = totalPayrolls;
    }
    
    public BigDecimal getTotalSalaryPaid() {
        return totalSalaryPaid;
    }
    
    public void setTotalSalaryPaid(BigDecimal totalSalaryPaid) {
        this.totalSalaryPaid = totalSalaryPaid;
    }
    
    public int getFixedContractCount() {
        return fixedContractCount;
    }
    
    public void setFixedContractCount(int fixedContractCount) {
        this.fixedContractCount = fixedContractCount;
    }
    
    public int getHourlyContractCount() {
        return hourlyContractCount;
    }
    
    public void setHourlyContractCount(int hourlyContractCount) {
        this.hourlyContractCount = hourlyContractCount;
    }
    
    public int getProductBasedContractCount() {
        return productBasedContractCount;
    }
    
    public void setProductBasedContractCount(int productBasedContractCount) {
        this.productBasedContractCount = productBasedContractCount;
    }
    
    public int getKpiBasedContractCount() {
        return kpiBasedContractCount;
    }
    
    public void setKpiBasedContractCount(int kpiBasedContractCount) {
        this.kpiBasedContractCount = kpiBasedContractCount;
    }
    
    public String getAppVersion() {
        return appVersion;
    }
    
    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion;
    }
    
    public long getUptimeInSeconds() {
        return uptimeInSeconds;
    }
    
    public void setUptimeInSeconds(long uptimeInSeconds) {
        this.uptimeInSeconds = uptimeInSeconds;
    }
}

