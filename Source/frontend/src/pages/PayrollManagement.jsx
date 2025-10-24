import React, { useState, useEffect } from 'react';
import { getAllEmployees, calculateSalary, getPayrollHistory } from '../services/api';

function PayrollManagement() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [calculatingId, setCalculatingId] = useState(null);
  const [message, setMessage] = useState('');

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

  const loadPayrollHistory = async (employeeId) => {
    try {
      const response = await getPayrollHistory(employeeId);
      setPayrollHistory(response.data);
    } catch (error) {
      console.error('Error loading payroll history:', error);
    }
  };

  const handleEmployeeSelect = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployeeId(employeeId);
    if (employeeId) {
      loadPayrollHistory(employeeId);
    } else {
      setPayrollHistory([]);
    }
  };

  const handleCalculateSalary = async (employeeId) => {
    setCalculatingId(employeeId);
    setMessage('');
    try {
      console.log('🔄 Đang tính lương cho nhân viên ID:', employeeId);
      const response = await calculateSalary(employeeId);
      console.log('✅ Kết quả:', response.data);
      setMessage(`✅ Tính lương thành công! Lương: ${response.data.salary.toLocaleString('vi-VN')} VNĐ`);
      if (selectedEmployeeId === employeeId.toString()) {
        loadPayrollHistory(employeeId);
      }
    } catch (error) {
      console.error('❌ Lỗi khi tính lương:', error);
      let errorMessage = '❌ Có lỗi xảy ra khi tính lương';
      
      if (error.response) {
        // Server trả về lỗi
        console.error('Server error:', error.response.data);
        errorMessage = `❌ Lỗi: ${error.response.data.message || error.response.data || 'Lỗi từ server'}`;
      } else if (error.request) {
        // Request được gửi nhưng không nhận được response
        console.error('No response:', error.request);
        errorMessage = '❌ Không thể kết nối đến server. Vui lòng kiểm tra backend!';
      } else {
        // Lỗi khác
        console.error('Error:', error.message);
        errorMessage = `❌ Lỗi: ${error.message}`;
      }
      
      setMessage(errorMessage);
      alert(errorMessage); // Hiển thị popup để dễ nhìn thấy
    } finally {
      setCalculatingId(null);
      setTimeout(() => setMessage(''), 10000); // Tăng thời gian hiển thị lên 10s
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getContractTypeName = (type) => {
    const types = {
      FIXED: 'Lương cố định',
      HOURLY: 'Theo giờ',
      PRODUCT_BASED: 'Theo sản phẩm',
      KPI_BASED: 'Theo KPI'
    };
    return types[type] || type;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Tính lương</h1>
          <p className="mt-2 text-sm text-gray-700">
            Tính lương và xem lịch sử lương của nhân viên
          </p>
        </div>
      </div>

      {message && (
        <div className={`mt-4 p-4 rounded-md ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Tính lương cho nhân viên</h2>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tên</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Vị trí</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Loại HĐ</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{employee.id}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{employee.name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.position}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-blue-100 text-blue-800">
                      {getContractTypeName(employee.contractType)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <button
                      onClick={() => handleCalculateSalary(employee.id)}
                      disabled={calculatingId === employee.id}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:bg-gray-400"
                    >
                      {calculatingId === employee.id ? 'Đang tính...' : 'Tính lương'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Lịch sử lương</h2>
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

        {payrollHistory.length > 0 && (
          <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Lương</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Loại tính</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {payrollHistory.map((payroll) => (
                  <tr key={payroll.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{payroll.id}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-green-600">
                      {payroll.salary.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-purple-100 text-purple-800">
                        {getContractTypeName(payroll.calculationType)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDateTime(payroll.createdDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedEmployeeId && payrollHistory.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Chưa có lịch sử lương cho nhân viên này
          </div>
        )}
      </div>
    </div>
  );
}

export default PayrollManagement;


