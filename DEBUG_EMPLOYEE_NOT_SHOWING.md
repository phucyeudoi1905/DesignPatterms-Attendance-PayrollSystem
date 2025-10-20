# 🔍 DEBUG: Nhân viên mới không hiển thị

## 🎯 Vấn đề:

Thêm nhân viên thành công (có alert), nhưng không thấy trong bảng danh sách.

---

## ✅ Đã fix:

1. ✅ **Thêm console.log** để debug
2. ✅ **Thêm await** trước `loadEmployees()` - đảm bảo reload xong mới hiển thị alert
3. ✅ **Di chuyển alert** xuống cuối - tránh user dismiss alert trước khi data load

---

## 🧪 Cách test chi tiết:

### Bước 1: Mở Browser Console

1. **Chrome/Edge:** Press `F12` hoặc `Ctrl+Shift+I`
2. Click tab **Console**
3. Clear console: Click icon 🚫 hoặc `Ctrl+L`

### Bước 2: Thêm nhân viên mới

1. Mở http://localhost:5173
2. Click "Thêm nhân viên"
3. Nhập:
   - **Tên:** `Test User Debug`
   - **Vị trí:** `Tester`
   - **Loại HĐ:** `Lương cố định`
   - **Lương cơ bản:** `10000000`
4. Click "Lưu nhân viên"

### Bước 3: Xem Console Logs

**Logs bạn sẽ thấy:**

```
✅ Created employee: {id: 5, name: "Test User Debug", ...}
🔄 Loading employees...
📊 Received employees: 5 items: [{...}, {...}, {...}, {...}, {...}]
✅ State updated with 5 employees
✅ Reloaded employee list
```

**Sau đó mới hiện alert:** "Thêm nhân viên thành công!"

---

## 🔍 Phân tích các trường hợp:

### ✅ Case 1: Console hiển thị 5 employees nhưng bảng chỉ có 4

**Nguyên nhân:** React state chưa re-render  
**Giải pháp:** Hard refresh

```bash
# Trong browser:
Ctrl + Shift + R    # Windows/Linux
Cmd + Shift + R     # Mac
```

### ✅ Case 2: Console hiển thị lỗi CORS

**Logs lỗi:**
```
Access to XMLHttpRequest at 'http://localhost:8080/api/employees' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Giải pháp:** Restart backend

```bash
cd backend
mvn spring-boot:run
```

### ✅ Case 3: Console hiển thị "Received employees: 4 items"

**Nguyên nhân:** Backend chưa lưu employee hoặc sequence chưa reset  
**Giải pháp:**

1. **Kiểm tra backend logs:**
   ```
   Hibernate: insert into employee (...) values (...)
   ```

2. **Verify trong H2 Console:**
   - URL: http://localhost:8080/h2-console
   - JDBC: `jdbc:h2:mem:testdb`
   - User: `sa`, Pass: (trống)
   - Query:
     ```sql
     SELECT * FROM employee ORDER BY id DESC;
     ```

### ✅ Case 4: Console hiển thị 404 Not Found

**Logs lỗi:**
```
GET http://localhost:8080/api/employees 404 (Not Found)
```

**Nguyên nhân:** Backend không chạy hoặc sai URL  
**Giải pháp:**

1. Kiểm tra backend có chạy không:
   ```
   http://localhost:8080/api/employees
   ```
   
2. Xem backend logs có lỗi không

### ✅ Case 5: Alert hiện nhưng không có log nào

**Nguyên nhân:** Console bị filter  
**Giải pháp:** 

1. Trong Console tab, chọn filter = **"All levels"**
2. Đảm bảo không tick "Hide network messages"

---

## 🔧 Các lệnh debug hữu ích:

### Test API trực tiếp:

**1. Get all employees:**
```bash
curl http://localhost:8080/api/employees
```

**2. Create employee:**
```bash
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test API",
    "position": "Tester",
    "contractType": "FIXED",
    "salaryBase": 10000000,
    "hourlyRate": 0,
    "productRate": 0,
    "kpiBonus": 0
  }'
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Uri http://localhost:8080/api/employees -Method Get
```

---

## 🎯 Checklist kiểm tra:

- [ ] Backend đang chạy (`http://localhost:8080/api/employees` trả về JSON)
- [ ] Frontend đang chạy (`http://localhost:5173` hiển thị trang)
- [ ] Browser console không có lỗi đỏ
- [ ] Đã restart backend sau khi sửa `data.sql`
- [ ] Đã hard refresh browser (`Ctrl+Shift+R`)
- [ ] Sequence đã được reset (xem `data.sql` line 9)

---

## 🚨 Lưu ý quan trọng về H2 Database:

**H2 là in-memory database** - dữ liệu sẽ **MẤT KHI RESTART BACKEND**!

### Hiện tượng:

1. Thêm employee → Thành công, thấy trong bảng
2. Restart backend (để fix lỗi khác)
3. Refresh trang → Employee mới BIẾN MẤT, chỉ còn 4 employee ban đầu

### Giải thích:

```
Backend Start → Load data.sql → Insert 4 sample employees (ID 1-4)
    ↓
User thêm employee mới → Lưu vào RAM → ID = 5
    ↓
Backend Restart → RAM bị xóa → Load lại data.sql → Chỉ còn 4 employees
```

### Giải pháp:

**Option 1: Chấp nhận (cho demo/dev):**
- Mỗi lần restart = fresh data
- Thêm lại employees sau mỗi lần restart

**Option 2: Thêm vào data.sql (cho testing):**

Edit `backend/src/main/resources/data.sql`, thêm:

```sql
INSERT INTO employee (id, name, position, contract_type, salary_base, hourly_rate, product_rate, kpi_bonus) VALUES
(5, 'Test User Debug', 'Tester', 'FIXED', 10000000, 0, 0, 0);

ALTER TABLE employee ALTER COLUMN id RESTART WITH 6;
```

**Option 3: Dùng persistent database (cho production):**

Edit `backend/src/main/resources/application.properties`:

```properties
# Comment out H2 in-memory
# spring.datasource.url=jdbc:h2:mem:testdb

# Use H2 file-based (data persist)
spring.datasource.url=jdbc:h2:file:./data/payrolldb
spring.jpa.hibernate.ddl-auto=update
```

---

## 📊 Expected Console Output:

Khi mọi thứ hoạt động ĐÚNG:

```
🔄 Loading employees...
📊 Received employees: 4 items: [...]
✅ State updated with 4 employees

[User clicks "Thêm nhân viên" và submit]

✅ Created employee: {id: 5, name: "Test User Debug", position: "Tester", ...}
🔄 Loading employees...
📊 Received employees: 5 items: [...]
✅ State updated with 5 employees
✅ Reloaded employee list

[Alert shows: "Thêm nhân viên thành công!"]
```

Bảng sẽ hiển thị **5 employees** bao gồm employee mới.

---

## 🛠️ Nếu vẫn không work:

### Hard Reset toàn bộ:

```bash
# Stop backend (Ctrl+C)
# Stop frontend (Ctrl+C)

# Backend: Clean rebuild
cd backend
mvn clean install
mvn spring-boot:run

# Frontend: Clear cache & restart (terminal mới)
cd frontend
rm -rf node_modules/.vite
npm run dev
```

### Browser: Clear all cache

1. `Ctrl+Shift+Delete`
2. Chọn "Cached images and files"
3. Time range: "All time"
4. Click "Clear data"
5. Restart browser

---

## 📞 Nếu vẫn lỗi, cung cấp thông tin:

1. **Console logs** (screenshot hoặc copy text)
2. **Backend logs** (terminal output)
3. **Network tab** (F12 → Network → XHR)
4. **H2 Console query result:**
   ```sql
   SELECT * FROM employee ORDER BY id;
   ```

---

**Ngày tạo:** 2025-10-20  
**Status:** 🔍 Debugging Guide  
**Mục đích:** Giúp xác định nguyên nhân employee mới không hiển thị

