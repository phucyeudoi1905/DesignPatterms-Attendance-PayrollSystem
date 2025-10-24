package com.attendance.controller;

import com.attendance.config.ApplicationConfig;
import com.attendance.model.DashboardStats;
import com.attendance.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        // Increment request count using Singleton
        ApplicationConfig.getInstance().incrementRequestCount();
        return ResponseEntity.ok(dashboardService.getDashboardStatistics());
    }
    
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getApplicationConfig() {
        ApplicationConfig config = ApplicationConfig.getInstance();
        return ResponseEntity.ok(config.getAllSettings());
    }
}

