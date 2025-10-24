package com.attendance.service;

import com.attendance.model.ContractType;
import com.attendance.model.Employee;
import com.attendance.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class EmployeeService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
    
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + id));
    }
    
    public Employee createEmployee(Employee employee) {
        // Validate và chuẩn hóa dữ liệu
        validateAndNormalizeEmployee(employee);
        return employeeRepository.save(employee);
    }
    
    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + id));
        
        // Validate trước khi cập nhật
        validateAndNormalizeEmployee(employeeDetails);
        
        employee.setName(employeeDetails.getName());
        employee.setPosition(employeeDetails.getPosition());
        employee.setContractType(employeeDetails.getContractType());
        employee.setSalaryBase(employeeDetails.getSalaryBase());
        employee.setHourlyRate(employeeDetails.getHourlyRate());
        employee.setProductRate(employeeDetails.getProductRate());
        employee.setKpiBonus(employeeDetails.getKpiBonus());
        
        return employeeRepository.save(employee);
    }
    
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + id));
        employeeRepository.delete(employee);
    }
    
    /**
     * Validate và chuẩn hóa dữ liệu nhân viên theo loại hợp đồng
     */
    private void validateAndNormalizeEmployee(Employee employee) {
        // Kiểm tra tên và vị trí
        if (employee.getName() == null || employee.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên nhân viên không được để trống");
        }
        if (employee.getPosition() == null || employee.getPosition().trim().isEmpty()) {
            throw new IllegalArgumentException("Vị trí không được để trống");
        }
        
        // Chuẩn hóa các giá trị null thành 0
        if (employee.getSalaryBase() == null) {
            employee.setSalaryBase(BigDecimal.ZERO);
        }
        if (employee.getHourlyRate() == null) {
            employee.setHourlyRate(BigDecimal.ZERO);
        }
        if (employee.getProductRate() == null) {
            employee.setProductRate(BigDecimal.ZERO);
        }
        if (employee.getKpiBonus() == null) {
            employee.setKpiBonus(BigDecimal.ZERO);
        }
        
        // Validate theo loại hợp đồng
        ContractType contractType = employee.getContractType();
        if (contractType == null) {
            throw new IllegalArgumentException("Loại hợp đồng không được để trống");
        }
        
        switch (contractType) {
            case FIXED:
                if (employee.getSalaryBase().compareTo(BigDecimal.ZERO) <= 0) {
                    throw new IllegalArgumentException("Lương cơ bản phải lớn hơn 0 cho hợp đồng cố định");
                }
                break;
            case HOURLY:
                if (employee.getHourlyRate().compareTo(BigDecimal.ZERO) <= 0) {
                    throw new IllegalArgumentException("Lương theo giờ phải lớn hơn 0 cho hợp đồng theo giờ");
                }
                break;
            case PRODUCT_BASED:
                if (employee.getProductRate().compareTo(BigDecimal.ZERO) <= 0) {
                    throw new IllegalArgumentException("Giá sản phẩm phải lớn hơn 0 cho hợp đồng theo sản phẩm");
                }
                break;
            case KPI_BASED:
                if (employee.getSalaryBase().compareTo(BigDecimal.ZERO) <= 0) {
                    throw new IllegalArgumentException("Lương cơ bản phải lớn hơn 0 cho hợp đồng KPI");
                }
                if (employee.getKpiBonus().compareTo(BigDecimal.ZERO) <= 0) {
                    throw new IllegalArgumentException("Thưởng KPI phải lớn hơn 0 cho hợp đồng KPI");
                }
                break;
        }
        
        // Kiểm tra giá trị không âm
        if (employee.getSalaryBase().compareTo(BigDecimal.ZERO) < 0 ||
            employee.getHourlyRate().compareTo(BigDecimal.ZERO) < 0 ||
            employee.getProductRate().compareTo(BigDecimal.ZERO) < 0 ||
            employee.getKpiBonus().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Các giá trị lương không được âm");
        }
    }
}


