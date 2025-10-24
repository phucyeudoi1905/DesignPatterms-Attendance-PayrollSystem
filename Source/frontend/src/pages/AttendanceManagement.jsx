import React, { useState, useEffect } from 'react';
import { getAllEmployees } from '../services/api';
import { createAttendance, getAttendanceByEmployeeId } from '../services/api';

function AttendanceManagement() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [attendances, setAttendances] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    checkIn: '',
    checkOut: '',
    workingHours: 0
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await getAllEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadAttendances = async (employeeId) => {
    try {
      const response = await getAttendanceByEmployeeId(employeeId);
      setAttendances(response.data);
    } catch (error) {
      console.error('Error loading attendances:', error);
    }
  };

  const handleEmployeeSelect = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployeeId(employeeId);
    if (employeeId) {
      loadAttendances(employeeId);
    } else {
      setAttendances([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAttendance(formData);
      setShowForm(false);
      if (selectedEmployeeId) {
        loadAttendances(selectedEmployeeId);
      }
      setFormData({
        employeeId: '',
        checkIn: '',
        checkOut: '',
        workingHours: 0
      });
    } catch (error) {
      console.error('Error creating attendance:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Chấm công</h1>
          <p className="mt-2 text-sm text-gray-700">
            Chấm công và xem lịch sử chấm công của nhân viên
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowForm(!showForm)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            {showForm ? 'Đóng' : 'Chấm công'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Chấm công mới</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nhân viên</label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
              >
                <option value="">Chọn nhân viên</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Số giờ/sản phẩm</label>
              <input
                type="number"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Giờ vào</label>
              <input
                type="datetime-local"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Giờ ra</label>
              <input
                type="datetime-local"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Lưu chấm công
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Lịch sử chấm công</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Chọn nhân viên</label>
          <select
            value={selectedEmployeeId}
            onChange={handleEmployeeSelect}
            className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
          >
            <option value="">-- Chọn nhân viên --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
            ))}
          </select>
        </div>

        {attendances.length > 0 && (
          <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Giờ vào</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Giờ ra</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Số giờ/SP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {attendances.map((attendance) => (
                  <tr key={attendance.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{attendance.id}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDateTime(attendance.checkIn)}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDateTime(attendance.checkOut)}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{attendance.workingHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedEmployeeId && attendances.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Chưa có dữ liệu chấm công cho nhân viên này
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceManagement;


