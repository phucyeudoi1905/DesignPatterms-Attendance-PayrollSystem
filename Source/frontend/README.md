# Frontend - AttendancePayrollSystem

## React + Vite + TailwindCSS

### Cấu trúc thư mục
```
src/
├── pages/                          # React Pages/Components
│   ├── EmployeeManagement.jsx     # Employee CRUD
│   ├── AttendanceManagement.jsx   # Attendance tracking
│   └── PayrollManagement.jsx      # Salary calculation
├── services/                       # API Integration
│   └── api.js                      # Axios API calls
├── App.jsx                         # Main App with Router
├── main.jsx                        # Entry point
└── index.css                       # Tailwind imports
```

### Cài đặt và chạy

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Các trang chính

#### 1. Employee Management (`/`)
- Hiển thị danh sách nhân viên
- Form thêm nhân viên mới
- Hiển thị thông tin: ID, tên, vị trí, loại hợp đồng, lương

#### 2. Attendance Management (`/attendance`)
- Form chấm công (chọn nhân viên, giờ vào/ra, số giờ)
- Xem lịch sử chấm công theo nhân viên
- Dropdown để chọn nhân viên và xem lịch sử

#### 3. Payroll Management (`/payroll`)
- Danh sách nhân viên với nút "Tính lương"
- Tính lương tự động dựa vào Strategy Pattern
- Xem lịch sử lương đã tính theo nhân viên

### API Integration

File `src/services/api.js` chứa tất cả API calls sử dụng Axios:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Employee APIs
export const getAllEmployees = () => api.get('/employees');
export const createEmployee = (employee) => api.post('/employees', employee);

// Attendance APIs
export const createAttendance = (attendance) => api.post('/attendance', attendance);
export const getAttendanceByEmployeeId = (employeeId) => api.get(`/attendance/${employeeId}`);

// Payroll APIs
export const calculateSalary = (employeeId) => api.post(`/payroll/calculate/${employeeId}`);
export const getPayrollHistory = (employeeId) => api.get(`/payroll/${employeeId}`);
```

### Styling

Sử dụng TailwindCSS với theme mặc định:
- Primary color: Indigo (indigo-600, indigo-700)
- Success color: Green (green-600)
- Background: Gray (gray-50, gray-100)
- Modern, clean UI with shadows and rounded corners

### Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.2",
  "axios": "^1.7.7",
  "tailwindcss": "^3.4.11",
  "vite": "^5.4.7"
}
```


