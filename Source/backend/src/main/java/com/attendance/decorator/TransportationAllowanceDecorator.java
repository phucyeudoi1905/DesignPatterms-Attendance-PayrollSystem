package com.attendance.decorator;

import com.attendance.config.ApplicationConfig;
import java.math.BigDecimal;

/**
 * Decorator Pattern - Concrete Decorator
 * Thêm phụ cấp đi lại
 */
public class TransportationAllowanceDecorator extends SalaryDecorator {
    
    private final int allowanceAmount;
    
    public TransportationAllowanceDecorator(SalaryComponent salary) {
        super(salary);
        this.allowanceAmount = ApplicationConfig.getInstance().getTransportationAllowance();
    }
    
    @Override
    public BigDecimal calculateTotal() {
        return wrappedSalary.calculateTotal().add(BigDecimal.valueOf(allowanceAmount));
    }
    
    @Override
    public String getDescription() {
        return wrappedSalary.getDescription() + " + Phụ cấp đi lại (" + allowanceAmount + " VNĐ)";
    }
}

