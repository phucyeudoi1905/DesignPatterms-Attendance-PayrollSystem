package com.attendance.service;

import com.attendance.model.Attendance;
import com.attendance.model.ContractType;
import com.attendance.model.Employee;
import com.attendance.model.Payroll;
import com.attendance.repository.AttendanceRepository;
import com.attendance.repository.EmployeeRepository;
import com.attendance.repository.PayrollRepository;
import com.attendance.strategy.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PayrollService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private PayrollRepository payrollRepository;
    
    @Autowired
    private FixedSalaryCalculation fixedSalaryCalculation;
    
    @Autowired
    private HourlySalaryCalculation hourlySalaryCalculation;
    
    @Autowired
    private ProductBasedSalaryCalculation productBasedSalaryCalculation;
    
    @Autowired
    private KpiBasedSalaryCalculation kpiBasedSalaryCalculation;
    
    private Map<ContractType, SalaryCalculationStrategy> strategies;
    
    @Autowired
    public void initStrategies() {
        strategies = new HashMap<>();
        strategies.put(ContractType.FIXED, fixedSalaryCalculation);
        strategies.put(ContractType.HOURLY, hourlySalaryCalculation);
        strategies.put(ContractType.PRODUCT_BASED, productBasedSalaryCalculation);
        strategies.put(ContractType.KPI_BASED, kpiBasedSalaryCalculation);
    }
    
    public Payroll calculateSalary(Long employeeId) {
        try {
            // Tìm nhân viên
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + employeeId));
            
            System.out.println("📊 Đang tính lương cho nhân viên: " + employee.getName() + " (ID: " + employeeId + ")");
            System.out.println("📋 Loại hợp đồng: " + employee.getContractType());
            
            // Lấy danh sách chấm công
            List<Attendance> attendances = attendanceRepository.findByEmployeeId(employeeId);
            System.out.println("⏰ Số bản ghi chấm công: " + attendances.size());
            
            // Kiểm tra xem strategies đã được khởi tạo chưa
            if (strategies == null || strategies.isEmpty()) {
                System.out.println("⚠️ Strategies chưa được khởi tạo, đang khởi tạo lại...");
                initStrategies();
            }
            
            // Chọn strategy dựa vào contractType
            SalaryCalculationStrategy strategy = strategies.get(employee.getContractType());
            if (strategy == null) {
                throw new RuntimeException("Không tìm thấy strategy cho loại hợp đồng: " + employee.getContractType());
            }
            
            // Tính lương
            BigDecimal calculatedSalary = strategy.calculateSalary(employee, attendances);
            System.out.println("💰 Lương được tính: " + calculatedSalary + " VNĐ");
            
            // Kiểm tra lương hợp lệ
            if (calculatedSalary == null || calculatedSalary.compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("Lương tính toán không hợp lệ: " + calculatedSalary);
            }
            
            // Lưu payroll vào database
            Payroll payroll = new Payroll();
            payroll.setEmployeeId(employeeId);
            payroll.setSalary(calculatedSalary);
            payroll.setCalculationType(employee.getContractType().name());
            payroll.setCreatedDate(LocalDateTime.now());
            
            Payroll savedPayroll = payrollRepository.save(payroll);
            System.out.println("✅ Đã lưu bản ghi lương với ID: " + savedPayroll.getId());
            
            return savedPayroll;
            
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi tính lương cho nhân viên ID " + employeeId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tính lương: " + e.getMessage(), e);
        }
    }
    
    public List<Payroll> getPayrollHistory(Long employeeId) {
        return payrollRepository.findByEmployeeId(employeeId);
    }
}


