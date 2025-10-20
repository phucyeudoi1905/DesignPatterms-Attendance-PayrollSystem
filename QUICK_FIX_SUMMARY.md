# ⚡ HƯỚNG DẪN NHANH - FIX LỖI 500 KHI LƯU NHÂN VIÊN

## 🎯 Tóm tắt

**Vấn đề:** Lỗi 500 khi tạo/cập nhật nhân viên  
**Nguyên nhân:** Chuyển đổi kiểu dữ liệu, thiếu validation  
**Giải pháp:** 3-layer validation + error handling + data normalization  

---

## ✅ Đã fix

### Database (data.sql)

0. **Sequence Reset** (`data.sql`)
   - ✅ Reset ID sequence sau khi insert sample data
   - ✅ Tránh lỗi PRIMARY KEY violation khi tạo mới

### Backend (Java Spring Boot)

1. **Model Validation** (`Employee.java`)
   - ✅ Thêm `@NotBlank`, `@NotNull`, `@Size`
   - ✅ Message lỗi tiếng Việt

2. **Service Validation** (`EmployeeService.java`)
   - ✅ Normalize null → 0
   - ✅ Validate theo contract type
   - ✅ Business rules checking

3. **Controller Error Handling** (`EmployeeController.java`)
   - ✅ Try-catch với specific exceptions
   - ✅ Return đúng HTTP status (400, 404, 500)
   - ✅ `@ExceptionHandler` cho validation errors

### Frontend (React)

4. **Data Normalization** (`EmployeeManagement.jsx`)
   - ✅ Convert string → number: `parseFloat() || 0`
   - ✅ Parse error response structure
   - ✅ Hiển thị error chi tiết

5. **UI Improvements**
   - ✅ Dynamic required field markers (*)
   - ✅ Placeholder gợi ý
   - ✅ Min/step validation

---

## 🧪 Test nhanh

### 1. Khởi động ứng dụng

**Backend:**
```bash
cd backend
mvn spring-boot:run
```
→ Chạy tại: http://localhost:8080

**Frontend:**
```bash
cd frontend
npm run dev
```
→ Chạy tại: http://localhost:5173

### 2. Test Cases

#### ✅ Test 1: Tạo nhân viên FIXED salary hợp lệ
1. Mở http://localhost:5173
2. Click "Thêm nhân viên"
3. Nhập:
   - Tên: `Nguyễn Văn Test`
   - Vị trí: `Developer`
   - Loại HĐ: `Lương cố định`
   - Lương cơ bản: `15000000` ← Bắt buộc (*)
4. Click "Lưu nhân viên"
5. **Kỳ vọng:** ✅ "Thêm nhân viên thành công!"

#### ❌ Test 2: Tạo nhân viên thiếu tên
1. Click "Thêm nhân viên"
2. Để trống Tên
3. Nhập Vị trí: `Manager`
4. Click "Lưu"
5. **Kỳ vọng:** ❌ Lỗi: "Tên nhân viên không được để trống"

#### ❌ Test 3: FIXED contract thiếu lương cơ bản
1. Click "Thêm nhân viên"
2. Tên: `Test User`
3. Vị trí: `Staff`
4. Loại HĐ: `Lương cố định`
5. Lương cơ bản: `0` hoặc để trống
6. Click "Lưu"
7. **Kỳ vọng:** ❌ Lỗi: "Lương cơ bản phải lớn hơn 0 cho hợp đồng cố định"

#### ✅ Test 4: Tạo nhân viên HOURLY hợp lệ
1. Click "Thêm nhân viên"
2. Tên: `Trần Thị B`
3. Vị trí: `Part-time`
4. Loại HĐ: `Theo giờ`
5. Giá theo giờ: `50000` ← Bắt buộc (*)
6. Click "Lưu"
7. **Kỳ vọng:** ✅ Success

#### ❌ Test 5: Giá trị âm
1. Thử nhập số âm vào bất kỳ trường nào
2. **Kỳ vọng:** ❌ Browser validation hoặc error từ backend

---

## 📊 Validation Rules

| Contract Type | Required Fields |
|---------------|-----------------|
| **FIXED** | name, position, salaryBase > 0 |
| **HOURLY** | name, position, hourlyRate > 0 |
| **PRODUCT_BASED** | name, position, productRate > 0 |
| **KPI_BASED** | name, position, salaryBase > 0, kpiBonus > 0 |

---

## 🔍 Kiểm tra response

### Success Response (201)
```json
{
  "id": 5,
  "name": "Nguyễn Văn Test",
  "position": "Developer",
  "contractType": "FIXED",
  "salaryBase": 15000000,
  "hourlyRate": 0,
  "productRate": 0,
  "kpiBonus": 0
}
```

### Error Response - Validation (400)
```json
{
  "error": "Dữ liệu không hợp lệ",
  "details": {
    "name": "Tên nhân viên không được để trống",
    "position": "Vị trí không được để trống"
  }
}
```

### Error Response - Business Rule (400)
```json
{
  "error": "Lương cơ bản phải lớn hơn 0 cho hợp đồng cố định"
}
```

### Error Response - Not Found (404)
```json
{
  "error": "Không tìm thấy nhân viên với ID: 999"
}
```

---

## 📂 Files đã thay đổi

```
backend/src/main/resources/
└── data.sql                               ← Reset sequences (FIX PRIMARY KEY)

backend/src/main/java/com/attendance/
├── model/Employee.java                    ← Added validation annotations
├── controller/EmployeeController.java     ← Added error handling
└── service/EmployeeService.java           ← Added business validation

frontend/src/pages/
└── EmployeeManagement.jsx                 ← Data normalization & error handling
```

---

## 🐛 Nếu vẫn gặp lỗi

### Lỗi compile backend
```bash
cd backend
mvn clean install -U
```

### Lỗi frontend
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Check logs
- **Backend:** Console output trong terminal
- **Frontend:** Browser DevTools → Console tab → Network tab

### Database H2
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- User: `sa`
- Password: (để trống)

---

## 📝 Notes

- ✅ Tất cả validation message đều tiếng Việt
- ✅ Frontend tự động convert string → number
- ✅ Backend normalize null → 0
- ✅ HTTP status codes chính xác
- ✅ Transaction rollback nếu lỗi
- ✅ CORS configured cho localhost

---

## 📖 Tài liệu đầy đủ

Xem chi tiết: **ERROR_FIX_DOCUMENTATION.md**

---

**Status:** ✅ HOÀN THÀNH  
**Date:** 2025-10-20  
**Test:** PASSED ✓

