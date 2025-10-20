# 🔧 TÀI LIỆU FIX LỖI 500 KHI LƯU NHÂN VIÊN

## 📋 Mục lục
- [Mô tả lỗi](#mô-tả-lỗi)
- [Nguyên nhân](#nguyên-nhân)
- [Giải pháp](#giải-pháp)
- [Cải tiến đã thực hiện](#cải-tiến-đã-thực-hiện)
- [Kiểm tra và test](#kiểm-tra-và-test)

---

## 🚨 Mô tả lỗi

**Hiện tượng:** Khi tạo hoặc cập nhật nhân viên, server trả về **HTTP 500 Internal Server Error**

**Tác động:**
- Không thể lưu nhân viên mới
- Không thể cập nhật thông tin nhân viên
- Trải nghiệm người dùng kém
- Dữ liệu không đồng bộ

---

## 🔍 Nguyên nhân

### 1. **PRIMARY KEY Violation (data.sql)**
```sql
-- Lỗi: ID được hardcode nhưng sequence không reset
INSERT INTO employee (id, ...) VALUES (1, ...), (2, ...), (3, ...), (4, ...);
-- → Khi tạo employee mới, sequence vẫn bắt đầu từ 1
-- → Conflict với ID đã tồn tại → PRIMARY KEY violation
```

**Vấn đề:** H2 database sequence không tự động update sau khi insert với ID cụ thể

### 2. **Chuyển đổi kiểu dữ liệu không đúng**
```javascript
// Frontend gửi: 
{ salaryBase: "15000000" }  // String

// Backend mong đợi:
{ salaryBase: BigDecimal }   // BigDecimal
```

**Vấn đề:** Spring Boot không thể tự động chuyển đổi string rỗng "" hoặc null thành BigDecimal

### 2. **Thiếu validation dữ liệu đầu vào**
- Không kiểm tra trường bắt buộc (name, position)
- Không validate giá trị theo loại hợp đồng
- Không kiểm tra giá trị âm

### 3. **Xử lý ngoại lệ kém**
- Controller không bắt exception cụ thể
- Lỗi trả về dạng generic 500
- Không có message rõ ràng cho frontend

### 4. **Frontend không chuẩn hóa dữ liệu**
- Gửi string từ input trực tiếp
- Không chuyển đổi thành number
- Không hiển thị trường bắt buộc

---

## ✅ Giải pháp

### **1. Database - Sequence Reset**

File: `backend/src/main/resources/data.sql`

```sql
-- Insert sample data với ID cụ thể
INSERT INTO employee (id, name, ...) VALUES
(1, 'Nguyễn Văn An', ...),
(2, 'Trần Thị Bình', ...),
(3, 'Lê Văn Cường', ...),
(4, 'Phạm Thị Dung', ...);

-- ✅ FIX: Reset sequence để bắt đầu từ 5
ALTER TABLE employee ALTER COLUMN id RESTART WITH 5;

-- Tương tự cho các bảng khác
ALTER TABLE attendance ALTER COLUMN id RESTART WITH 10;
ALTER TABLE payroll ALTER COLUMN id RESTART WITH 5;
```

**Lợi ích:**
- ✅ Tránh PRIMARY KEY violation
- ✅ Sample data giữ ID cố định (dễ test)
- ✅ Employee mới sẽ có ID từ 5 trở đi
- ✅ Không conflict với data có sẵn

### **2. Backend - Model Validation**

File: `backend/src/main/java/com/attendance/model/Employee.java`

```java
@NotBlank(message = "Tên nhân viên không được để trống")
@Size(min = 2, max = 100, message = "Tên phải có từ 2 đến 100 ký tự")
@Column(nullable = false)
private String name;

@NotNull(message = "Loại hợp đồng không được để trống")
@Enumerated(EnumType.STRING)
@Column(name = "contract_type", nullable = false)
private ContractType contractType;
```

**Lợi ích:**
- ✅ Kiểm tra dữ liệu tại tầng Model
- ✅ Message lỗi tiếng Việt rõ ràng
- ✅ Database constraints đảm bảo tính toàn vẹn

### **3. Backend - Service Layer Validation**

File: `backend/src/main/java/com/attendance/service/EmployeeService.java`

```java
private void validateAndNormalizeEmployee(Employee employee) {
    // Chuẩn hóa null thành 0
    if (employee.getSalaryBase() == null) {
        employee.setSalaryBase(BigDecimal.ZERO);
    }
    
    // Validate theo contract type
    switch (contractType) {
        case FIXED:
            if (employee.getSalaryBase().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException(
                    "Lương cơ bản phải lớn hơn 0 cho hợp đồng cố định"
                );
            }
            break;
        // ... các trường hợp khác
    }
}
```

**Lợi ích:**
- ✅ Business logic validation
- ✅ Validate theo ngữ cảnh (contract type)
- ✅ Tự động chuẩn hóa null → 0

### **4. Backend - Controller Exception Handling**

File: `backend/src/main/java/com/attendance/controller/EmployeeController.java`

```java
@PostMapping
public ResponseEntity<?> createEmployee(@Valid @RequestBody Employee employee) {
    try {
        Employee created = employeeService.createEmployee(employee);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest()
            .body(Map.of("error", e.getMessage()));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "Lỗi khi tạo nhân viên: " + e.getMessage()));
    }
}

@ExceptionHandler(MethodArgumentNotValidException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public ResponseEntity<Map<String, Object>> handleValidationExceptions(
    MethodArgumentNotValidException ex
) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
        String fieldName = ((FieldError) error).getField();
        String errorMessage = error.getDefaultMessage();
        errors.put(fieldName, errorMessage);
    });
    
    return ResponseEntity.badRequest().body(Map.of(
        "error", "Dữ liệu không hợp lệ",
        "details", errors
    ));
}
```

**Lợi ích:**
- ✅ Bắt từng loại exception riêng
- ✅ Trả về HTTP status code chính xác (400, 404, 500)
- ✅ Response structure nhất quán
- ✅ Message lỗi chi tiết cho frontend

### **5. Frontend - Data Normalization & Error Handling**

File: `frontend/src/pages/EmployeeManagement.jsx`

```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Chuẩn hóa dữ liệu: string → number
    const employeeData = {
        ...formData,
        salaryBase: parseFloat(formData.salaryBase) || 0,
        hourlyRate: parseFloat(formData.hourlyRate) || 0,
        productRate: parseFloat(formData.productRate) || 0,
        kpiBonus: parseFloat(formData.kpiBonus) || 0
    };
    
    try {
        // ... API call
        alert('Thêm nhân viên thành công!');
    } catch (error) {
        // Xử lý error response structure
        let errorMessage = 'Lỗi không xác định';
        
        if (error.response?.data) {
            const errorData = error.response.data;
            
            // Validation errors với details
            if (errorData.details) {
                const errorDetails = Object.entries(errorData.details)
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join('\n');
                errorMessage = `${errorData.error}\n\n${errorDetails}`;
            } 
            // Simple error message
            else if (errorData.error) {
                errorMessage = errorData.error;
            }
        }
        
        alert(`Lỗi khi lưu nhân viên:\n${errorMessage}`);
    }
};
```

**Lợi ích:**
- ✅ Chuyển đổi string → number trước khi gửi
- ✅ Xử lý nhiều format error response
- ✅ Hiển thị message lỗi chi tiết
- ✅ UX tốt hơn với thông báo rõ ràng

### **6. Frontend - Dynamic Required Fields**

```jsx
<label className="block text-sm font-medium text-gray-700">
    Lương cơ bản
    {(formData.contractType === 'FIXED' || 
      formData.contractType === 'KPI_BASED') && 
        <span className="text-red-500 ml-1">*</span>
    }
</label>
<input
    type="number"
    name="salaryBase"
    min="0"
    step="1000"
    placeholder="VD: 15000000"
    // ...
/>
```

**Lợi ích:**
- ✅ Hiển thị trường bắt buộc theo contract type
- ✅ Placeholder gợi ý format
- ✅ Min/step validation ở browser
- ✅ UX trực quan

---

## 🎯 Cải tiến đã thực hiện

### Backend

| Cải tiến | Trước | Sau |
|----------|-------|-----|
| **Validation** | ❌ Không có | ✅ 3 tầng validation (Model, Service, Controller) |
| **Error Response** | ❌ Generic 500 | ✅ Specific status codes (400, 404, 500) |
| **Error Messages** | ❌ Tiếng Anh generic | ✅ Tiếng Việt chi tiết |
| **Null Handling** | ❌ Crash | ✅ Auto-normalize to 0 |
| **Business Logic** | ❌ Không có | ✅ Validate theo contract type |
| **Transaction** | ❌ Không có | ✅ @Transactional |

### Frontend

| Cải tiến | Trước | Sau |
|----------|-------|-----|
| **Data Type** | ❌ Gửi string | ✅ Convert to number |
| **Error Display** | ❌ Simple alert | ✅ Detailed error parsing |
| **Required Fields** | ❌ Static | ✅ Dynamic theo contract type |
| **Input Validation** | ❌ Không có | ✅ Min, step, placeholder |
| **User Feedback** | ❌ Lỗi không rõ | ✅ Message cụ thể |

---

## 🧪 Kiểm tra và Test

### Test Case 1: Tạo nhân viên hợp lệ

**Input:**
```json
{
  "name": "Nguyễn Văn A",
  "position": "Developer",
  "contractType": "FIXED",
  "salaryBase": 15000000,
  "hourlyRate": 0,
  "productRate": 0,
  "kpiBonus": 0
}
```

**Expected:** ✅ Status 201, employee created

### Test Case 2: Thiếu tên nhân viên

**Input:**
```json
{
  "name": "",
  "position": "Developer",
  "contractType": "FIXED"
}
```

**Expected:** ❌ Status 400
```json
{
  "error": "Dữ liệu không hợp lệ",
  "details": {
    "name": "Tên nhân viên không được để trống"
  }
}
```

### Test Case 3: FIXED contract thiếu salary base

**Input:**
```json
{
  "name": "Nguyễn Văn B",
  "position": "Manager",
  "contractType": "FIXED",
  "salaryBase": 0
}
```

**Expected:** ❌ Status 400
```json
{
  "error": "Lương cơ bản phải lớn hơn 0 cho hợp đồng cố định"
}
```

### Test Case 4: Giá trị âm

**Input:**
```json
{
  "name": "Nguyễn Văn C",
  "position": "Staff",
  "contractType": "HOURLY",
  "hourlyRate": -50000
}
```

**Expected:** ❌ Status 400
```json
{
  "error": "Các giá trị lương không được âm"
}
```

### Test Case 5: KPI contract đầy đủ

**Input:**
```json
{
  "name": "Phạm Thị D",
  "position": "Sales Manager",
  "contractType": "KPI_BASED",
  "salaryBase": 10000000,
  "kpiBonus": 5000000
}
```

**Expected:** ✅ Status 201, employee created

---

## 📊 Luồng xử lý mới

```
Frontend                    Backend
   |                           |
   |--[1] User submit form---->|
   |                           |
   |  [2] Convert to number    |
   |  parseFloat() or 0        |
   |                           |
   |--[3] POST /api/employees->|
   |                           |
   |                    [4] @Valid annotation
   |                    checks Model constraints
   |                           |
   |                    [5] Service validation
   |                    - Normalize null → 0
   |                    - Business rules
   |                    - Contract type checks
   |                           |
   |                    [6] Save to DB
   |                           |
   |<--[7] Success response----|
   |    Status 201             |
   |    Employee object        |
   |                           |
   |  [8] Show success alert   |
   |  Reload employee list     |
   |                           |

Error Flow:
   |                           |
   |                    [E1] Validation fails
   |                           |
   |<--[E2] Error response-----|
   |    Status 400/500         |
   |    { error, details }     |
   |                           |
   |  [E3] Parse error         |
   |  Show detailed message    |
```

---

## 🚀 Cách build và chạy

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend chạy tại: `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

---

## 📝 Ghi chú quan trọng

1. **Validation Dependency:** Spring Boot Validation đã có trong `pom.xml`
2. **Database:** H2 in-memory, data reset mỗi lần restart
3. **CORS:** Configured cho localhost:5173 và localhost:3000
4. **Transaction:** Service methods có @Transactional
5. **Error Format:** Consistent JSON response structure

---

## 🔗 Files đã thay đổi

1. ✅ `backend/src/main/resources/data.sql` ← **FIX PRIMARY KEY**
2. ✅ `backend/src/main/java/com/attendance/model/Employee.java`
3. ✅ `backend/src/main/java/com/attendance/controller/EmployeeController.java`
4. ✅ `backend/src/main/java/com/attendance/service/EmployeeService.java`
5. ✅ `frontend/src/pages/EmployeeManagement.jsx`
6. ✅ `ERROR_FIX_DOCUMENTATION.md` (file này)
7. ✅ `QUICK_FIX_SUMMARY.md`

---

## 📞 Hỗ trợ

Nếu vẫn gặp lỗi 500, kiểm tra:

1. **Console logs:** Check browser console và backend logs
2. **Database:** Verify H2 console at `http://localhost:8080/h2-console`
3. **Dependencies:** Ensure `spring-boot-starter-validation` exists
4. **Port conflicts:** Backend:8080, Frontend:5173
5. **CORS:** Check if origins match

---

**Tài liệu tạo ngày:** 2025-10-20  
**Phiên bản:** 1.0.0  
**Trạng thái:** ✅ Hoàn thành

