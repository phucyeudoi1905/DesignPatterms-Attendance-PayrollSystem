# 📦 BÀI NỘP CUỐI KỲ - ATTENDANCE PAYROLL SYSTEM

**Sinh viên:** MSSV_Hoten_TenDeTai_MTK

**Hạn nộp:** Thứ hai, 27 Tháng 10 2025, 1:58 PM

---

## 📋 Nội dung bài nộp

Theo yêu cầu trong ảnh, bài nộp được tổ chức như sau:

### ✅ 1. Thư mục Source
**Đường dẫn:** `1. Source/`

**Nội dung:** Chứa toàn bộ mã nguồn chương trình
- `backend/` - Spring Boot Backend (Java)
- `frontend/` - React Frontend (JavaScript/JSX)

**Công nghệ:**
- Backend: Java 17, Spring Boot 3.2.0, Spring Data JPA, H2 Database
- Frontend: React 18.x, Tailwind CSS, Axios, Vite

### ✅ 2. Thư mục Thực thi
**Đường dẫn:** `2. ThucThi/`

**Nội dung:** Để trống (theo yêu cầu - không cần file tự chạy)

**Ghi chú:** 
- Để chạy ứng dụng, sử dụng Maven (backend) và npm (frontend)
- Xem hướng dẫn chi tiết trong file `HUONG_DAN_CHAY_INTELLIJ.md`

### ✅ 3. Thư mục Database
**Đường dẫn:** `3. Database/`

**Nội dung:** Chứa các file data và script
- `data.sql` - Dữ liệu mẫu (4 nhân viên)
- `application.properties` - Cấu hình database H2
- `README_DATABASE.md` - Hướng dẫn chi tiết về database

**Database:** H2 in-memory (tự động khởi tạo khi chạy backend)

### ✅ 4. File txt thông tin GitHub
**Đường dẫn:** `THONG_TIN_GITHUB.txt`

**Nội dung:**
- Link repository GitHub
- Mô tả dự án
- Design Patterns áp dụng
- Công nghệ sử dụng
- Hướng dẫn chạy
- API endpoints
- Thông tin nhóm

### ⬜ 5. Thư mục Doc
**Đường dẫn:** `4. Doc/`

**Nội dung:** Báo cáo đồ án (Word)

**Trạng thái:** Để trống - sẽ thêm báo cáo thủ công

---

## 🎯 Design Patterns áp dụng

Dự án áp dụng **3 Design Patterns** chính:

### 1️⃣ Strategy Pattern (Behavioral)
**Vị trí:** `backend/src/main/java/com/attendance/strategy/`

**Mục đích:** Tính lương linh hoạt cho 4 loại hợp đồng

**Implementation:**
- Interface: `SalaryCalculationStrategy`
- 4 concrete strategies:
  - `FixedSalaryCalculation` - Lương cố định
  - `HourlySalaryCalculation` - Theo giờ
  - `ProductBasedSalaryCalculation` - Theo sản phẩm
  - `KpiBasedSalaryCalculation` - Theo KPI

**Lợi ích:**
- ✅ Dễ thêm loại hợp đồng mới
- ✅ Tuân thủ Open/Closed Principle
- ✅ Code dễ test và maintain

### 2️⃣ Singleton Pattern (Creational)
**Vị trí:** `backend/src/main/java/com/attendance/config/ApplicationConfig.java`

**Mục đích:** Quản lý cấu hình toàn cục với 1 instance duy nhất

**Implementation:**
- Private constructor
- Static getInstance() method
- Thread-safe implementation

**Lợi ích:**
- ✅ Truy cập toàn cục
- ✅ Thread-safe
- ✅ Quản lý resource tập trung

### 3️⃣ Decorator Pattern (Structural)
**Vị trí:** `backend/src/main/java/com/attendance/decorator/`

**Mục đích:** Thêm phụ cấp, thưởng vào lương một cách linh hoạt

**Implementation:**
- Component: `SalaryComponent`
- Base: `BaseSalary`
- Decorators:
  - `TransportationAllowanceDecorator`
  - `LunchAllowanceDecorator`
  - `PerformanceBonusDecorator`
  - `OvertimeDecorator`

**Lợi ích:**
- ✅ Thêm chức năng động
- ✅ Combine nhiều decorators
- ✅ Không cần sửa code gốc

---

## 🚀 Hướng dẫn chạy

### Yêu cầu hệ thống:
- Java 17+ (hoặc IntelliJ IDEA)
- Node.js 18+
- Maven (embedded trong IntelliJ)

### Bước 1: Chạy Backend

**Cách 1: Dùng IntelliJ IDEA (Khuyến nghị)**
1. Mở IntelliJ IDEA
2. File → Open → Chọn folder `1. Source/backend`
3. Đợi Maven import dependencies
4. Mở file `AttendancePayrollSystemApplication.java`
5. Click nút Run ▶️

**Cách 2: Dùng Maven command line**
```bash
cd "1. Source/backend"
mvn spring-boot:run
```

✅ Backend chạy tại: http://localhost:8080

### Bước 2: Chạy Frontend

```bash
cd "1. Source/frontend"
npm install
npm run dev
```

✅ Frontend chạy tại: http://localhost:5173

### Bước 3: Truy cập ứng dụng

**URL:** http://localhost:5173

**Tính năng:**
- Dashboard - Thống kê real-time
- Nhân viên - Quản lý CRUD
- Chấm công - Ghi nhận giờ làm/sản phẩm
- Tính lương - Tự động theo Strategy Pattern

---

## 📊 Dữ liệu mẫu

Hệ thống có sẵn 4 nhân viên minh họa cho 4 loại hợp đồng:

| STT | Tên | Vị trí | Loại hợp đồng | Lương |
|-----|-----|--------|---------------|-------|
| 1 | Nguyễn Văn An | Developer | FIXED | 15,000,000 VNĐ |
| 2 | Trần Thị Bình | Part-time | HOURLY | 50,000 VNĐ/giờ |
| 3 | Lê Văn Cường | Production Worker | PRODUCT_BASED | 20,000 VNĐ/sản phẩm |
| 4 | Phạm Thị Dung | Sales Manager | KPI_BASED | 12M + 3M KPI |

---

## 📁 Cấu trúc chi tiết

```
NopBaiCuoiKy_AttendancePayrollSystem/
│
├── 1. Source/
│   ├── backend/                    # Spring Boot Backend
│   │   ├── src/main/java/com/attendance/
│   │   │   ├── AttendancePayrollSystemApplication.java  # Main class
│   │   │   ├── strategy/           # ⭐ Strategy Pattern
│   │   │   ├── decorator/          # ⭐ Decorator Pattern
│   │   │   ├── config/             # ⭐ Singleton Pattern
│   │   │   ├── controller/         # REST Controllers
│   │   │   ├── service/            # Business Logic
│   │   │   ├── repository/         # Data Access Layer
│   │   │   └── model/              # JPA Entities
│   │   ├── src/main/resources/
│   │   │   ├── application.properties
│   │   │   └── data.sql
│   │   └── pom.xml
│   │
│   └── frontend/                   # React Frontend
│       ├── src/
│       │   ├── pages/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── EmployeeManagement.jsx
│       │   │   ├── AttendanceManagement.jsx
│       │   │   └── PayrollManagement.jsx
│       │   ├── services/
│       │   │   └── api.js          # API calls
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
│
├── 2. ThucThi/                     # (Để trống)
│
├── 3. Database/
│   ├── data.sql                    # Dữ liệu mẫu
│   ├── application.properties      # Cấu hình DB
│   └── README_DATABASE.md          # Hướng dẫn
│
├── 4. Doc/                         # (Thêm báo cáo Word)
│
├── THONG_TIN_GITHUB.txt            # ⭐ File thông tin GitHub
├── README.md                       # File này
└── HUONG_DAN_CHAY_INTELLIJ.md     # Hướng dẫn chi tiết

```

---

## 📚 Tài liệu kèm theo

1. `THONG_TIN_GITHUB.txt` - Thông tin GitHub và hướng dẫn chi tiết
2. `HUONG_DAN_CHAY_INTELLIJ.md` - Hướng dẫn chạy trong IntelliJ IDEA
3. `3. Database/README_DATABASE.md` - Hướng dẫn về database

---

## ✅ Checklist nộp bài

- [x] Thư mục Source chứa mã nguồn backend + frontend
- [x] Thư mục Thực thi (để trống theo yêu cầu)
- [x] Thư mục Database chứa data.sql và scripts
- [x] File txt thông tin GitHub dự án
- [ ] Thư mục Doc chứa báo cáo Word (thêm thủ công)

---

## 📞 Liên hệ

**Sinh viên:** [Tên của bạn]  
**MSSV:** [MSSV của bạn]  
**Email:** [Email của bạn]  
**GitHub:** [Link GitHub repository]

---

**Made with ❤️ | Design Pattern Team | October 2025**

