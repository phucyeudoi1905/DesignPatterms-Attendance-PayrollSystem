# Changelog

All notable changes to Attendance Payroll System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2025-01-18

### Added ✨
- **Professional UI Design**
  - Lucide React icons thay thế emoji
  - Grayscale minimalist color scheme
  - Border-based design thay vì shadow-heavy
  - Professional typography và spacing

- **Auto-refresh Dashboard**
  - Tự động cập nhật mỗi 30 giây
  - Hiển thị timestamp cập nhật cuối
  - Silent refresh không làm gián đoạn UX

- **Enhanced Icons**
  - Navigation: LayoutDashboard, Users, Clock, Wallet
  - Actions: Plus, Edit2, Trash2, Save, X
  - Stats: DollarSign, TrendingUp, RefreshCw

### Changed 🔄
- **Color Palette**: Chuyển từ multi-color sang grayscale
  - Primary: Gray-900
  - Secondary: Gray-600
  - Backgrounds: White, Gray-50, Gray-100
  - Borders: Gray-200

- **Navigation Bar**: 
  - Background từ indigo-600 → white
  - Active state: border-bottom thay vì background color
  - Thêm version badge

- **Buttons**: Gray-900 thay vì indigo-600
- **Table Design**: Professional headers với uppercase text
- **Form Design**: Cleaner borders và spacing

### Removed 🗑️
- Nút "Làm mới dữ liệu" thủ công (replaced by auto-refresh)
- Emoji icons (replaced by Lucide React)
- Colored shadows và gradients
- Multi-color scheme

### Fixed 🐛
- Improved error messages trong Employee và Payroll
- Better loading states với spinner icon
- Enhanced hover states

---

## [2.0.0] - 2025-01-15

### Added ✨
- **Dashboard** với real-time statistics
  - Total employees, attendances, payrolls
  - Total salary paid
  - Contract type distribution chart
  - System information panel
  - Application configuration panel

- **Singleton Pattern** - ApplicationConfig
  - Quản lý cấu hình toàn cục
  - Thread-safe implementation
  - Centralized settings management

- **Decorator Pattern** - Salary Decorators
  - TransportationAllowanceDecorator
  - LunchAllowanceDecorator
  - PerformanceBonusDecorator
  - OvertimeDecorator

- **CRUD Operations cho Employee**
  - Create new employee
  - Update employee information
  - Delete employee
  - Display full salary parameters

- **API Endpoints**
  - `GET /api/dashboard/stats`
  - `GET /api/dashboard/config`
  - `PUT /api/employees/{id}`
  - `DELETE /api/employees/{id}`

### Changed 🔄
- Enhanced UI/UX với Tailwind CSS
- Better table layout hiển thị đầy đủ thông tin
- Improved error handling và validation
- Better code organization

### Documentation 📚
- DESIGN_PATTERNS_DOCUMENTATION.md (3 patterns chi tiết)
- V2_UPGRADE_GUIDE.md
- UI_IMPROVEMENTS_SUMMARY.md

---

## [1.0.0] - 2024-12-20

### Added ✨
- **Strategy Pattern** cho tính lương
  - FixedSalaryCalculation
  - HourlySalaryCalculation
  - ProductBasedSalaryCalculation
  - KpiBasedSalaryCalculation

- **Backend**
  - Spring Boot 3.x setup
  - H2 in-memory database
  - REST API endpoints
  - Employee, Attendance, Payroll models
  - JPA repositories
  - Service layer với Strategy Pattern

- **Frontend**
  - React 18.x với Vite
  - React Router DOM
  - Tailwind CSS styling
  - Employee Management page
  - Attendance Management page
  - Payroll Management page

- **Core Features**
  - Quản lý nhân viên cơ bản
  - Chấm công với giờ vào/ra
  - Tính lương tự động theo loại hợp đồng
  - Lịch sử chấm công
  - Lịch sử lương

- **Sample Data**
  - 4 nhân viên mẫu (1 của mỗi loại hợp đồng)
  - 9 bản ghi chấm công mẫu
  - 4 bản ghi lương mẫu

### Documentation 📚
- README.md cơ bản
- QUICK_START.md
- STRATEGY_PATTERN_GUIDE.md

---

## [Unreleased]

### Planned Features 🚧
- [ ] Export reports to PDF/Excel
- [ ] Email notifications
- [ ] Advanced filtering và sorting
- [ ] Attendance calendar view
- [ ] Salary slip generation
- [ ] User authentication & authorization
- [ ] Role-based access control
- [ ] Multi-tenant support
- [ ] PostgreSQL/MySQL support
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Unit tests coverage
- [ ] Integration tests
- [ ] API documentation với Swagger

---

## Version History

- **2.1.0** - Professional UI + Auto-refresh
- **2.0.0** - Dashboard + 2 Design Patterns mới
- **1.0.0** - Initial release với Strategy Pattern

---

## Migration Guides

### From 1.0 to 2.0
- Backend: Thêm Singleton và Decorator classes
- Database: No schema changes (H2 in-memory)
- Frontend: Thêm Dashboard page và navigation
- API: Backward compatible

### From 2.0 to 2.1
- Frontend: Install `lucide-react` package
- UI: All pages updated với new design
- No breaking changes
- Auto-refresh implemented

---

## Contributors

- Design Pattern Team (2024-2025)

---

**For full documentation, see:**
- [README.md](README.md) - Overview
- [QUICK_START.md](QUICK_START.md) - Getting started
- [DESIGN_PATTERNS_DOCUMENTATION.md](DESIGN_PATTERNS_DOCUMENTATION.md) - Design patterns details

