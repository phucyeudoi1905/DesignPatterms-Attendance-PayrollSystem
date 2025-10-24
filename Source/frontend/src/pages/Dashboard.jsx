import React, { useState, useEffect } from 'react';
import { getDashboardStats, getApplicationConfig } from '../services/api';
import { Users, Clock, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadDashboard();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      loadDashboard(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [statsResponse, configResponse] = await Promise.all([
        getDashboardStats(),
        getApplicationConfig()
      ]);
      setStats(statsResponse.data);
      setConfig(configResponse.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatMoney = (amount) => {
    return amount ? amount.toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
          <div className="text-sm text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  const contractData = [
    { name: 'FIXED', count: stats?.fixedContractCount || 0, color: 'bg-blue-500' },
    { name: 'HOURLY', count: stats?.hourlyContractCount || 0, color: 'bg-green-500' },
    { name: 'PRODUCT', count: stats?.productBasedContractCount || 0, color: 'bg-purple-500' },
    { name: 'KPI', count: stats?.kpiBasedContractCount || 0, color: 'bg-orange-500' }
  ];

  const maxCount = Math.max(...contractData.map(d => d.count), 1);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tổng quan hệ thống quản lý nhân viên và lương
          </p>
        </div>
        <div className="text-xs text-gray-400 flex items-center space-x-2">
          <Clock className="w-3 h-3" />
          <span>Cập nhật: {lastUpdate.toLocaleTimeString('vi-VN')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Employees */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {stats?.totalEmployees || 0}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Total Attendances */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lượt chấm công</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {stats?.totalAttendances || 0}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Total Payrolls */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lượt tính lương</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {stats?.totalPayrolls || 0}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Total Salary Paid */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng lương đã chi</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {formatMoney(stats?.totalSalaryPaid)}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Type Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">
            Phân loại hợp đồng
          </h2>
          <div className="space-y-4">
            {contractData.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-sm text-gray-600">{item.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gray-700 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">
            Thông tin hệ thống
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Tên ứng dụng</span>
              <span className="text-sm font-medium text-gray-900">
                {config?.['app.name']}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Phiên bản</span>
              <span className="text-sm font-medium text-gray-900">
                {stats?.appVersion}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Thời gian hoạt động</span>
              <span className="text-sm font-medium text-gray-900">
                {formatUptime(stats?.uptimeInSeconds || 0)}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-sm text-gray-600">Tác giả</span>
              <span className="text-sm font-medium text-gray-900">
                {config?.['app.author']}
              </span>
            </div>
          </div>
        </div>

        {/* Configuration Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">
            Cấu hình phụ cấp & thưởng
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Phụ cấp đi lại</span>
              <span className="text-sm font-medium text-gray-900">
                {formatMoney(config?.['allowance.transportation'])}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Phụ cấp ăn trưa</span>
              <span className="text-sm font-medium text-gray-900">
                {formatMoney(config?.['allowance.lunch'])}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Hệ số tăng ca</span>
              <span className="text-sm font-medium text-gray-900">
                ×{config?.['overtime.rate']}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-sm text-gray-600">Thưởng hiệu suất</span>
              <span className="text-sm font-medium text-gray-900">
                {((config?.['bonus.performance'] || 0) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Design Patterns Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">
            Design Patterns áp dụng
          </h2>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Strategy Pattern</h3>
              <p className="text-xs text-gray-600">
                Tính lương linh hoạt theo 4 loại hợp đồng khác nhau
              </p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Singleton Pattern</h3>
              <p className="text-xs text-gray-600">
                Quản lý cấu hình toàn cục với 1 instance duy nhất
              </p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Decorator Pattern</h3>
              <p className="text-xs text-gray-600">
                Thêm phụ cấp, thưởng linh hoạt vào lương cơ bản
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

