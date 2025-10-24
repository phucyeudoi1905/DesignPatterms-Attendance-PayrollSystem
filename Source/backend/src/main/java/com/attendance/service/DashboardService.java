package com.attendance.service;

import com.attendance.config.ApplicationConfig;
import com.attendance.model.ContractType;
import com.attendance.model.DashboardStats;
import com.attendance.model.Employee;
import com.attendance.model.Payroll;
import com.attendance.repository.AttendanceRepository;
import com.attendance.repository.EmployeeRepository;
import com.attendance.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private PayrollRepository payrollRepository;
    
    public DashboardStats getDashboardStatistics() {
        DashboardStats stats = new DashboardStats();
        
        // Sử dụng Singleton pattern để lấy config
        ApplicationConfig config = ApplicationConfig.getInstance();
        
        // Tổng số nhân viên
        List<Employee> employees = employeeRepository.findAll();
        stats.setTotalEmployees(employees.size());
        
        // Đếm theo loại hợp đồng
        stats.setFixedContractCount((int) employees.stream()
                .filter(e -> e.getContractType() == ContractType.FIXED).count());
        stats.setHourlyContractCount((int) employees.stream()
                .filter(e -> e.getContractType() == ContractType.HOURLY).count());
        stats.setProductBasedContractCount((int) employees.stream()
                .filter(e -> e.getContractType() == ContractType.PRODUCT_BASED).count());
        stats.setKpiBasedContractCount((int) employees.stream()
                .filter(e -> e.getContractType() == ContractType.KPI_BASED).count());
        
        // Tổng số chấm công
        stats.setTotalAttendances((int) attendanceRepository.count());
        
        // Tổng số lương đã chi trả
        List<Payroll> payrolls = payrollRepository.findAll();
        stats.setTotalPayrolls(payrolls.size());
        
        BigDecimal totalSalary = payrolls.stream()
                .map(Payroll::getSalary)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalSalaryPaid(totalSalary);
        
        // Thông tin từ Singleton
        stats.setAppVersion((String) config.getSetting("app.version"));
        stats.setUptimeInSeconds(config.getUptimeInSeconds());
        
        System.out.println("📊 Dashboard statistics generated successfully");
        
        return stats;
    }
}

