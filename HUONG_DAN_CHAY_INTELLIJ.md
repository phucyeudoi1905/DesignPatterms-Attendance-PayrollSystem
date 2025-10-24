# 🚀 Hướng dẫn chạy Backend trong IntelliJ IDEA

## ⚠️ LƯU Ý QUAN TRỌNG

**BẠN PHẢI MỞ ĐÚNG FOLDER!**

- ❌ SAI: Mở folder `DesignPatterms-Attendance-PayrollSystem`
- ✅ ĐÚNG: Mở folder `DesignPatterms-Attendance-PayrollSystem\backend`

---

## 📝 Các bước chi tiết

### Bước 1: Đóng project hiện tại (nếu đã mở sai)

1. File → Close Project

### Bước 2: Mở đúng folder Backend

1. **File → Open**
2. **Navigate đến:** `D:\web\DesignPattern\DesignPatterms-Attendance-PayrollSystem\backend`
3. **Click vào folder `backend`**
4. **Click OK** hoặc **Open**
5. Chọn **"Trust Project"** nếu được hỏi
6. Chọn **"Open as Project"**

### Bước 3: Đợi Maven Import

**CỰC KỲ QUAN TRỌNG - ĐỪNG BỎ QUA BƯỚC NÀY!**

1. **Nhìn góc dưới phải của IntelliJ**
2. Bạn sẽ thấy thanh tiến trình:
   - "Indexing..."
   - "Importing Maven projects..."
   - "Downloading dependencies..."

3. **☕ ĐỢI CHO ĐẾN KHI XONG!** (2-10 phút tùy mạng)
   - Không làm gì trong lúc này
   - Chờ đến khi không còn thanh tiến trình nào

4. **Kiểm tra đã xong chưa:**
   - View → Tool Windows → Maven
   - Bạn sẽ thấy cây thư mục Maven với `attendance-payroll-system`
   - Nếu thấy Dependencies → Đã xong!

### Bước 4: Mở Main Class

**Cách 1: Dùng Search (Nhanh nhất)**
1. Nhấn **Ctrl + N** (hoặc **Ctrl + Shift + A** → gõ "Go to Class")
2. Gõ: `AttendancePayrollSystemApplication`
3. **Enter**

**Cách 2: Dùng Project Explorer**
1. Mở Project Explorer (Alt + 1)
2. Mở đường dẫn:
   ```
   backend
   ├── src
   │   └── main
   │       └── java
   │           └── com
   │               └── attendance
   │                   └── AttendancePayrollSystemApplication.java ← Click đúp vào đây
   ```

### Bước 5: Chạy Application

**Cách 1: Click nút Run (Đơn giản nhất)**

Khi file `AttendancePayrollSystemApplication.java` đã mở:

1. **Tìm dòng 7:** `public class AttendancePayrollSystemApplication {`
2. **Nhìn bên trái số dòng** → Có biểu tượng ▶️ màu xanh lá
3. **Click vào ▶️** 
4. Chọn **"Run 'AttendancePayrollSystemApplication.main()'"**

**Cách 2: Dùng phím tắt**
- Nhấn **Ctrl + Shift + F10** khi đang mở file Main class

**Cách 3: Dùng Menu**
- Run → Run 'AttendancePayrollSystemApplication'

---

## 🔧 Nếu KHÔNG thấy nút ▶️ - Tạo Run Configuration thủ công

### Các bước:

1. **Run → Edit Configurations...**

2. **Click dấu +** (góc trên bên trái)

3. **Chọn: Application**

4. **Điền thông tin:**
   ```
   Name: Backend Server
   Main class: com.attendance.AttendancePayrollSystemApplication
   Working directory: D:\web\DesignPattern\DesignPatterms-Attendance-PayrollSystem\backend
   Use classpath of module: attendance-payroll-system
   JRE: Java 17
   ```

5. **Cách điền Main class:**
   - Click vào icon **...** bên phải ô "Main class"
   - Gõ: `AttendancePayrollSystemApplication`
   - Chọn `com.attendance.AttendancePayrollSystemApplication`
   - Click OK

6. **Click Apply → OK**

7. **Chạy:**
   - Click ▶️ ở góc trên phải
   - Hoặc nhấn **Shift + F10**

---

## ✅ Kiểm tra Backend đã chạy thành công

### Trong IntelliJ Console:

Bạn sẽ thấy:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

...

2025-XX-XX HH:MM:SS.SSS  INFO 12345 --- [main] c.a.AttendancePayrollSystemApplication   : Started AttendancePayrollSystemApplication in X.XXX seconds
```

Dòng cuối cùng có chữ **"Started AttendancePayrollSystemApplication in X seconds"** → ✅ **THÀNH CÔNG!**

### Trong Browser:

1. Mở browser
2. Vào: http://localhost:8080/api/employees
3. Bạn sẽ thấy JSON với danh sách nhân viên → ✅ **Backend đang chạy!**

---

## ❌ Các lỗi thường gặp

### Lỗi 1: "Cannot resolve symbol 'SpringApplication'"

**Nguyên nhân:** Maven chưa download dependencies

**Giải pháp:**
1. Click chuột phải vào file `pom.xml`
2. Maven → Reload Project
3. Đợi cho đến khi xong

### Lỗi 2: "Project SDK is not defined"

**Giải pháp:**
1. File → Project Structure (Ctrl + Alt + Shift + S)
2. Project → SDK
3. Nếu trống → Click **+ → Download JDK**
4. Chọn Version: **17**, Vendor: **Oracle OpenJDK** hoặc **Amazon Corretto**
5. Click Download → OK

### Lỗi 3: "Port 8080 already in use"

**Nguyên nhân:** Có process khác đang dùng port 8080

**Giải pháp:**
1. Mở Terminal trong IntelliJ (Alt + F12)
2. Chạy lệnh:
   ```bash
   netstat -ano | findstr :8080
   ```
3. Tìm PID (số cuối cùng)
4. Kill process:
   ```bash
   taskkill /PID <số_PID> /F
   ```
5. Chạy lại Backend

**Hoặc đổi port:**
1. Mở file `src/main/resources/application.properties`
2. Thêm dòng:
   ```
   server.port=8081
   ```
3. Chạy lại Backend
4. URL mới: http://localhost:8081/api/employees

### Lỗi 4: Không thấy cây thư mục Maven

**Giải pháp:**
1. View → Tool Windows → Maven
2. Click icon 🔄 (Reload All Maven Projects)
3. Đợi vài phút

---

## 🎯 Sau khi Backend chạy thành công

### Chạy Frontend:

1. Mở Terminal mới (không phải trong IntelliJ)
2. Chạy lệnh:
   ```bash
   cd D:\web\DesignPattern\DesignPatterms-Attendance-PayrollSystem\frontend
   npm run dev
   ```

3. Mở browser: http://localhost:5173

### Sử dụng ứng dụng:

- **Dashboard**: Thống kê tổng quan
- **Nhân viên**: Quản lý CRUD nhân viên
- **Chấm công**: Ghi nhận giờ làm việc
- **Tính lương**: Tự động tính lương theo Strategy Pattern

---

## 📞 Vẫn gặp vấn đề?

### Checklist:

- [ ] Đã mở đúng folder `backend` (không phải folder gốc)
- [ ] Đã thấy file `pom.xml` ở root của Project Explorer
- [ ] Đã đợi Maven import xong (không còn thanh tiến trình)
- [ ] Đã cài Java 17
- [ ] Đã tìm thấy file `AttendancePayrollSystemApplication.java`
- [ ] File không có lỗi đỏ (red underline)

Nếu tất cả đã OK mà vẫn không chạy được → Screenshot màn hình IntelliJ và Console để được hỗ trợ!

---

**Made with ❤️ | IntelliJ IDEA Guide**

