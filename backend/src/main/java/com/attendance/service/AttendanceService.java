package com.attendance.service;

import com.attendance.model.Attendance;
import com.attendance.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    public Attendance createAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }
    
    public List<Attendance> getAttendanceByEmployeeId(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }
    
    public List<Attendance> getAllAttendances() {
        return attendanceRepository.findAll();
    }
}


