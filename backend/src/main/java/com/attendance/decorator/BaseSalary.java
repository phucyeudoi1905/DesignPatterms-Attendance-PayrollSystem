package com.attendance.decorator;

import java.math.BigDecimal;

/**
 * Decorator Pattern - Concrete Component
 * Lương cơ bản (không có decorator)
 */
public class BaseSalary implements SalaryComponent {
    
    private final BigDecimal amount;
    private final String employeeName;
    
    public BaseSalary(BigDecimal amount, String employeeName) {
        this.amount = amount;
        this.employeeName = employeeName;
    }
    
    @Override
    public BigDecimal calculateTotal() {
        return amount;
    }
    
    @Override
    public String getDescription() {
        return "Lương cơ bản cho " + employeeName;
    }
}

