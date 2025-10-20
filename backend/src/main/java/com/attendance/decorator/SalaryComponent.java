package com.attendance.decorator;

import java.math.BigDecimal;

/**
 * Decorator Pattern - Component Interface
 * Interface cơ bản cho việc tính lương
 */
public interface SalaryComponent {
    BigDecimal calculateTotal();
    String getDescription();
}

