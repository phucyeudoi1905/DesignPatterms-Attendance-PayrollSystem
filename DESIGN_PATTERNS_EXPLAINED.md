# 🎯 Design Patterns Explained - Attendance Payroll System

**Tài liệu giải thích chi tiết 3 Design Patterns trong hệ thống**

*Tại sao chọn? Cách áp dụng? Lợi ích thực tế?*

---

## 📋 Mục lục

1. [Strategy Pattern](#1-strategy-pattern)
2. [Singleton Pattern](#2-singleton-pattern)
3. [Decorator Pattern](#3-decorator-pattern)
4. [So sánh và kết hợp](#4-so-sánh-và-kết-hợp-patterns)

---

# 1. Strategy Pattern

## 🤔 Vấn đề thực tế

**Tình huống:** Hệ thống chấm công cần tính lương cho nhiều loại nhân viên khác nhau:
- Nhân viên văn phòng: **Lương cố định** hàng tháng
- Nhân viên part-time: **Lương theo giờ**
- Công nhân sản xuất: **Lương theo số sản phẩm**
- Nhân viên sales: **Lương + thưởng KPI**

**Vấn đề:** Nếu dùng if-else:
```java
public BigDecimal calculateSalary(Employee employee) {
    if (employee.getType() == "FIXED") {
        return employee.getBaseSalary();
    } else if (employee.getType() == "HOURLY") {
        return employee.getHourlyRate() * totalHours;
    } else if (employee.getType() == "PRODUCT") {
        return employee.getProductRate() * totalProducts;
    } else if (employee.getType() == "KPI") {
        return employee.getBaseSalary() + employee.getKpiBonus();
    }
    // Thêm loại mới? Phải sửa method này! ❌
}
```

**❌ Vấn đề:**
- Vi phạm Open/Closed Principle (phải sửa code cũ khi thêm mới)
- Code khó maintain
- Khó test riêng từng loại
- Coupling cao

---

## ✅ Giải pháp: Strategy Pattern

**Tại sao chọn Strategy?**

1. **Nhiều thuật toán khác nhau** cho cùng một việc (tính lương)
2. **Dễ mở rộng** - thêm loại hợp đồng mới không cần sửa code cũ
3. **Tuân thủ SOLID** - Single Responsibility, Open/Closed
4. **Dễ test** - test riêng từng strategy
5. **Runtime flexibility** - chọn strategy lúc chạy dựa vào loại nhân viên

---

## 🏗️ UML Diagram

```
┌─────────────────────────────────┐
│  <<interface>>                  │
│  SalaryCalculationStrategy      │
├─────────────────────────────────┤
│ + calculateSalary(Employee,     │
│     List<Attendance>): BigDecimal│
└─────────────────────────────────┘
           ▲
           │ implements
           │
    ┌──────┴──────┬──────────┬───────────┐
    │             │          │           │
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│  Fixed    │ │  Hourly   │ │  Product  │ │    KPI    │
│  Salary   │ │  Salary   │ │   Based   │ │   Based   │
│Calculation│ │Calculation│ │ Salary    │ │  Salary   │
└───────────┘ └───────────┘ └───────────┘ └───────────┘

         ┌─────────────────┐
         │ PayrollService  │ ◆─────► SalaryCalculationStrategy
         ├─────────────────┤
         │ - strategies    │
         │ + calculate()   │
         └─────────────────┘
```

**Giải thích:**
- `PayrollService` là **Context** - chứa reference đến Strategy
- `SalaryCalculationStrategy` là **Interface** - định nghĩa contract
- 4 classes cụ thể là **Concrete Strategies** - implementation riêng

---

## 💻 Code Implementation

### Interface Strategy

```java
public interface SalaryCalculationStrategy {
    /**
     * Tính lương dựa vào thông tin nhân viên và chấm công
     * @param employee Thông tin nhân viên (lương cơ bản, rates, etc.)
     * @param attendances Danh sách chấm công trong kỳ
     * @return Tổng lương được tính
     */
    BigDecimal calculateSalary(Employee employee, List<Attendance> attendances);
}
```

### Concrete Strategy 1: Fixed Salary

```java
@Component
public class FixedSalaryCalculation implements SalaryCalculationStrategy {
    
    @Override
    public BigDecimal calculateSalary(Employee employee, List<Attendance> attendances) {
        // Lương cố định - không phụ thuộc chấm công
        return employee.getSalaryBase();
    }
}
```

**Use case:** Developer, Manager, Accountant

### Concrete Strategy 2: Hourly Salary

```java
@Component
public class HourlySalaryCalculation implements SalaryCalculationStrategy {
    
    @Override
    public BigDecimal calculateSalary(Employee employee, List<Attendance> attendances) {
        // Tính tổng giờ làm việc
        int totalHours = attendances.stream()
                .mapToInt(Attendance::getWorkingHours)
                .sum();
        
        // Lương = hourlyRate × tổng giờ
        return employee.getHourlyRate()
                .multiply(BigDecimal.valueOf(totalHours));
    }
}
```

**Use case:** Part-time, Freelancer, Intern

### Context: PayrollService

```java
@Service
public class PayrollService {
    
    // Injected strategies
    private Map<ContractType, SalaryCalculationStrategy> strategies;
    
    @Autowired
    public void initStrategies(
        FixedSalaryCalculation fixedStrategy,
        HourlySalaryCalculation hourlyStrategy,
        ProductBasedSalaryCalculation productStrategy,
        KpiBasedSalaryCalculation kpiStrategy
    ) {
        strategies = new HashMap<>();
        strategies.put(ContractType.FIXED, fixedStrategy);
        strategies.put(ContractType.HOURLY, hourlyStrategy);
        strategies.put(ContractType.PRODUCT_BASED, productStrategy);
        strategies.put(ContractType.KPI_BASED, kpiStrategy);
    }
    
    public Payroll calculateSalary(Long employeeId) {
        // 1. Lấy thông tin nhân viên
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow();
        
        // 2. Lấy dữ liệu chấm công
        List<Attendance> attendances = attendanceRepository
                .findByEmployeeId(employeeId);
        
        // 3. Chọn strategy phù hợp (runtime)
        SalaryCalculationStrategy strategy = 
                strategies.get(employee.getContractType());
        
        // 4. Thực thi strategy
        BigDecimal salary = strategy.calculateSalary(employee, attendances);
        
        // 5. Lưu kết quả
        return payrollRepository.save(payroll);
    }
}
```

---

## 🔄 Workflow thực tế

### Scenario: Tính lương cho nhân viên part-time

```
1. User click "Tính lương" cho nhân viên ID=2 (Part-time)
   │
   ↓
2. PayrollController gọi payrollService.calculateSalary(2)
   │
   ↓
3. PayrollService:
   ├─ Lấy Employee(id=2): name="Trần Thị Bình", contractType=HOURLY
   ├─ Lấy Attendances: [
   │    {date: 01/10, hours: 4},
   │    {date: 02/10, hours: 5},
   │    {date: 03/10, hours: 6}
   │  ]
   └─ Chọn strategy: strategies.get(HOURLY) → HourlySalaryCalculation
   │
   ↓
4. HourlySalaryCalculation.calculateSalary():
   ├─ Tính totalHours: 4 + 5 + 6 = 15 giờ
   ├─ Lấy hourlyRate: 50,000 VNĐ
   └─ Tính: 50,000 × 15 = 750,000 VNĐ
   │
   ↓
5. Lưu Payroll:
   {
     employeeId: 2,
     salary: 750,000,
     calculationType: "HOURLY",
     createdDate: "2025-01-18"
   }
   │
   ↓
6. Return kết quả cho Frontend → Hiển thị "Lương: 750,000 VNĐ"
```

---

## 🎯 Lợi ích trong hệ thống thực tế

### 1. Dễ thêm loại hợp đồng mới

**Ví dụ:** Thêm "Commission-based" (lương theo hoa hồng):

```java
@Component
public class CommissionBasedSalaryCalculation 
        implements SalaryCalculationStrategy {
    
    @Override
    public BigDecimal calculateSalary(Employee employee, 
                                      List<Attendance> attendances) {
        // Lương = baseSalary + (totalSales × commissionRate)
        BigDecimal baseSalary = employee.getBaseSalary();
        BigDecimal totalSales = calculateTotalSales(employee);
        BigDecimal commission = totalSales
                .multiply(employee.getCommissionRate());
        
        return baseSalary.add(commission);
    }
}
```

**Chỉ cần:**
1. Tạo class mới (không sửa code cũ) ✅
2. Thêm vào map strategies ✅
3. Xong! ✅

### 2. Dễ test

```java
@Test
public void testHourlySalaryCalculation() {
    // Arrange
    Employee employee = new Employee();
    employee.setHourlyRate(BigDecimal.valueOf(50000));
    
    List<Attendance> attendances = Arrays.asList(
        new Attendance(4), // 4 hours
        new Attendance(5), // 5 hours
        new Attendance(6)  // 6 hours
    );
    
    HourlySalaryCalculation strategy = new HourlySalaryCalculation();
    
    // Act
    BigDecimal result = strategy.calculateSalary(employee, attendances);
    
    // Assert
    assertEquals(BigDecimal.valueOf(750000), result);
}
```

### 3. Business logic tách biệt

```
Business Rule thay đổi → Chỉ sửa 1 strategy file
VD: "Lương part-time giờ thứ 8 trở đi tính × 1.5"
→ Chỉ sửa HourlySalaryCalculation.java
```

---

# 2. Singleton Pattern

## 🤔 Vấn đề thực tế

**Tình huống:** Hệ thống cần quản lý cấu hình chung:
- Phụ cấp đi lại: 500,000 VNĐ
- Phụ cấp ăn trưa: 30,000 VNĐ/ngày
- Hệ số tăng ca: 1.5
- Thưởng hiệu suất: 10%

**Vấn đề nếu không dùng Singleton:**

```java
// ❌ Mỗi class tự tạo instance mới
public class TransportationAllowance {
    private Config config = new Config(); // Instance 1
    int amount = config.getTransportationAllowance();
}

public class LunchAllowance {
    private Config config = new Config(); // Instance 2 (khác instance 1!)
    int amount = config.getLunchAllowance();
}

// ❌ Vấn đề:
// - Nhiều instance → lãng phí memory
// - Không đồng bộ khi update config
// - Khó quản lý state
```

---

## ✅ Giải pháp: Singleton Pattern

**Tại sao chọn Singleton?**

1. **Chỉ cần 1 instance** - Config là shared resource
2. **Truy cập toàn cục** - Mọi nơi đều dùng cùng 1 config
3. **Đồng bộ dữ liệu** - Update 1 chỗ, mọi nơi đều thấy
4. **Tiết kiệm memory** - Không tạo duplicate instances
5. **Lifecycle control** - Khởi tạo lazy, tồn tại suốt runtime

---

## 🏗️ UML Diagram

```
┌────────────────────────────────────┐
│       ApplicationConfig            │
├────────────────────────────────────┤
│ - instance: ApplicationConfig      │ ◄── Static (class-level)
│ - settings: Map<String, Object>    │
│ - startupTime: LocalDateTime       │
│ - requestCount: int                │
├────────────────────────────────────┤
│ - ApplicationConfig()              │ ◄── Private constructor
│ + getInstance(): ApplicationConfig │ ◄── Static method
│ + getSetting(key): Object          │
│ + setSetting(key, value): void     │
│ + getTransportationAllowance(): int│
│ + getLunchAllowance(): int         │
│ + getOvertimeRate(): double        │
└────────────────────────────────────┘
         ▲
         │ uses (global access)
         │
  ┌──────┴──────┬───────────┬──────────┐
  │             │           │          │
Dashboard   Decorator   PayrollService  ...
```

**Đặc điểm quan trọng:**
- Constructor **private** - không thể `new` từ bên ngoài
- Instance **static** - thuộc về class, không phải object
- Method `getInstance()` **static** - access point duy nhất

---

## 💻 Code Implementation

### Singleton Class

```java
@Component
public class ApplicationConfig {
    
    // 1. Static instance (duy nhất)
    private static ApplicationConfig instance;
    
    // 2. Data members
    private final Map<String, Object> settings;
    private final LocalDateTime startupTime;
    private int requestCount;
    
    // 3. Private constructor (ngăn tạo instance từ ngoài)
    private ApplicationConfig() {
        this.settings = new HashMap<>();
        this.startupTime = LocalDateTime.now();
        this.requestCount = 0;
        
        // Initialize default settings
        initializeDefaultSettings();
        
        System.out.println("🔧 ApplicationConfig Singleton created at: " 
                + startupTime);
    }
    
    // 4. Public static method để lấy instance
    public static synchronized ApplicationConfig getInstance() {
        if (instance == null) {
            instance = new ApplicationConfig();
        }
        return instance;
    }
    
    private void initializeDefaultSettings() {
        settings.put("allowance.transportation", 500000);
        settings.put("allowance.lunch", 30000);
        settings.put("overtime.rate", 1.5);
        settings.put("bonus.performance", 0.1);
    }
    
    // Getter methods
    public int getTransportationAllowance() {
        return (int) settings.getOrDefault("allowance.transportation", 500000);
    }
    
    public int getLunchAllowance() {
        return (int) settings.getOrDefault("allowance.lunch", 30000);
    }
    
    public double getOvertimeRate() {
        return (double) settings.getOrDefault("overtime.rate", 1.5);
    }
    
    // Update config
    public synchronized void setSetting(String key, Object value) {
        settings.put(key, value);
        System.out.println("⚙️ Config updated: " + key + " = " + value);
    }
    
    // System info
    public long getUptimeInSeconds() {
        return Duration.between(startupTime, LocalDateTime.now()).getSeconds();
    }
    
    public synchronized void incrementRequestCount() {
        requestCount++;
    }
}
```

**Key points:**
- `synchronized` - thread-safe
- Lazy initialization - tạo khi cần
- Private constructor - bảo vệ

---

## 🔄 Workflow thực tế

### Scenario: Dashboard lấy thông tin hệ thống

```
1. User truy cập Dashboard (http://localhost:5173)
   │
   ↓
2. Frontend gọi API: GET /api/dashboard/stats
   │
   ↓
3. DashboardController:
   ├─ ApplicationConfig config = ApplicationConfig.getInstance()
   │  └─ Nếu chưa tồn tại → Tạo instance mới
   │  └─ Nếu đã tồn tại → Trả về instance hiện có (same reference)
   │
   ├─ config.incrementRequestCount()
   └─ DashboardService.getDashboardStatistics()
   │
   ↓
4. DashboardService:
   ├─ ApplicationConfig config = ApplicationConfig.getInstance()
   │  └─ Trả về CÙNG instance với step 3 ✅
   │
   ├─ String version = config.getSetting("app.version")
   ├─ long uptime = config.getUptimeInSeconds()
   └─ Return stats
   │
   ↓
5. Frontend hiển thị:
   {
     "appVersion": "2.1.0",
     "uptimeInSeconds": 3600,
     "requestCount": 42
   }
```

### Scenario: Decorator sử dụng config

```
1. Tính lương với phụ cấp
   │
   ↓
2. TransportationAllowanceDecorator:
   ├─ ApplicationConfig config = ApplicationConfig.getInstance()
   │  └─ CÙNG instance với Dashboard ✅
   │
   ├─ int amount = config.getTransportationAllowance()
   │  └─ Lấy giá trị: 500,000
   │
   └─ salary = baseSalary + amount
   │
   ↓
3. LunchAllowanceDecorator:
   ├─ ApplicationConfig config = ApplicationConfig.getInstance()
   │  └─ VẪN LÀ CÙNG instance ✅
   │
   ├─ int daily = config.getLunchAllowance()
   │  └─ Lấy giá trị: 30,000
   │
   └─ salary = previousSalary + (daily × workingDays)
```

**Lợi ích:**
- ✅ Tất cả đều dùng CÙNG 1 config
- ✅ Update 1 chỗ → Mọi nơi đều thấy
- ✅ Không tạo duplicate instances

---

## 🎯 Lợi ích trong hệ thống thực tế

### 1. Consistency

```java
// Tất cả đều lấy cùng 1 giá trị
ApplicationConfig config1 = ApplicationConfig.getInstance();
ApplicationConfig config2 = ApplicationConfig.getInstance();

System.out.println(config1 == config2); // true ✅

config1.setSetting("allowance.transportation", 600000);
System.out.println(config2.getTransportationAllowance()); // 600,000 ✅
```

### 2. Centralized Configuration

```java
// Thay đổi config từ Admin panel
@PutMapping("/admin/config")
public ResponseEntity<?> updateConfig(@RequestBody Map<String, Object> updates) {
    ApplicationConfig config = ApplicationConfig.getInstance();
    
    updates.forEach((key, value) -> {
        config.setSetting(key, value);
    });
    
    // Tất cả services lập tức thấy giá trị mới!
    return ResponseEntity.ok("Config updated");
}
```

### 3. System Monitoring

```java
// Dashboard hiển thị system info
public DashboardStats getStats() {
    ApplicationConfig config = ApplicationConfig.getInstance();
    
    DashboardStats stats = new DashboardStats();
    stats.setUptime(config.getUptimeInSeconds());
    stats.setRequestCount(config.getRequestCount());
    stats.setAppVersion(config.getSetting("app.version"));
    
    return stats;
}
```

---

## ⚠️ Thread Safety

**Vấn đề:** Multiple threads cùng lúc gọi `getInstance()`

```java
// ❌ Not thread-safe
public static ApplicationConfig getInstance() {
    if (instance == null) {        // Thread 1 check
        instance = new ApplicationConfig(); // Thread 1 tạo
                                            // Thread 2 cũng tạo!
    }
    return instance;
}

// ✅ Thread-safe với synchronized
public static synchronized ApplicationConfig getInstance() {
    if (instance == null) {
        instance = new ApplicationConfig();
    }
    return instance; // Chỉ 1 thread tạo, các thread khác đợi
}
```

---

# 3. Decorator Pattern

## 🤔 Vấn đề thực tế

**Tình huống:** Nhân viên có lương cơ bản, nhưng cần thêm:
- Phụ cấp đi lại: +500,000
- Phụ cấp ăn trưa: +30,000/ngày
- Thưởng hiệu suất: +10%
- Tăng ca: +50% giờ tăng ca

**Vấn đề nếu dùng inheritance:**

```java
// ❌ Class explosion!
class BaseSalary { }
class SalaryWithTransportation extends BaseSalary { }
class SalaryWithTransportationAndLunch extends SalaryWithTransportation { }
class SalaryWithTransportationAndLunchAndBonus extends ... { }
// ... 2^4 = 16 combinations! 😱
```

**❌ Vấn đề:**
- Quá nhiều classes
- Không linh hoạt (compile-time)
- Khó maintain
- Vi phạm Single Responsibility

---

## ✅ Giải pháp: Decorator Pattern

**Tại sao chọn Decorator?**

1. **Thêm chức năng động** - runtime, không cần inheritance
2. **Flexible combination** - chọn decorators tùy ý
3. **Single Responsibility** - mỗi decorator làm 1 việc
4. **Open for extension** - thêm decorator mới không sửa code cũ
5. **Composable** - stack nhiều decorators lên nhau

---

## 🏗️ UML Diagram

```
┌──────────────────────────┐
│   <<interface>>          │
│   SalaryComponent        │
├──────────────────────────┤
│ + calculateTotal(): BigDecimal │
│ + getDescription(): String     │
└──────────────────────────┘
           ▲
           │ implements
    ┌──────┴──────┐
    │             │
┌───────────┐  ┌─────────────────────┐
│ BaseSalary│  │ SalaryDecorator     │◆───► SalaryComponent
│           │  │  (abstract)         │      (wraps)
└───────────┘  └─────────────────────┘
                      ▲
                      │ extends
           ┌──────────┼──────────┬──────────┐
           │          │          │          │
    ┌────────────┐ ┌───────────┐ ┌────────────┐ ┌────────┐
    │Transportation│ │  Lunch   │ │Performance │ │Overtime│
    │  Allowance  │ │ Allowance│ │   Bonus    │ │        │
    │  Decorator  │ │ Decorator│ │  Decorator │ │Decorator│
    └────────────┘ └───────────┘ └────────────┘ └────────┘
```

**Cách hoạt động:**
```
TransportationDecorator wraps LunchDecorator
    LunchDecorator wraps PerformanceDecorator
        PerformanceDecorator wraps BaseSalary

calculateTotal() → Transportation → Lunch → Performance → BaseSalary
```

---

## 💻 Code Implementation

### Component Interface

```java
public interface SalaryComponent {
    /**
     * Tính tổng lương (bao gồm tất cả các thành phần)
     */
    BigDecimal calculateTotal();
    
    /**
     * Mô tả các thành phần lương
     */
    String getDescription();
}
```

### Concrete Component (Base)

```java
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
        return "Lương cơ bản cho " + employeeName + ": " 
                + amount.toPlainString() + " VNĐ";
    }
}
```

### Abstract Decorator

```java
public abstract class SalaryDecorator implements SalaryComponent {
    
    protected SalaryComponent wrappedSalary; // Component được wrap
    
    public SalaryDecorator(SalaryComponent salary) {
        this.wrappedSalary = salary;
    }
    
    @Override
    public BigDecimal calculateTotal() {
        // Mặc định: delegate đến wrapped component
        return wrappedSalary.calculateTotal();
    }
    
    @Override
    public String getDescription() {
        return wrappedSalary.getDescription();
    }
}
```

### Concrete Decorator 1: Transportation

```java
public class TransportationAllowanceDecorator extends SalaryDecorator {
    
    private final int allowanceAmount;
    
    public TransportationAllowanceDecorator(SalaryComponent salary) {
        super(salary);
        // Lấy config từ Singleton
        this.allowanceAmount = ApplicationConfig.getInstance()
                .getTransportationAllowance();
    }
    
    @Override
    public BigDecimal calculateTotal() {
        // Lương gốc + phụ cấp đi lại
        return wrappedSalary.calculateTotal()
                .add(BigDecimal.valueOf(allowanceAmount));
    }
    
    @Override
    public String getDescription() {
        return wrappedSalary.getDescription() 
                + "\n+ Phụ cấp đi lại: " + allowanceAmount + " VNĐ";
    }
}
```

### Concrete Decorator 2: Lunch

```java
public class LunchAllowanceDecorator extends SalaryDecorator {
    
    private final int dailyAllowance;
    private final int workingDays;
    
    public LunchAllowanceDecorator(SalaryComponent salary, int workingDays) {
        super(salary);
        this.dailyAllowance = ApplicationConfig.getInstance()
                .getLunchAllowance();
        this.workingDays = workingDays;
    }
    
    @Override
    public BigDecimal calculateTotal() {
        int totalLunchAllowance = dailyAllowance * workingDays;
        return wrappedSalary.calculateTotal()
                .add(BigDecimal.valueOf(totalLunchAllowance));
    }
    
    @Override
    public String getDescription() {
        int total = dailyAllowance * workingDays;
        return wrappedSalary.getDescription()
                + "\n+ Phụ cấp ăn trưa: " + workingDays + " ngày × " 
                + dailyAllowance + " = " + total + " VNĐ";
    }
}
```

### Concrete Decorator 3: Performance Bonus

```java
public class PerformanceBonusDecorator extends SalaryDecorator {
    
    private final double bonusRate;
    
    public PerformanceBonusDecorator(SalaryComponent salary) {
        super(salary);
        this.bonusRate = ApplicationConfig.getInstance()
                .getPerformanceBonusRate(); // 0.1 = 10%
    }
    
    @Override
    public BigDecimal calculateTotal() {
        BigDecimal currentTotal = wrappedSalary.calculateTotal();
        BigDecimal bonus = currentTotal
                .multiply(BigDecimal.valueOf(bonusRate))
                .setScale(0, RoundingMode.HALF_UP);
        
        return currentTotal.add(bonus);
    }
    
    @Override
    public String getDescription() {
        int percent = (int) (bonusRate * 100);
        return wrappedSalary.getDescription()
                + "\n+ Thưởng hiệu suất: " + percent + "%";
    }
}
```

---

## 🔄 Workflow thực tế

### Scenario: Tính lương nhân viên văn phòng với đầy đủ phụ cấp

```
Input:
- Nhân viên: Nguyễn Văn An
- Lương cơ bản: 15,000,000 VNĐ
- Số ngày làm: 22 ngày
- Có thưởng hiệu suất: Yes

Step-by-step:

1. Tạo lương cơ bản
   │
   SalaryComponent salary = new BaseSalary(
       BigDecimal.valueOf(15_000_000), 
       "Nguyễn Văn An"
   );
   │
   calculateTotal() → 15,000,000
   getDescription() → "Lương cơ bản cho Nguyễn Văn An: 15,000,000 VNĐ"
   │
   ↓

2. Thêm phụ cấp đi lại (wrap)
   │
   salary = new TransportationAllowanceDecorator(salary);
   │
   calculateTotal():
     └─ wrappedSalary.calculateTotal() → 15,000,000
     └─ + allowanceAmount → +500,000
     └─ = 15,500,000
   │
   getDescription():
     "Lương cơ bản cho Nguyễn Văn An: 15,000,000 VNĐ
      + Phụ cấp đi lại: 500,000 VNĐ"
   │
   ↓

3. Thêm phụ cấp ăn trưa (wrap thêm)
   │
   salary = new LunchAllowanceDecorator(salary, 22);
   │
   calculateTotal():
     └─ wrappedSalary.calculateTotal() → 15,500,000
     └─ + (30,000 × 22) → +660,000
     └─ = 16,160,000
   │
   getDescription():
     "Lương cơ bản cho Nguyễn Văn An: 15,000,000 VNĐ
      + Phụ cấp đi lại: 500,000 VNĐ
      + Phụ cấp ăn trưa: 22 ngày × 30,000 = 660,000 VNĐ"
   │
   ↓

4. Thêm thưởng hiệu suất (wrap thêm)
   │
   salary = new PerformanceBonusDecorator(salary);
   │
   calculateTotal():
     └─ currentTotal = wrappedSalary.calculateTotal() → 16,160,000
     └─ bonus = 16,160,000 × 0.1 → 1,616,000
     └─ = 17,776,000
   │
   getDescription():
     "Lương cơ bản cho Nguyễn Văn An: 15,000,000 VNĐ
      + Phụ cấp đi lại: 500,000 VNĐ
      + Phụ cấp ăn trưa: 22 ngày × 30,000 = 660,000 VNĐ
      + Thưởng hiệu suất: 10%"
   │
   ↓

5. Kết quả cuối cùng
   │
   BigDecimal finalSalary = salary.calculateTotal();
   → 17,776,000 VNĐ
   │
   String breakdown = salary.getDescription();
   → Chi tiết đầy đủ từng khoản
```

---

## 🎯 Lợi ích trong hệ thống thực tế

### 1. Flexible Combinations

```java
// Nhân viên A: Full package
SalaryComponent salaryA = new BaseSalary(15_000_000, "An");
salaryA = new TransportationAllowanceDecorator(salaryA);
salaryA = new LunchAllowanceDecorator(salaryA, 22);
salaryA = new PerformanceBonusDecorator(salaryA);
// Total: 17,776,000

// Nhân viên B: Chỉ cần một vài phụ cấp
SalaryComponent salaryB = new BaseSalary(10_000_000, "Bình");
salaryB = new LunchAllowanceDecorator(salaryB, 20);
// Total: 10,600,000

// Nhân viên C: Chỉ lương cơ bản
SalaryComponent salaryC = new BaseSalary(8_000_000, "Cường");
// Total: 8,000,000
```

**Lợi ích:** 
- ✅ Không cần tạo class riêng cho từng combination
- ✅ Runtime decision based on employee type
- ✅ Easy to customize

### 2. Dễ thêm decorator mới

```java
// Thêm decorator cho "Senior allowance"
public class SeniorAllowanceDecorator extends SalaryDecorator {
    
    private static final int SENIOR_ALLOWANCE = 2_000_000;
    
    public SeniorAllowanceDecorator(SalaryComponent salary) {
        super(salary);
    }
    
    @Override
    public BigDecimal calculateTotal() {
        return wrappedSalary.calculateTotal()
                .add(BigDecimal.valueOf(SENIOR_ALLOWANCE));
    }
    
    @Override
    public String getDescription() {
        return wrappedSalary.getDescription()
                + "\n+ Phụ cấp Senior: " + SENIOR_ALLOWANCE + " VNĐ";
    }
}

// Sử dụng
salary = new SeniorAllowanceDecorator(salary);
```

**Lợi ích:**
- ✅ Không cần sửa code cũ
- ✅ Open/Closed Principle
- ✅ Easy to test independently

### 3. Transparent to client

```java
// Client code không cần biết có bao nhiêu decorators
public void displaySalary(SalaryComponent salary) {
    System.out.println("Total: " + salary.calculateTotal());
    System.out.println("Details:\n" + salary.getDescription());
}

// Works với BaseSalary
displaySalary(new BaseSalary(10_000_000, "Test"));

// Works với decorated salary
SalaryComponent decorated = new BaseSalary(10_000_000, "Test");
decorated = new TransportationAllowanceDecorator(decorated);
decorated = new LunchAllowanceDecorator(decorated, 20);
displaySalary(decorated); // Same interface!
```

---

# 4. So sánh và kết hợp Patterns

## 🔗 Tương tác giữa 3 Patterns

### Kịch bản thực tế: Tính lương full package

```java
public Payroll calculateSalaryWithAllowances(Long employeeId) {
    // 1. Lấy thông tin
    Employee employee = employeeRepository.findById(employeeId).orElseThrow();
    List<Attendance> attendances = attendanceRepository.findByEmployeeId(employeeId);
    
    // 2. STRATEGY: Chọn cách tính lương cơ bản
    SalaryCalculationStrategy strategy = strategies.get(employee.getContractType());
    BigDecimal baseSalary = strategy.calculateSalary(employee, attendances);
    
    // 3. DECORATOR: Thêm các khoản phụ cấp
    SalaryComponent salary = new BaseSalary(baseSalary, employee.getName());
    
    // 4. SINGLETON: Lấy config để tính phụ cấp
    ApplicationConfig config = ApplicationConfig.getInstance();
    
    // 5. Stack decorators
    salary = new TransportationAllowanceDecorator(salary); // Dùng Singleton
    salary = new LunchAllowanceDecorator(salary, 22);      // Dùng Singleton
    salary = new PerformanceBonusDecorator(salary);        // Dùng Singleton
    
    // 6. Kết quả cuối
    BigDecimal finalSalary = salary.calculateTotal();
    String breakdown = salary.getDescription();
    
    // 7. Lưu vào DB
    return payrollRepository.save(payroll);
}
```

### Workflow tích hợp

```
User Request: "Tính lương cho nhân viên ID=1"
│
├─[1] Strategy Pattern: Chọn thuật toán
│   ├─ employeeType = HOURLY
│   └─ strategy = HourlySalaryCalculation
│   └─ baseSalary = 50,000 × 40h = 2,000,000
│
├─[2] Decorator Pattern: Thêm phụ cấp
│   ├─ Base: 2,000,000
│   ├─ +Transportation: 500,000
│   ├─ +Lunch: 660,000
│   └─ +Bonus 10%: 316,000
│   └─ Total: 3,476,000
│
└─[3] Singleton Pattern: Config cho Decorators
    ├─ TransportationAllowance → config.getTransportationAllowance()
    ├─ LunchAllowance → config.getLunchAllowance()
    └─ PerformanceBonus → config.getPerformanceBonusRate()
    └─ Tất cả dùng CÙNG 1 instance ✅
```

---

## 📊 Bảng so sánh

| Aspect | Strategy | Singleton | Decorator |
|--------|----------|-----------|-----------|
| **Category** | Behavioral | Creational | Structural |
| **Purpose** | Chọn algorithm | 1 instance duy nhất | Thêm chức năng động |
| **When to use** | Nhiều thuật toán khác nhau | Shared resource | Flexible extension |
| **Example** | Tính lương theo loại HĐ | App configuration | Thêm phụ cấp |
| **Runtime** | Chọn strategy lúc chạy | Tạo instance lúc cần | Stack decorators lúc chạy |
| **Flexibility** | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐ |
| **Complexity** | Medium | Low | Medium-High |

---

## ✅ Tóm tắt: Tại sao chọn từng Pattern?

### Strategy Pattern
```
✅ VÌ: Có 4 cách tính lương khác nhau hoàn toàn
✅ VÌ: Cần dễ thêm loại hợp đồng mới
✅ VÌ: Muốn test riêng từng loại
✅ KẾT QUẢ: Maintainable, extensible, SOLID
```

### Singleton Pattern
```
✅ VÌ: Config là shared resource duy nhất
✅ VÌ: Cần đồng bộ dữ liệu toàn hệ thống
✅ VÌ: Tiết kiệm memory và dễ quản lý
✅ KẾT QUẢ: Consistent, centralized, efficient
```

### Decorator Pattern
```
✅ VÌ: Nhiều tổ hợp phụ cấp khác nhau
✅ VÌ: Không muốn class explosion
✅ VÌ: Cần flexible runtime composition
✅ KẾT QUẢ: Flexible, composable, maintainable
```

---

## 🎓 Kết luận

**3 Patterns làm việc cùng nhau tạo nên hệ thống:**
- **Flexible** - Dễ thêm features mới
- **Maintainable** - Code sạch, dễ hiểu
- **Scalable** - Mở rộng không cần refactor lớn
- **Testable** - Test riêng từng component
- **Professional** - Áp dụng best practices

---

**Version 2.1 | Design Pattern Team | 2025**


