package com.attendance.decorator;

import java.math.BigDecimal;

/**
 * Decorator Pattern - Abstract Decorator
 * Base class cho tất cả các decorator
 */
public abstract class SalaryDecorator implements SalaryComponent {
    
    protected SalaryComponent wrappedSalary;
    
    public SalaryDecorator(SalaryComponent salary) {
        this.wrappedSalary = salary;
    }
    
    @Override
    public BigDecimal calculateTotal() {
        return wrappedSalary.calculateTotal();
    }
    
    @Override
    public String getDescription() {
        return wrappedSalary.getDescription();
    }
}

