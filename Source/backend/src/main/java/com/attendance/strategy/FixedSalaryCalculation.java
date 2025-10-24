package com.attendance.strategy;

import com.attendance.model.Attendance;
import com.attendance.model.Employee;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class FixedSalaryCalculation implements SalaryCalculationStrategy {
    
    @Override
    public BigDecimal calculateSalary(Employee employee, List<Attendance> attendances) {
        // Fixed salary - không phụ thuộc vào giờ làm việc
        return employee.getSalaryBase() != null ? employee.getSalaryBase() : BigDecimal.ZERO;
    }
}


