import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee APIs
export const getAllEmployees = () => api.get('/employees');
export const createEmployee = (employee) => api.post('/employees', employee);
export const getEmployeeById = (id) => api.get(`/employees/${id}`);
export const updateEmployee = (id, employee) => api.put(`/employees/${id}`, employee);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// Attendance APIs
export const createAttendance = (attendance) => api.post('/attendance', attendance);
export const getAttendanceByEmployeeId = (employeeId) => api.get(`/attendance/${employeeId}`);
export const getAllAttendances = () => api.get('/attendance');

// Payroll APIs
export const calculateSalary = (employeeId) => api.post(`/payroll/calculate/${employeeId}`);
export const getPayrollHistory = (employeeId) => api.get(`/payroll/${employeeId}`);

// Dashboard APIs
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getApplicationConfig = () => api.get('/dashboard/config');

export default api;


