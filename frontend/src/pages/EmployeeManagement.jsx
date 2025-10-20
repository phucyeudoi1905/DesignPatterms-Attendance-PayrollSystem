import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { getAllEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/api';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    contractType: 'FIXED',
    salaryBase: 0,
    hourlyRate: 0,
    productRate: 0,
    kpiBonus: 0
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      console.log('🔄 Loading employees...');
      const response = await getAllEmployees();
      console.log('📊 Received employees:', response.data.length, 'items:', response.data);
      setEmployees(response.data);
      console.log('✅ State updated with', response.data.length, 'employees');
    } catch (error) {
      console.error('❌ Error loading employees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Chuẩn hóa dữ liệu trước khi gửi
    const employeeData = {
      ...formData,
      salaryBase: parseFloat(formData.salaryBase) || 0,
      hourlyRate: parseFloat(formData.hourlyRate) || 0,
      productRate: parseFloat(formData.productRate) || 0,
      kpiBonus: parseFloat(formData.kpiBonus) || 0
    };
    
    try {
      if (editingEmployee) {
        const result = await updateEmployee(editingEmployee.id, employeeData);
        console.log('✅ Updated employee:', result.data);
      } else {
        const result = await createEmployee(employeeData);
        console.log('✅ Created employee:', result.data);
      }
      
      // Reload danh sách TRƯỚC KHI hiển thị alert
      await loadEmployees();
      console.log('✅ Reloaded employee list');
      
      setShowForm(false);
      setEditingEmployee(null);
      resetForm();
      
      // Alert sau khi đã reload xong
      alert(editingEmployee ? 'Cập nhật nhân viên thành công!' : 'Thêm nhân viên thành công!');
    } catch (error) {
      console.error('Error saving employee:', error);
      
      // Xử lý các loại lỗi khác nhau
      let errorMessage = 'Lỗi không xác định';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Lỗi validation với details
        if (errorData.details) {
          const errorDetails = Object.entries(errorData.details)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join('\n');
          errorMessage = `${errorData.error}\n\n${errorDetails}`;
        } 
        // Lỗi đơn giản
        else if (errorData.error) {
          errorMessage = errorData.error;
        }
        // Lỗi message
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Lỗi khi lưu nhân viên:\n${errorMessage}`);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      position: employee.position,
      contractType: employee.contractType,
      salaryBase: employee.salaryBase || 0,
      hourlyRate: employee.hourlyRate || 0,
      productRate: employee.productRate || 0,
      kpiBonus: employee.kpiBonus || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      try {
        await deleteEmployee(id);
        loadEmployees();
        alert('Xóa nhân viên thành công!');
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Lỗi khi xóa nhân viên: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      contractType: 'FIXED',
      salaryBase: 0,
      hourlyRate: 0,
      productRate: 0,
      kpiBonus: 0
    });
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingEmployee(null);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý Nhân viên</h1>
          <p className="mt-1 text-sm text-gray-500">
            Danh sách và quản lý thông tin nhân viên
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => {
              if (showForm) {
                handleCancelEdit();
              } else {
                setShowForm(true);
              }
            }}
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm transition-colors ${
              showForm
                ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                : 'border-transparent text-white bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {showForm ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Đóng
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Thêm nhân viên
              </>
            )}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {editingEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vị trí</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Loại hợp đồng</label>
              <select
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
              >
                <option value="FIXED">Lương cố định</option>
                <option value="HOURLY">Theo giờ</option>
                <option value="PRODUCT_BASED">Theo sản phẩm</option>
                <option value="KPI_BASED">Theo KPI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lương cơ bản
                {(formData.contractType === 'FIXED' || formData.contractType === 'KPI_BASED') && 
                  <span className="text-red-500 ml-1">*</span>
                }
              </label>
              <input
                type="number"
                name="salaryBase"
                value={formData.salaryBase}
                onChange={handleChange}
                min="0"
                step="1000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                placeholder="VD: 15000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá theo giờ
                {formData.contractType === 'HOURLY' && 
                  <span className="text-red-500 ml-1">*</span>
                }
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                min="0"
                step="1000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                placeholder="VD: 50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá theo sản phẩm
                {formData.contractType === 'PRODUCT_BASED' && 
                  <span className="text-red-500 ml-1">*</span>
                }
              </label>
              <input
                type="number"
                name="productRate"
                value={formData.productRate}
                onChange={handleChange}
                min="0"
                step="1000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                placeholder="VD: 20000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thưởng KPI
                {formData.contractType === 'KPI_BASED' && 
                  <span className="text-red-500 ml-1">*</span>
                }
              </label>
              <input
                type="number"
                name="kpiBonus"
                value={formData.kpiBonus}
                onChange={handleChange}
                min="0"
                step="1000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                placeholder="VD: 5000000"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingEmployee ? 'Cập nhật' : 'Lưu nhân viên'}
              </button>
              {editingEmployee && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 pl-6 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị trí</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại HĐ</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Lương CB</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Lương/giờ</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">L/sản phẩm</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thưởng KPI</th>
              <th className="px-3 py-3 pr-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 pl-6 pr-3 text-sm text-gray-900">{employee.id}</td>
                <td className="px-3 py-4 text-sm font-medium text-gray-900">{employee.name}</td>
                <td className="px-3 py-4 text-sm text-gray-600">{employee.position}</td>
                <td className="px-3 py-4 text-sm">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800">
                    {employee.contractType}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-gray-600 text-right">
                  {employee.salaryBase ? employee.salaryBase.toLocaleString('vi-VN') + ' ₫' : '-'}
                </td>
                <td className="px-3 py-4 text-sm text-gray-600 text-right">
                  {employee.hourlyRate ? employee.hourlyRate.toLocaleString('vi-VN') + ' ₫' : '-'}
                </td>
                <td className="px-3 py-4 text-sm text-gray-600 text-right">
                  {employee.productRate ? employee.productRate.toLocaleString('vi-VN') + ' ₫' : '-'}
                </td>
                <td className="px-3 py-4 text-sm text-gray-600 text-right">
                  {employee.kpiBonus ? employee.kpiBonus.toLocaleString('vi-VN') + ' ₫' : '-'}
                </td>
                <td className="px-3 py-4 pr-6 text-sm text-right">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-3 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeManagement;


