# Backend - AttendancePayrollSystem

## Spring Boot Application

### Cấu trúc thư mục
```
src/main/java/com/attendance/
├── AttendancePayrollSystemApplication.java  # Main Application
├── model/                                    # JPA Entities
│   ├── Employee.java
│   ├── ContractType.java
│   ├── Attendance.java
│   └── Payroll.java
├── repository/                               # Spring Data Repositories
│   ├── EmployeeRepository.java
│   ├── AttendanceRepository.java
│   └── PayrollRepository.java
├── service/                                  # Business Logic
│   ├── EmployeeService.java
│   ├── AttendanceService.java
│   └── PayrollService.java
├── strategy/                                 # Strategy Pattern
│   ├── SalaryCalculationStrategy.java       # Interface
│   ├── FixedSalaryCalculation.java
│   ├── HourlySalaryCalculation.java
│   ├── ProductBasedSalaryCalculation.java
│   └── KpiBasedSalaryCalculation.java
└── controller/                               # REST Controllers
    ├── EmployeeController.java
    ├── AttendanceController.java
    └── PayrollController.java
```

### Chạy ứng dụng

```bash
# Build project
mvn clean install

# Run application
mvn spring-boot:run

# Access H2 Console
# URL: http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:attendancedb
# Username: sa
# Password: (empty)
```

### API Documentation

**Base URL**: `http://localhost:8080/api`

#### Employee Endpoints
- `GET /employees` - Get all employees
- `GET /employees/{id}` - Get employee by ID
- `POST /employees` - Create new employee

#### Attendance Endpoints
- `GET /attendance` - Get all attendance records
- `GET /attendance/{employeeId}` - Get attendance by employee
- `POST /attendance` - Create attendance record

#### Payroll Endpoints
- `POST /payroll/calculate/{employeeId}` - Calculate salary
- `GET /payroll/{employeeId}` - Get payroll history

### Strategy Pattern Implementation

The system uses Strategy Pattern for salary calculation:

```java
public interface SalaryCalculationStrategy {
    BigDecimal calculateSalary(Employee employee, List<Attendance> attendances);
}
```

4 concrete strategies:
1. **FixedSalaryCalculation** - Returns fixed salary
2. **HourlySalaryCalculation** - Calculates by hours worked
3. **ProductBasedSalaryCalculation** - Calculates by products made
4. **KpiBasedSalaryCalculation** - Base salary + KPI bonus

Context (PayrollService) selects strategy based on employee's contract type.


