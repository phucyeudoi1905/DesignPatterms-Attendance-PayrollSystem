package com.attendance.decorator;

import com.attendance.config.ApplicationConfig;
import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Decorator Pattern - Concrete Decorator
 * Thêm thưởng hiệu suất (% của lương cơ bản)
 */
public class PerformanceBonusDecorator extends SalaryDecorator {
    
    private final double bonusRate;
    
    public PerformanceBonusDecorator(SalaryComponent salary) {
        super(salary);
        this.bonusRate = ApplicationConfig.getInstance().getPerformanceBonusRate();
    }
    
    public PerformanceBonusDecorator(SalaryComponent salary, double customRate) {
        super(salary);
        this.bonusRate = customRate;
    }
    
    @Override
    public BigDecimal calculateTotal() {
        BigDecimal baseSalary = wrappedSalary.calculateTotal();
        BigDecimal bonus = baseSalary.multiply(BigDecimal.valueOf(bonusRate))
                                     .setScale(0, RoundingMode.HALF_UP);
        return baseSalary.add(bonus);
    }
    
    @Override
    public String getDescription() {
        int percentage = (int) (bonusRate * 100);
        return wrappedSalary.getDescription() + " + Thưởng hiệu suất (" + percentage + "%)";
    }
}

