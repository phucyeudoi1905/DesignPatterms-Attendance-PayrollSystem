package com.attendance.decorator;

import com.attendance.config.ApplicationConfig;
import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Decorator Pattern - Concrete Decorator
 * Thêm lương tăng ca
 */
public class OvertimeDecorator extends SalaryDecorator {
    
    private final int overtimeHours;
    private final BigDecimal hourlyRate;
    private final double overtimeRate;
    
    public OvertimeDecorator(SalaryComponent salary, int overtimeHours, BigDecimal hourlyRate) {
        super(salary);
        this.overtimeHours = overtimeHours;
        this.hourlyRate = hourlyRate;
        this.overtimeRate = ApplicationConfig.getInstance().getOvertimeRate();
    }
    
    @Override
    public BigDecimal calculateTotal() {
        BigDecimal overtimePay = hourlyRate
                .multiply(BigDecimal.valueOf(overtimeHours))
                .multiply(BigDecimal.valueOf(overtimeRate))
                .setScale(0, RoundingMode.HALF_UP);
        return wrappedSalary.calculateTotal().add(overtimePay);
    }
    
    @Override
    public String getDescription() {
        return wrappedSalary.getDescription() + 
               " + Tăng ca (" + overtimeHours + "h × " + overtimeRate + " = " + 
               hourlyRate.multiply(BigDecimal.valueOf(overtimeHours * overtimeRate)).intValue() + " VNĐ)";
    }
}

