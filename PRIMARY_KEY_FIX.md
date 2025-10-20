# 🔑 FIX LỖI PRIMARY KEY VIOLATION

## 🚨 Lỗi gặp phải:

```
could not execute statement [Unique index or primary key violation: 
"PRIMARY KEY ON PUBLIC.EMPLOYEE(ID)..."]
```

## 🎯 Nguyên nhân:

File `data.sql` insert employees với ID hardcode (1,2,3,4), nhưng H2 database sequence không tự động reset, nên khi tạo employee mới, nó cố dùng ID=1 (đã tồn tại) → **PRIMARY KEY VIOLATION**

## ✅ Giải pháp đã áp dụng:

Đã thêm lệnh reset sequence trong `data.sql`:

```sql
-- Sau khi insert 4 employees (ID 1-4)
ALTER TABLE employee ALTER COLUMN id RESTART WITH 5;

-- Sau khi insert 9 attendance records (ID 1-9)
ALTER TABLE attendance ALTER COLUMN id RESTART WITH 10;

-- Sau khi insert 4 payroll records (ID 1-4)
ALTER TABLE payroll ALTER COLUMN id RESTART WITH 5;
```

## 🔄 QUAN TRỌNG: Restart Backend

**Vì H2 là in-memory database, bạn PHẢI restart backend để áp dụng thay đổi:**

### Windows (PowerShell):

```powershell
# 1. Stop backend hiện tại (Ctrl+C trong terminal backend)
# 2. Restart backend
cd backend
mvn spring-boot:run
```

### Linux/Mac:

```bash
# 1. Stop backend hiện tại (Ctrl+C)
# 2. Restart backend
cd backend
mvn spring-boot:run
```

## 🧪 Test sau khi restart:

### 1. Kiểm tra backend đã khởi động:
```
Backend logs sẽ hiển thị:
- Started AttendancePayrollSystemApplication in X seconds
- Tomcat started on port(s): 8080
```

### 2. Test tạo employee mới:

1. Mở http://localhost:5173
2. Click "Thêm nhân viên"
3. Nhập thông tin:
   - **Tên:** `Nguyễn Văn Test`
   - **Vị trí:** `Tester`
   - **Loại HĐ:** `Lương cố định`
   - **Lương cơ bản:** `12000000`
4. Click "Lưu nhân viên"

### ✅ Kỳ vọng:

```
✓ Alert: "Thêm nhân viên thành công!"
✓ Employee mới xuất hiện trong danh sách với ID = 5
✓ KHÔNG có lỗi PRIMARY KEY violation
```

### ❌ Nếu vẫn lỗi:

```bash
# Xóa target directory và rebuild
cd backend
mvn clean install
mvn spring-boot:run
```

## 📊 Cấu trúc ID sau khi fix:

| Table | Sample Data IDs | Next ID | Status |
|-------|----------------|---------|--------|
| **employee** | 1, 2, 3, 4 | 5 | ✅ Fixed |
| **attendance** | 1-9 | 10 | ✅ Fixed |
| **payroll** | 1, 2, 3, 4 | 5 | ✅ Fixed |

## 🔍 Verify trong H2 Console (Optional):

1. Mở: http://localhost:8080/h2-console
2. Login:
   - **JDBC URL:** `jdbc:h2:mem:testdb`
   - **Username:** `sa`
   - **Password:** (để trống)
3. Chạy query:
   ```sql
   -- Xem employees hiện có
   SELECT * FROM employee ORDER BY id;
   
   -- Kiểm tra sequence (H2 tự quản lý)
   -- Employee mới sẽ tự động có ID = 5
   ```

## 📝 Chi tiết thay đổi:

### File: `backend/src/main/resources/data.sql`

**Trước (LỖI):**
```sql
INSERT INTO employee (id, name, ...) VALUES
(1, 'Nguyễn Văn An', ...),
(2, 'Trần Thị Bình', ...),
(3, 'Lê Văn Cường', ...),
(4, 'Phạm Thị Dung', ...);

-- Không có reset sequence
-- → Next ID vẫn là 1 → CONFLICT!
```

**Sau (FIXED):**
```sql
INSERT INTO employee (id, name, ...) VALUES
(1, 'Nguyễn Văn An', ...),
(2, 'Trần Thị Bình', ...),
(3, 'Lê Văn Cường', ...),
(4, 'Phạm Thị Dung', ...);

-- ✅ Reset sequence
ALTER TABLE employee ALTER COLUMN id RESTART WITH 5;
-- → Next ID = 5 → NO CONFLICT!
```

## 🎯 Kết luận:

✅ **Đã fix:** Thêm `ALTER TABLE ... RESTART WITH` trong data.sql  
✅ **Cần làm:** Restart backend để reload data.sql  
✅ **Kết quả:** Tạo employee mới sẽ có ID = 5, 6, 7, ... (không conflict)

---

**Ngày fix:** 2025-10-20  
**Status:** ✅ RESOLVED  
**Tác động:** H2 in-memory DB → Cần restart mỗi lần đổi data.sql

