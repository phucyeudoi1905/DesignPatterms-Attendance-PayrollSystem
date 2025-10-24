# 📊 Thư mục Database

## Mô tả
Thư mục này chứa các file cấu hình database và dữ liệu mẫu cho hệ thống.

## Các file

### 1. `data.sql`
**Mô tả:** File SQL chứa dữ liệu mẫu ban đầu

**Nội dung:**
- Dữ liệu mẫu cho bảng `employees` (4 nhân viên với 4 loại hợp đồng)
- Tự động được load khi khởi động Spring Boot

**Các nhân viên mẫu:**
1. Nguyễn Văn An - Developer (FIXED - Lương cố định: 15,000,000 VNĐ)
2. Trần Thị Bình - Part-time (HOURLY - 50,000 VNĐ/giờ)
3. Lê Văn Cường - Production Worker (PRODUCT_BASED - 20,000 VNĐ/sản phẩm)
4. Phạm Thị Dung - Sales Manager (KPI_BASED - Base: 12,000,000 VNĐ + Thưởng KPI: 3,000,000 VNĐ)

### 2. `application.properties`
**Mô tả:** File cấu hình Spring Boot

**Cấu hình chính:**
- **Database:** H2 in-memory database
- **JDBC URL:** `jdbc:h2:mem:attendancedb`
- **Username:** sa
- **Password:** (trống)
- **Port:** 8080
- **H2 Console:** Enabled tại http://localhost:8080/h2-console

**JPA Configuration:**
```properties
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.sql.init.mode=always
```

## Cách sử dụng

### Truy cập H2 Console
Sau khi chạy backend, mở browser và truy cập:

**URL:** http://localhost:8080/h2-console

**Thông tin đăng nhập:**
- JDBC URL: `jdbc:h2:mem:attendancedb`
- Username: `sa`
- Password: (để trống)

### Kiểm tra dữ liệu

```sql
-- Xem danh sách nhân viên
SELECT * FROM employees;

-- Xem chấm công
SELECT * FROM attendance;

-- Xem lịch sử tính lương
SELECT * FROM payroll;
```

## Database Schema

### Table: employees
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary Key (Auto-increment) |
| name | VARCHAR(100) | Tên nhân viên |
| position | VARCHAR(100) | Vị trí công việc |
| contract_type | VARCHAR(20) | Loại hợp đồng (FIXED, HOURLY, PRODUCT_BASED, KPI_BASED) |
| base_salary | DECIMAL(15,2) | Lương cơ bản |
| hourly_rate | DECIMAL(15,2) | Lương theo giờ (nếu có) |
| product_rate | DECIMAL(15,2) | Lương theo sản phẩm (nếu có) |
| kpi_bonus | DECIMAL(15,2) | Thưởng KPI (nếu có) |

### Table: attendance
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary Key (Auto-increment) |
| employee_id | BIGINT | Foreign Key → employees(id) |
| date | DATE | Ngày chấm công |
| check_in | TIME | Giờ vào |
| check_out | TIME | Giờ ra |
| hours_worked | DECIMAL(5,2) | Số giờ làm việc |
| products_made | INT | Số sản phẩm (nếu có) |

### Table: payroll
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary Key (Auto-increment) |
| employee_id | BIGINT | Foreign Key → employees(id) |
| month | INT | Tháng tính lương |
| year | INT | Năm tính lương |
| total_salary | DECIMAL(15,2) | Tổng lương |
| payment_date | TIMESTAMP | Ngày tính lương |

## Ghi chú

- Database là **H2 in-memory**, dữ liệu sẽ **mất khi tắt ứng dụng**
- File `data.sql` sẽ tự động load lại khi khởi động
- Để chuyển sang MySQL/PostgreSQL: Sửa `application.properties` và thêm dependencies trong `pom.xml`

---

**Phiên bản:** 2.1  
**Ngày cập nhật:** October 2025

