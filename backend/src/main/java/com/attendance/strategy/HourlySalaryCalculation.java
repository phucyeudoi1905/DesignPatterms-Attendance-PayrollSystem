package com.attendance.strategy;

import com.attendance.model.Attendance;
import com.attendance.model.Employee;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class HourlySalaryCalculation implements SalaryCalculationStrategy {
    
    @Override
    public BigDecimal calculateSalary(Employee employee, List<Attendance> attendances) {
        // Tính lương theo giờ: hourlyRate * tổng giờ làm việc
        int totalHours = attendances.stream()
                .mapToInt(a -> a.getWorkingHours() != null ? a.getWorkingHours() : 0)
                .sum();
        
        BigDecimal hourlyRate = employee.getHourlyRate() != null ? employee.getHourlyRate() : BigDecimal.ZERO;
        return hourlyRate.multiply(BigDecimal.valueOf(totalHours));
    }
}


