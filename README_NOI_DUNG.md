# 📦 NỘI DUNG BÀI NỘP CUỐI KỲ

**Đề tài:** Attendance Payroll System - Hệ thống Quản lý Chấm công và Tính lương

**Sinh viên:** MSSV_Hoten_TenDeTai_MTK

---

## 📂 CẤU TRÚC THỦ MỤC

```
NopBaiCuoiKy_AttendancePayrollSystem/
│
├── 📁 1. Source/                           ⭐ MÃ NGUỒN CHƯƠNG TRÌNH
│   ├── backend/                            - Spring Boot Backend (Java 17)
│   │   ├── src/main/java/com/attendance/
│   │   │   ├── strategy/                   # Strategy Pattern
│   │   │   ├── decorator/                  # Decorator Pattern  
│   │   │   ├── config/                     # Singleton Pattern
│   │   │   ├── controller/                 # REST Controllers
│   │   │   ├── service/                    # Business Logic
│   │   │   ├── repository/                 # Data Access
│   │   │   └── model/                      # JPA Entities
│   │   ├── src/main/resources/
│   │   │   ├── application.properties
│   │   │   └── data.sql
│   │   └── pom.xml
│   │
│   └── frontend/                           - React Frontend (React 18)
│       ├── src/
│       │   ├── pages/                      # Dashboard, Employee, Attendance, Payroll
│       │   ├── services/                   # API Integration
│       │   └── App.jsx
│       └── package.json
│
├── 📁 2. ThucThi/                          ⭐ FILE TỰ CHẠY (Để trống)
│   └── (Không cần file tự chạy theo yêu cầu)
│
├── 📁 3. Database/                         ⭐ DATABASE VÀ SCRIPT
│   ├── data.sql                            - Dữ liệu mẫu (4 nhân viên)
│   ├── application.properties              - Cấu hình H2 Database
│   └── README_DATABASE.md                  - Hướng dẫn chi tiết
│
├── 📁 4. Doc/                              ⭐ BÁO CÁO ĐỒ ÁN
│   ├── README_DOC.txt                      - Hướng dẫn nội dung báo cáo
│   └── [Thêm file Word báo cáo tại đây]
│
├── 📄 THONG_TIN_GITHUB.txt                 ⭐ THÔNG TIN GITHUB DỰ ÁN
│
├── 📄 README.md                            📖 Hướng dẫn tổng quan bài nộp
├── 📄 README_NOI_DUNG.md                   📖 File này (Danh mục nội dung)
├── 📄 HUONG_DAN_CHAY_INTELLIJ.md          📖 Chi tiết chạy trong IntelliJ
├── 📄 QUICK_START.md                       📖 Hướng dẫn khởi động nhanh
├── 📄 DESIGN_PATTERNS_EXPLAINED.md         📖 Giải thích Design Patterns
├── 📄 DESIGN_PATTERNS_DOCUMENTATION.md     📖 Tài liệu kỹ thuật patterns
└── 📄 README_PROJECT.md                    📖 README gốc của project
```

---

## 🎯 DESIGN PATTERNS ÁP DỤNG

### 1️⃣ Strategy Pattern (Behavioral)
**File:** `1. Source/backend/src/main/java/com/attendance/strategy/`

**Mục đích:** Tính lương linh hoạt cho 4 loại hợp đồng khác nhau

**Các class:**
- `SalaryCalculationStrategy.java` (Interface)
- `FixedSalaryCalculation.java` - Lương cố định
- `HourlySalaryCalculation.java` - Lương theo giờ
- `ProductBasedSalaryCalculation.java` - Lương theo sản phẩm
- `KpiBasedSalaryCalculation.java` - Lương theo KPI

### 2️⃣ Singleton Pattern (Creational)
**File:** `1. Source/backend/src/main/java/com/attendance/config/ApplicationConfig.java`

**Mục đích:** Quản lý cấu hình toàn cục với 1 instance duy nhất

**Đặc điểm:**
- Private constructor
- Static getInstance() method
- Thread-safe implementation

### 3️⃣ Decorator Pattern (Structural)
**File:** `1. Source/backend/src/main/java/com/attendance/decorator/`

**Mục đích:** Thêm phụ cấp, thưởng vào lương một cách linh hoạt

**Các class:**
- `SalaryComponent.java` (Interface)
- `BaseSalary.java` (Base component)
- `TransportationAllowanceDecorator.java` - Phụ cấp xe
- `LunchAllowanceDecorator.java` - Phụ cấp ăn trưa
- `PerformanceBonusDecorator.java` - Thưởng hiệu suất
- `OvertimeDecorator.java` - Phụ cấp làm thêm giờ

---

## 🚀 HƯỚNG DẪN CHẠY

### ✅ Bước 1: Chạy Backend

**Cách 1: Dùng IntelliJ IDEA (Khuyến nghị)**
```
1. Mở IntelliJ IDEA
2. File → Open → Chọn: "1. Source/backend"
3. Đợi Maven import dependencies (2-5 phút)
4. Mở: src/main/java/com/attendance/AttendancePayrollSystemApplication.java
5. Click nút Run ▶️
```

**Cách 2: Dùng Maven Command**
```bash
cd "1. Source/backend"
mvn spring-boot:run
```

✅ **Backend chạy tại:** http://localhost:8080

### ✅ Bước 2: Chạy Frontend

```bash
cd "1. Source/frontend"
npm install
npm run dev
```

✅ **Frontend chạy tại:** http://localhost:5173

### ✅ Bước 3: Truy cập H2 Database Console

**URL:** http://localhost:8080/h2-console

**Thông tin đăng nhập:**
- JDBC URL: `jdbc:h2:mem:attendancedb`
- Username: `sa`
- Password: (để trống)

---

## 📊 DỮ LIỆU MẪU

Hệ thống có sẵn **4 nhân viên** minh họa 4 loại hợp đồng:

| ID | Tên | Vị trí | Loại hợp đồng | Lương |
|----|-----|--------|---------------|-------|
| 1 | Nguyễn Văn An | Developer | FIXED | 15,000,000 VNĐ |
| 2 | Trần Thị Bình | Part-time | HOURLY | 50,000 VNĐ/giờ |
| 3 | Lê Văn Cường | Production Worker | PRODUCT_BASED | 20,000 VNĐ/sản phẩm |
| 4 | Phạm Thị Dung | Sales Manager | KPI_BASED | 12M + 3M KPI |

---

## ✨ TÍNH NĂNG CHÍNH

1. **Dashboard** - Thống kê real-time, auto-refresh 30s
2. **Quản lý Nhân viên** - CRUD operations, 4 loại hợp đồng
3. **Chấm công** - Ghi nhận giờ vào/ra, số giờ làm, số sản phẩm
4. **Tính lương** - Tự động tính theo Strategy Pattern

---

## 📚 TÀI LIỆU THAM KHẢO

### Trong thư mục này:

1. **README.md** - Hướng dẫn tổng quan bài nộp
2. **README_NOI_DUNG.md** (File này) - Danh mục nội dung chi tiết
3. **HUONG_DAN_CHAY_INTELLIJ.md** - Hướng dẫn chạy trong IntelliJ IDEA
4. **QUICK_START.md** - Hướng dẫn khởi động nhanh
5. **DESIGN_PATTERNS_EXPLAINED.md** - Giải thích WHY & HOW áp dụng patterns
6. **DESIGN_PATTERNS_DOCUMENTATION.md** - Tài liệu kỹ thuật chi tiết
7. **THONG_TIN_GITHUB.txt** - Thông tin GitHub và API endpoints
8. **3. Database/README_DATABASE.md** - Hướng dẫn về database
9. **4. Doc/README_DOC.txt** - Hướng dẫn viết báo cáo

---

## ✅ CHECKLIST NỘP BÀI

- [x] **1. Source** - Mã nguồn backend + frontend (clean: không có node_modules, target)
- [x] **2. ThucThi** - Để trống theo yêu cầu
- [x] **3. Database** - data.sql + application.properties + README
- [x] **4. Doc** - Thư mục để thêm báo cáo Word
- [x] **File thông tin GitHub** - THONG_TIN_GITHUB.txt
- [x] **Tài liệu đầy đủ** - Các file README và hướng dẫn

### ⚠️ VIỆC CÒN LẠI:

1. ✏️ **Thêm báo cáo Word** vào thư mục `4. Doc/`
2. ✏️ **Cập nhật thông tin cá nhân** trong:
   - `THONG_TIN_GITHUB.txt`
   - `README.md`
   - `README_NOI_DUNG.md` (file này)

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG

### Backend:
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database (in-memory)
- Maven

### Frontend:
- React 18.x
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React Icons
- Vite

---

## 📞 THÔNG TIN LIÊN HỆ

**Sinh viên:** [Tên của bạn]  
**MSSV:** [MSSV của bạn]  
**Lớp:** [Lớp của bạn]  
**Email:** [Email của bạn]  
**GitHub:** [Link repository]

---

## 🎓 GHI CHÚ CHO GIẢNG VIÊN

### Điểm nổi bật của dự án:

1. **Áp dụng đầy đủ 3 Design Patterns:**
   - Strategy Pattern cho tính lương linh hoạt
   - Singleton Pattern cho quản lý cấu hình
   - Decorator Pattern cho phụ cấp và thưởng

2. **Fullstack hoàn chỉnh:**
   - Backend RESTful API với Spring Boot
   - Frontend SPA với React
   - Database H2 với dữ liệu mẫu

3. **UI/UX chuyên nghiệp:**
   - Minimalist design với Tailwind CSS
   - Auto-refresh dashboard
   - Responsive và modern

4. **Code quality:**
   - Clean code, well-organized
   - Separation of concerns
   - SOLID principles

---

**Made with ❤️ | Design Pattern Team | October 2025**

