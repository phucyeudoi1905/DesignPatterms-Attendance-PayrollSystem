package com.attendance.strategy;

import com.attendance.model.Attendance;
import com.attendance.model.Employee;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class KpiBasedSalaryCalculation implements SalaryCalculationStrategy {
    
    @Override
    public BigDecimal calculateSalary(Employee employee, List<Attendance> attendances) {
        // Tính lương theo KPI: salaryBase + kpiBonus
        BigDecimal baseSalary = employee.getSalaryBase() != null ? employee.getSalaryBase() : BigDecimal.ZERO;
        BigDecimal kpiBonus = employee.getKpiBonus() != null ? employee.getKpiBonus() : BigDecimal.ZERO;
        
        return baseSalary.add(kpiBonus);
    }
}


