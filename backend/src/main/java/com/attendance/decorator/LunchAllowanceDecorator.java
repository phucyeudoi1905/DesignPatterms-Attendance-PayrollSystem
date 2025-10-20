package com.attendance.decorator;

import com.attendance.config.ApplicationConfig;
import java.math.BigDecimal;

/**
 * Decorator Pattern - Concrete Decorator
 * Thêm phụ cấp ăn trưa (tính theo số ngày làm việc)
 */
public class LunchAllowanceDecorator extends SalaryDecorator {
    
    private final int dailyAllowance;
    private final int workingDays;
    
    public LunchAllowanceDecorator(SalaryComponent salary, int workingDays) {
        super(salary);
        this.dailyAllowance = ApplicationConfig.getInstance().getLunchAllowance();
        this.workingDays = workingDays;
    }
    
    @Override
    public BigDecimal calculateTotal() {
        int totalLunchAllowance = dailyAllowance * workingDays;
        return wrappedSalary.calculateTotal().add(BigDecimal.valueOf(totalLunchAllowance));
    }
    
    @Override
    public String getDescription() {
        return wrappedSalary.getDescription() + 
               " + Phụ cấp ăn trưa (" + workingDays + " ngày × " + dailyAllowance + " = " + 
               (dailyAllowance * workingDays) + " VNĐ)";
    }
}

