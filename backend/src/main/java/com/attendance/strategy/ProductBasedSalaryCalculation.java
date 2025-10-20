package com.attendance.strategy;

import com.attendance.model.Attendance;
import com.attendance.model.Employee;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class ProductBasedSalaryCalculation implements SalaryCalculationStrategy {
    
    @Override
    public BigDecimal calculateSalary(Employee employee, List<Attendance> attendances) {
        // Tính lương theo sản phẩm: productRate * số sản phẩm (workingHours ở đây được dùng để đếm sản phẩm)
        int totalProducts = attendances.stream()
                .mapToInt(a -> a.getWorkingHours() != null ? a.getWorkingHours() : 0)
                .sum();
        
        BigDecimal productRate = employee.getProductRate() != null ? employee.getProductRate() : BigDecimal.ZERO;
        return productRate.multiply(BigDecimal.valueOf(totalProducts));
    }
}


