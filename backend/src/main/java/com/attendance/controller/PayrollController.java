package com.attendance.controller;

import com.attendance.model.Payroll;
import com.attendance.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class PayrollController {
    
    @Autowired
    private PayrollService payrollService;
    
    @PostMapping("/calculate/{employeeId}")
    public ResponseEntity<Payroll> calculateSalary(@PathVariable Long employeeId) {
        return ResponseEntity.ok(payrollService.calculateSalary(employeeId));
    }
    
    @GetMapping("/{employeeId}")
    public ResponseEntity<List<Payroll>> getPayrollHistory(@PathVariable Long employeeId) {
        return ResponseEntity.ok(payrollService.getPayrollHistory(employeeId));
    }
}


