# 🎯 Attendance Payroll System

**Version 2.1** - Hệ thống Quản lý Chấm công và Tính lương với Design Patterns

[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Design Patterns](#design-patterns)
- [Công nghệ](#công-nghệ)
- [Cài đặt](#cài-đặt)
- [Sử dụng](#sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Screenshots](#screenshots)
- [Đóng góp](#đóng-góp)

---

## 🎯 Giới thiệu

**Attendance Payroll System** là một ứng dụng web fullstack quản lý nhân viên, chấm công và tính lương, được xây dựng với mục đích minh họa việc áp dụng **Design Patterns** trong thực tế.

### Highlights:
- ✅ **3 Design Patterns**: Strategy, Singleton, Decorator
- ✅ **Fullstack**: Spring Boot + React
- ✅ **Professional UI**: Minimalist, Grayscale design
- ✅ **Auto-refresh**: Real-time dashboard updates
- ✅ **CRUD Operations**: Employee, Attendance, Payroll management
- ✅ **Flexible Salary Calculation**: 4 contract types

---

## ✨ Tính năng

### 📊 Dashboard
- Tổng quan hệ thống với thống kê real-time
- Tự động refresh mỗi 30 giây
- Biểu đồ phân loại hợp đồng
- Thông tin hệ thống và cấu hình

### 👥 Quản lý Nhân viên
- CRUD operations đầy đủ
- 4 loại hợp đồng: FIXED, HOURLY, PRODUCT_BASED, KPI_BASED
- Hiển thị chi tiết lương theo từng loại
- Export/Import data (planned)

### ⏰ Chấm công
- Ghi nhận giờ vào/ra
- Số giờ làm việc hoặc số sản phẩm
- Lịch sử chấm công theo nhân viên
- Validation và error handling

### 💰 Tính lương
- Tự động tính lương theo Strategy Pattern
- Hỗ trợ phụ cấp và thưởng (Decorator Pattern)
- Lịch sử tính lương
- Xuất báo cáo (planned)

---

## 🎨 Design Patterns

Dự án áp dụng **3 Design Patterns** chính:

### 1. **Strategy Pattern** (Behavioral)
**Mục đích:** Tính lương linh hoạt cho 4 loại hợp đồng khác nhau

```java
public interface SalaryCalculationStrategy {
    BigDecimal calculateSalary(Employee employee, List<Attendance> attendances);
}

// 4 implementations:
- FixedSalaryCalculation      // Lương cố định
- HourlySalaryCalculation     // Theo giờ
- ProductBasedSalaryCalculation // Theo sản phẩm
- KpiBasedSalaryCalculation   // Theo KPI
```

**Lợi ích:**
- ✅ Dễ thêm loại hợp đồng mới
- ✅ Tuân thủ Open/Closed Principle
- ✅ Code dễ test và maintain

### 2. **Singleton Pattern** (Creational)
**Mục đích:** Quản lý cấu hình toàn cục với 1 instance duy nhất

```java
public class ApplicationConfig {
    private static ApplicationConfig instance;
    
    private ApplicationConfig() { /* ... */ }
    
    public static synchronized ApplicationConfig getInstance() {
        if (instance == null) {
            instance = new ApplicationConfig();
        }
        return instance;
    }
}
```

**Lợi ích:**
- ✅ Truy cập toàn cục
- ✅ Thread-safe
- ✅ Quản lý resource tập trung

### 3. **Decorator Pattern** (Structural)
**Mục đích:** Thêm phụ cấp, thưởng vào lương một cách linh hoạt

```java
SalaryComponent salary = new BaseSalary(15_000_000, "Nguyễn Văn An");
salary = new TransportationAllowanceDecorator(salary);  // +500K
salary = new LunchAllowanceDecorator(salary, 22);       // +660K
salary = new PerformanceBonusDecorator(salary);         // +10%
// Total: ~17,776,000 VNĐ
```

**Lợi ích:**
- ✅ Thêm chức năng động
- ✅ Combine nhiều decorators
- ✅ Không cần sửa code gốc

📚 **Chi tiết:** 
- [DESIGN_PATTERNS_EXPLAINED.md](DESIGN_PATTERNS_EXPLAINED.md) - Giải thích WHY & HOW ⭐
- [DESIGN_PATTERNS_DOCUMENTATION.md](DESIGN_PATTERNS_DOCUMENTATION.md) - Technical reference

---

## 🛠️ Công nghệ

### Backend
- **Java 17+**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **H2 Database** (in-memory)
- **Maven**

### Frontend
- **React 18.x**
- **React Router DOM**
- **Axios**
- **Tailwind CSS**
- **Lucide React** (Icons)
- **Vite**

---

## 🚀 Cài đặt

### Yêu cầu:
- Java 17+ (hoặc IntelliJ IDEA với embedded Maven)
- Node.js 18+
- Git

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd Strategy_CuoiKy
```

### Bước 2: Chạy Backend
```bash
cd backend

# Với Maven
mvn clean install
mvn spring-boot:run

# Hoặc với IntelliJ IDEA:
# Mở backend folder → Run AttendancePayrollSystemApplication.java
```

Backend sẽ chạy tại: **http://localhost:8080**

### Bước 3: Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

📚 **Hướng dẫn chi tiết:** Xem [QUICK_START.md](QUICK_START.md)

---

## 💻 Sử dụng

### 1. Truy cập Dashboard
Mở browser: **http://localhost:5173**

Dashboard tự động refresh mỗi 30 giây với thống kê real-time.

### 2. Thêm nhân viên
1. Tab **"Nhân viên"** → Click **"Thêm nhân viên"**
2. Điền thông tin: Tên, Vị trí, Loại hợp đồng
3. Nhập tham số lương tương ứng:
   - **FIXED**: Lương cơ bản (VD: 15,000,000)
   - **HOURLY**: Lương/giờ (VD: 50,000)
   - **PRODUCT_BASED**: Lương/sản phẩm (VD: 20,000)
   - **KPI_BASED**: Lương cơ bản + Thưởng KPI

### 3. Chấm công
1. Tab **"Chấm công"** → Click **"Chấm công"**
2. Chọn nhân viên, nhập giờ vào/ra
3. Nhập **số giờ** (HOURLY) hoặc **số sản phẩm** (PRODUCT_BASED)

### 4. Tính lương
1. Tab **"Tính lương"**
2. Click **"Tính lương"** ở nhân viên muốn tính
3. Hệ thống tự động:
   - Chọn Strategy phù hợp
   - Tính lương dựa vào chấm công
   - Lưu vào lịch sử

### 5. Xem báo cáo
- Dashboard: Tổng quan thống kê
- Lịch sử chấm công: Theo từng nhân viên
- Lịch sử lương: Theo từng nhân viên

---

## 📁 Cấu trúc dự án

```
Strategy_CuoiKy/
├── backend/                           # Spring Boot Backend
│   └── src/main/java/com/attendance/
│       ├── config/
│       │   └── ApplicationConfig.java          # Singleton Pattern
│       ├── controller/
│       │   ├── DashboardController.java
│       │   ├── EmployeeController.java
│       │   ├── AttendanceController.java
│       │   └── PayrollController.java
│       ├── decorator/                          # Decorator Pattern
│       │   ├── SalaryComponent.java
│       │   ├── BaseSalary.java
│       │   ├── TransportationAllowanceDecorator.java
│       │   ├── LunchAllowanceDecorator.java
│       │   ├── PerformanceBonusDecorator.java
│       │   └── OvertimeDecorator.java
│       ├── model/
│       │   ├── Employee.java
│       │   ├── Attendance.java
│       │   └── Payroll.java
│       ├── repository/                         # Spring Data JPA
│       ├── service/                            # Business Logic
│       └── strategy/                           # Strategy Pattern
│           ├── SalaryCalculationStrategy.java
│           ├── FixedSalaryCalculation.java
│           ├── HourlySalaryCalculation.java
│           ├── ProductBasedSalaryCalculation.java
│           └── KpiBasedSalaryCalculation.java
│
├── frontend/                          # React Frontend
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.jsx                   # Auto-refresh dashboard
│       │   ├── EmployeeManagement.jsx
│       │   ├── AttendanceManagement.jsx
│       │   └── PayrollManagement.jsx
│       ├── services/
│       │   └── api.js                          # Axios API calls
│       └── App.jsx                             # Router & Navigation
│
├── QUICK_START.md                     # Hướng dẫn khởi động nhanh
├── DESIGN_PATTERNS_DOCUMENTATION.md   # Chi tiết 3 Design Patterns
├── CHANGELOG.md                       # Lịch sử phiên bản
└── README.md                          # File này
```

---

## 📸 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
- Real-time statistics
- Auto-refresh every 30 seconds
- Professional minimalist design

### Employee Management
![Employees](docs/screenshots/employees.png)
- Full CRUD operations
- Display all salary parameters
- Icon-based actions

### Payroll Calculation
![Payroll](docs/screenshots/payroll.png)
- Strategy Pattern in action
- Automatic calculation
- History tracking

---

## 🔧 API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Thống kê tổng quan
- `GET /api/dashboard/config` - Cấu hình hệ thống

### Employees
- `GET /api/employees` - Danh sách nhân viên
- `GET /api/employees/{id}` - Chi tiết nhân viên
- `POST /api/employees` - Thêm nhân viên
- `PUT /api/employees/{id}` - Cập nhật nhân viên
- `DELETE /api/employees/{id}` - Xóa nhân viên

### Attendance
- `GET /api/attendance/{employeeId}` - Lịch sử chấm công
- `POST /api/attendance` - Thêm chấm công

### Payroll
- `POST /api/payroll/calculate/{employeeId}` - Tính lương
- `GET /api/payroll/{employeeId}` - Lịch sử lương

---

## 🧪 Testing

```bash
# Backend tests
cd backend
mvn test

# Frontend tests (if configured)
cd frontend
npm test
```

---

## 📝 Changelog

### Version 2.1.0 (2025-01-XX)
- ✨ Professional UI với Lucide React icons
- ✨ Auto-refresh Dashboard (30s interval)
- ✨ Grayscale minimalist design
- 🐛 Fixed: Cải thiện error handling

### Version 2.0.0 (2025-01-XX)
- ✨ Thêm Dashboard với thống kê
- ✨ Singleton Pattern - ApplicationConfig
- ✨ Decorator Pattern - Salary decorators
- ✨ CRUD operations cho Employee

### Version 1.0.0 (2024-12-XX)
- 🎉 Initial release
- ✨ Strategy Pattern cho tính lương
- ✨ 4 loại hợp đồng: FIXED, HOURLY, PRODUCT_BASED, KPI_BASED
- ✨ Basic UI với Tailwind CSS

📚 **Chi tiết:** Xem [CHANGELOG.md](CHANGELOG.md)

---

## 🤝 Đóng góp

Contributions are welcome! Vui lòng:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**Design Pattern Team**
- Backend: Spring Boot + Design Patterns
- Frontend: React + Professional UI

---

## 🙏 Acknowledgments

- Spring Boot team
- React team
- Tailwind CSS
- Lucide Icons
- Design Patterns community

---

## 📞 Support

- 📧 Email: support@example.com
- 📚 Documentation: [DESIGN_PATTERNS_DOCUMENTATION.md](DESIGN_PATTERNS_DOCUMENTATION.md)
- 🚀 Quick Start: [QUICK_START.md](QUICK_START.md)

---

**Made with ❤️ by Design Pattern Team | 2025**
