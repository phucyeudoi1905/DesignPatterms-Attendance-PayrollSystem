# 🎨 Design Patterns Implementation Guide

## Tổng quan

Hệ thống **Attendance Payroll System** áp dụng **3 Design Patterns** chính:

1. **Strategy Pattern** - Tính lương linh hoạt
2. **Singleton Pattern** - Quản lý cấu hình
3. **Decorator Pattern** - Thêm phụ cấp và thưởng

---

## 1️⃣ Strategy Pattern (Đã có từ đầu)

### 📖 Định nghĩa
Strategy Pattern cho phép định nghĩa một họ các thuật toán, đóng gói từng thuật toán và làm cho chúng có thể hoán đổi cho nhau.

### 🎯 Mục đích sử dụng
Tính lương linh hoạt cho 4 loại hợp đồng khác nhau mà không cần sửa code core.

### 🏗️ Cấu trúc

```
SalaryCalculationStrategy (Interface)
├── FixedSalaryCalculation
├── HourlySalaryCalculation
├── ProductBasedSalaryCalculation
└── KpiBasedSalaryCalculation
```

### 💻 Code Implementation

**Interface:**
```java
// backend/src/main/java/com/attendance/strategy/SalaryCalculationStrategy.java
public interface SalaryCalculationStrategy {
    BigDecimal calculateSalary(Employee employee, List<Attendance> attendances);
}
```

**Concrete Strategies:**
```java
// FIXED Strategy
public class FixedSalaryCalculation implements SalaryCalculationStrategy {
    @Override
    public BigDecimal calculateSalary(Employee employee, List<Attendance> attendances) {
        return employee.getSalaryBase();
    }
}

// HOURLY Strategy
public class HourlySalaryCalculation implements SalaryCalculationStrategy {
    @Override
    public BigDecimal calculateSalary(Employee employee, List<Attendance> attendances) {
        int totalHours = attendances.stream()
                .mapToInt(a -> a.getWorkingHours())
                .sum();
        return employee.getHourlyRate().multiply(BigDecimal.valueOf(totalHours));
    }
}
```

**Context (Usage):**
```java
// backend/src/main/java/com/attendance/service/PayrollService.java
public Payroll calculateSalary(Long employeeId) {
    Employee employee = employeeRepository.findById(employeeId).orElseThrow(...);
    List<Attendance> attendances = attendanceRepository.findByEmployeeId(employeeId);
    
    // Chọn strategy dựa vào contractType
    SalaryCalculationStrategy strategy = strategies.get(employee.getContractType());
    BigDecimal calculatedSalary = strategy.calculateSalary(employee, attendances);
    
    // Lưu kết quả
    return payrollRepository.save(payroll);
}
```

### ✅ Ưu điểm
- ✅ Dễ thêm loại hợp đồng mới
- ✅ Tuân thủ Open/Closed Principle
- ✅ Code dễ test và maintain
- ✅ Tách biệt logic tính lương

### 📊 Use Case
```
Nhân viên A (FIXED) → FixedSalaryCalculation → 15,000,000 VNĐ
Nhân viên B (HOURLY) → HourlySalaryCalculation → 50,000 × 40h = 2,000,000 VNĐ
Nhân viên C (PRODUCT) → ProductBasedSalaryCalculation → 20,000 × 50 = 1,000,000 VNĐ
Nhân viên D (KPI) → KpiBasedSalaryCalculation → 10,000,000 + 5,000,000 = 15,000,000 VNĐ
```

---

## 2️⃣ Singleton Pattern (MỚI)

### 📖 Định nghĩa
Singleton Pattern đảm bảo một class chỉ có duy nhất một instance và cung cấp một điểm truy cập toàn cục đến instance đó.

### 🎯 Mục đích sử dụng
Quản lý cấu hình toàn cục của ứng dụng (phụ cấp, hệ số thưởng, etc.) với một instance duy nhất.

### 🏗️ Cấu trúc

```
ApplicationConfig (Singleton)
- instance: ApplicationConfig (static)
- settings: Map<String, Object>
- startupTime: LocalDateTime
- requestCount: int
+ getInstance(): ApplicationConfig
+ getSetting(key): Object
+ setSetting(key, value): void
```

### 💻 Code Implementation

```java
// backend/src/main/java/com/attendance/config/ApplicationConfig.java
@Component
public class ApplicationConfig {
    
    // Singleton instance (private static)
    private static ApplicationConfig instance;
    
    // Application settings
    private final Map<String, Object> settings;
    private final LocalDateTime startupTime;
    private int requestCount;
    
    // Private constructor - QUAN TRỌNG!
    private ApplicationConfig() {
        this.settings = new HashMap<>();
        this.startupTime = LocalDateTime.now();
        this.requestCount = 0;
        initializeDefaultSettings();
    }
    
    // Public method to get instance (Thread-safe)
    public static synchronized ApplicationConfig getInstance() {
        if (instance == null) {
            instance = new ApplicationConfig();
        }
        return instance;
    }
    
    private void initializeDefaultSettings() {
        settings.put("overtime.rate", 1.5);
        settings.put("bonus.performance", 0.1);
        settings.put("allowance.transportation", 500000);
        settings.put("allowance.lunch", 30000);
    }
    
    // Các phương thức khác...
}
```

**Usage:**
```java
// Bất cứ đâu trong code
ApplicationConfig config = ApplicationConfig.getInstance();
int transportAllowance = config.getTransportationAllowance();
```

### ✅ Ưu điểm
- ✅ Chỉ có 1 instance duy nhất
- ✅ Truy cập toàn cục
- ✅ Lazy initialization
- ✅ Thread-safe (synchronized)

### ⚠️ Lưu ý
- Constructor phải **private**
- Phương thức getInstance() phải **synchronized** (thread-safe)
- Không thể tạo instance mới từ bên ngoài

### 📊 Use Case
```java
// Dashboard Service
ApplicationConfig config = ApplicationConfig.getInstance();
long uptime = config.getUptimeInSeconds();

// Decorator
int lunchAllowance = ApplicationConfig.getInstance().getLunchAllowance();

// Controller
ApplicationConfig.getInstance().incrementRequestCount();
```

---

## 3️⃣ Decorator Pattern (MỚI)

### 📖 Định nghĩa
Decorator Pattern cho phép gắn thêm hành vi (behavior) vào một object một cách động, cung cấp một cách linh hoạt để mở rộng chức năng.

### 🎯 Mục đích sử dụng
Thêm các khoản phụ cấp, thưởng vào lương cơ bản một cách linh hoạt mà không làm thay đổi code gốc.

### 🏗️ Cấu trúc

```
SalaryComponent (Interface)
├── BaseSalary (Concrete Component)
└── SalaryDecorator (Abstract Decorator)
    ├── TransportationAllowanceDecorator
    ├── LunchAllowanceDecorator
    ├── PerformanceBonusDecorator
    └── OvertimeDecorator
```

### 💻 Code Implementation

**Component Interface:**
```java
// backend/src/main/java/com/attendance/decorator/SalaryComponent.java
public interface SalaryComponent {
    BigDecimal calculateTotal();
    String getDescription();
}
```

**Concrete Component:**
```java
// backend/src/main/java/com/attendance/decorator/BaseSalary.java
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
```

**Abstract Decorator:**
```java
// backend/src/main/java/com/attendance/decorator/SalaryDecorator.java
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
```

**Concrete Decorators:**
```java
// Phụ cấp đi lại
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
        return wrappedSalary.getDescription() + " + Phụ cấp đi lại (" + allowanceAmount + ")";
    }
}

// Phụ cấp ăn trưa (theo ngày)
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
        int total = dailyAllowance * workingDays;
        return wrappedSalary.calculateTotal().add(BigDecimal.valueOf(total));
    }
}

// Thưởng hiệu suất (%)
public class PerformanceBonusDecorator extends SalaryDecorator {
    private final double bonusRate;
    
    public PerformanceBonusDecorator(SalaryComponent salary) {
        super(salary);
        this.bonusRate = ApplicationConfig.getInstance().getPerformanceBonusRate();
    }
    
    @Override
    public BigDecimal calculateTotal() {
        BigDecimal base = wrappedSalary.calculateTotal();
        BigDecimal bonus = base.multiply(BigDecimal.valueOf(bonusRate));
        return base.add(bonus);
    }
}

// Lương tăng ca
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
        BigDecimal overtime = hourlyRate
                .multiply(BigDecimal.valueOf(overtimeHours))
                .multiply(BigDecimal.valueOf(overtimeRate));
        return wrappedSalary.calculateTotal().add(overtime);
    }
}
```

### 🎬 Usage Example

```java
// Lương cơ bản
SalaryComponent salary = new BaseSalary(BigDecimal.valueOf(15000000), "Nguyễn Văn An");
System.out.println(salary.getDescription()); // "Lương cơ bản cho Nguyễn Văn An"
System.out.println(salary.calculateTotal()); // 15,000,000

// Thêm phụ cấp đi lại
salary = new TransportationAllowanceDecorator(salary);
System.out.println(salary.calculateTotal()); // 15,500,000

// Thêm phụ cấp ăn trưa (22 ngày)
salary = new LunchAllowanceDecorator(salary, 22);
System.out.println(salary.calculateTotal()); // 16,160,000

// Thêm thưởng hiệu suất 10%
salary = new PerformanceBonusDecorator(salary);
System.out.println(salary.calculateTotal()); // 17,776,000

System.out.println(salary.getDescription());
// "Lương cơ bản cho Nguyễn Văn An + Phụ cấp đi lại (500,000) 
//  + Phụ cấp ăn trưa (22 ngày × 30,000) + Thưởng hiệu suất (10%)"
```

### ✅ Ưu điểm
- ✅ Thêm chức năng động (runtime)
- ✅ Tuân thủ Single Responsibility Principle
- ✅ Có thể combine nhiều decorator
- ✅ Không cần sửa code gốc

### 📊 Use Case Thực tế

**Case 1: Nhân viên văn phòng**
```java
SalaryComponent salary = new BaseSalary(15_000_000, "An");
salary = new TransportationAllowanceDecorator(salary);      // + 500,000
salary = new LunchAllowanceDecorator(salary, 22);           // + 660,000
salary = new PerformanceBonusDecorator(salary);             // + 10%
// Total: ~17,776,000 VNĐ
```

**Case 2: Nhân viên làm thêm giờ**
```java
SalaryComponent salary = new BaseSalary(10_000_000, "Bình");
salary = new OvertimeDecorator(salary, 20, BigDecimal.valueOf(50000)); // +20h OT
salary = new LunchAllowanceDecorator(salary, 26);                      // +26 ngày
// Total: ~11,780,000 VNĐ
```

**Case 3: Chỉ lương cơ bản (không có decorator)**
```java
SalaryComponent salary = new BaseSalary(8_000_000, "Cường");
// Total: 8,000,000 VNĐ
```

---

## 🔗 Tương tác giữa các Patterns

### Strategy + Decorator
```
1. Strategy Pattern tính lương cơ bản
2. Decorator Pattern thêm phụ cấp, thưởng
```

### Strategy + Singleton
```
Strategy sử dụng Singleton để lấy cấu hình (bonus rate, etc.)
```

### Decorator + Singleton
```
Decorator sử dụng Singleton để lấy giá trị phụ cấp mặc định
```

### Ví dụ kết hợp:
```java
// 1. Dùng Strategy tính lương cơ bản
BigDecimal baseSalary = hourlyStrategy.calculateSalary(employee, attendances);

// 2. Dùng Decorator thêm phụ cấp
SalaryComponent salary = new BaseSalary(baseSalary, employee.getName());
salary = new TransportationAllowanceDecorator(salary);  // Dùng Singleton lấy config
salary = new PerformanceBonusDecorator(salary);         // Dùng Singleton lấy config

// 3. Kết quả cuối cùng
BigDecimal finalSalary = salary.calculateTotal();
```

---

## 📁 Cấu trúc thư mục

```
backend/src/main/java/com/attendance/
├── config/
│   └── ApplicationConfig.java           ← Singleton Pattern
├── decorator/
│   ├── SalaryComponent.java            ← Decorator Interface
│   ├── BaseSalary.java                 ← Concrete Component
│   ├── SalaryDecorator.java            ← Abstract Decorator
│   ├── TransportationAllowanceDecorator.java
│   ├── LunchAllowanceDecorator.java
│   ├── PerformanceBonusDecorator.java
│   └── OvertimeDecorator.java
└── strategy/
    ├── SalaryCalculationStrategy.java  ← Strategy Interface
    ├── FixedSalaryCalculation.java
    ├── HourlySalaryCalculation.java
    ├── ProductBasedSalaryCalculation.java
    └── KpiBasedSalaryCalculation.java
```

---

## 🎓 Bài học Design Patterns

### 1. Khi nào dùng Strategy?
- ✅ Có nhiều thuật toán khác nhau cho cùng một vấn đề
- ✅ Muốn switch giữa các thuật toán tại runtime
- ✅ Tránh if-else hoặc switch-case lớn

### 2. Khi nào dùng Singleton?
- ✅ Cần duy nhất một instance (Config, Logger, Cache)
- ✅ Truy cập toàn cục
- ✅ Quản lý resource chung

### 3. Khi nào dùng Decorator?
- ✅ Thêm chức năng động
- ✅ Combine nhiều features
- ✅ Không muốn sửa code gốc
- ✅ Thay thế cho inheritance

---

## 📊 So sánh với cách làm thông thường

### ❌ Không dùng Strategy (Anti-pattern)
```java
public BigDecimal calculateSalary(Employee employee) {
    if (employee.getType() == "FIXED") {
        return employee.getSalary();
    } else if (employee.getType() == "HOURLY") {
        return employee.getHourlyRate() * hours;
    } else if (employee.getType() == "PRODUCT") {
        return employee.getProductRate() * products;
    } else if (employee.getType() == "KPI") {
        return employee.getSalary() + employee.getBonus();
    }
    // Thêm loại mới? Phải sửa hàm này!
}
```

### ✅ Dùng Strategy
```java
// Thêm loại mới? Chỉ cần tạo class mới!
public class CommissionBasedSalaryCalculation implements SalaryCalculationStrategy {
    @Override
    public BigDecimal calculateSalary(Employee employee, List<Attendance> attendances) {
        return employee.getBaseSalary().add(employee.getCommission());
    }
}
```

### ❌ Không dùng Decorator
```java
public BigDecimal calculateSalaryWithAllowances(Employee employee) {
    BigDecimal total = employee.getSalary();
    total += 500000; // Transportation
    total += 30000 * 22; // Lunch
    total += total * 0.1; // Bonus
    return total;
    // Muốn thêm allowance mới? Phải sửa hàm!
}
```

### ✅ Dùng Decorator
```java
// Linh hoạt chọn allowance nào muốn thêm
SalaryComponent salary = new BaseSalary(15000000, "An");
if (hasTransportation) salary = new TransportationAllowanceDecorator(salary);
if (needLunch) salary = new LunchAllowanceDecorator(salary, 22);
if (highPerformer) salary = new PerformanceBonusDecorator(salary);
```

---

## 🎯 Kết luận

Hệ thống sử dụng 3 Design Patterns chính:

| Pattern | Vai trò | File quan trọng |
|---------|---------|-----------------|
| **Strategy** | Tính lương linh hoạt | `strategy/*.java` |
| **Singleton** | Quản lý config | `config/ApplicationConfig.java` |
| **Decorator** | Thêm phụ cấp động | `decorator/*.java` |

### Lợi ích tổng thể:
- ✅ **Maintainable**: Code dễ maintain, dễ hiểu
- ✅ **Extensible**: Dễ thêm tính năng mới
- ✅ **Testable**: Dễ test từng component
- ✅ **SOLID Principles**: Tuân thủ nguyên tắc OOP

---

**Created by Design Pattern Team | Version 2.0.0**

