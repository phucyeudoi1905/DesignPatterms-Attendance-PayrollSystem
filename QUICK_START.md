# 🚀 Quick Start Guide - AttendancePayrollSystem

## Hướng dẫn chạy nhanh dự án

### Bước 1: Clone hoặc mở project
```bash
cd AttendancePayrollSystem
```

### Bước 2: Chạy Backend (Terminal 1)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

✅ Backend đang chạy tại: http://localhost:8080  
✅ H2 Console: http://localhost:8080/h2-console

**Thông tin đăng nhập H2:**
- JDBC URL: `jdbc:h2:mem:attendancedb`
- Username: `sa`
- Password: (để trống)

### Bước 3: Chạy Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend đang chạy tại: http://localhost:5173

### Bước 4: Truy cập ứng dụng

Mở trình duyệt và truy cập: **http://localhost:5173**

## 📱 Sử dụng ứng dụng

### 1. Quản lý Nhân viên
- Click tab "Nhân viên"
- Click "Thêm nhân viên" để tạo nhân viên mới
- Điền thông tin và chọn loại hợp đồng (FIXED, HOURLY, PRODUCT_BASED, KPI_BASED)
- Click "Lưu nhân viên"

### 2. Chấm công
- Click tab "Chấm công"
- Click "Chấm công" để thêm bản ghi mới
- Chọn nhân viên, nhập giờ vào/ra, số giờ làm việc
- Click "Lưu chấm công"
- Chọn nhân viên từ dropdown để xem lịch sử chấm công

### 3. Tính lương
- Click tab "Tính lương"
- Click nút "Tính lương" ở nhân viên muốn tính
- Hệ thống tự động tính lương dựa vào Strategy Pattern
- Chọn nhân viên từ dropdown để xem lịch sử lương

## 🎯 Demo với dữ liệu có sẵn

Hệ thống đã có sẵn 4 nhân viên mẫu:

1. **Nguyễn Văn An** - Developer (FIXED)
2. **Trần Thị Bình** - Part-time (HOURLY)
3. **Lê Văn Cường** - Production Worker (PRODUCT_BASED)
4. **Phạm Thị Dung** - Sales Manager (KPI_BASED)

Bạn có thể thử tính lương ngay cho các nhân viên này!

## 🔧 Kiểm tra API trực tiếp

### Với cURL:
```bash
# Get all employees
curl http://localhost:8080/api/employees

# Calculate salary for employee 1
curl -X POST http://localhost:8080/api/payroll/calculate/1

# Get payroll history for employee 1
curl http://localhost:8080/api/payroll/1
```

### Với Postman:
Import base URL: `http://localhost:8080/api`

## ❓ Troubleshooting

### Backend không chạy?
- Kiểm tra Java version: `java -version` (cần Java 17+)
- Kiểm tra Maven: `mvn -version`
- Kiểm tra port 8080 có bị chiếm: `netstat -ano | findstr :8080`

### Frontend không chạy?
- Kiểm tra Node version: `node -v` (cần Node 18+)
- Xóa node_modules và cài lại: `rm -rf node_modules && npm install`
- Kiểm tra port 5173: `netstat -ano | findstr :5173`

### API không kết nối?
- Kiểm tra backend đã chạy chưa
- Kiểm tra CORS trong application.properties
- Kiểm tra API base URL trong frontend/src/services/api.js

## 📚 Tài liệu thêm

- [README.md](README.md) - Tài liệu chính
- [backend/README.md](backend/README.md) - Tài liệu Backend
- [frontend/README.md](frontend/README.md) - Tài liệu Frontend

---

**Chúc bạn code vui vẻ! 🎉**


