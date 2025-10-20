package com.attendance.strategy;

import com.attendance.model.Attendance;
import com.attendance.model.Employee;

import java.math.BigDecimal;
import java.util.List;

public interface SalaryCalculationStrategy {
    BigDecimal calculateSalary(Employee employee, List<Attendance> attendances);
}


