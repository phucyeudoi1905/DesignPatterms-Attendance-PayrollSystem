package com.attendance.config;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Singleton Pattern Implementation
 * Quản lý cấu hình toàn cục của ứng dụng
 * Đảm bảo chỉ có 1 instance duy nhất trong toàn bộ ứng dụng
 */
@Component
public class ApplicationConfig {
    
    // Singleton instance
    private static ApplicationConfig instance;
    
    // Application settings
    private final Map<String, Object> settings;
    private final LocalDateTime startupTime;
    private int requestCount;
    
    // Private constructor để đảm bảo Singleton
    private ApplicationConfig() {
        this.settings = new HashMap<>();
        this.startupTime = LocalDateTime.now();
        this.requestCount = 0;
        initializeDefaultSettings();
        System.out.println("🔧 ApplicationConfig Singleton initialized at: " + startupTime);
    }
    
    // Phương thức lấy instance (Singleton pattern)
    public static synchronized ApplicationConfig getInstance() {
        if (instance == null) {
            instance = new ApplicationConfig();
        }
        return instance;
    }
    
    private void initializeDefaultSettings() {
        // Cấu hình mặc định
        settings.put("app.name", "Attendance Payroll System");
        settings.put("app.version", "2.0.0");
        settings.put("app.author", "Design Pattern Team");
        settings.put("overtime.rate", 1.5); // Hệ số lương tăng ca
        settings.put("bonus.performance", 0.1); // 10% thưởng hiệu suất
        settings.put("allowance.transportation", 500000); // Phụ cấp đi lại
        settings.put("allowance.lunch", 30000); // Phụ cấp ăn trưa
        settings.put("tax.rate", 0.1); // 10% thuế
    }
    
    // Getter cho settings
    public Object getSetting(String key) {
        return settings.get(key);
    }
    
    public void setSetting(String key, Object value) {
        settings.put(key, value);
        System.out.println("⚙️ Updated setting: " + key + " = " + value);
    }
    
    public Map<String, Object> getAllSettings() {
        return new HashMap<>(settings);
    }
    
    public LocalDateTime getStartupTime() {
        return startupTime;
    }
    
    public synchronized void incrementRequestCount() {
        requestCount++;
    }
    
    public int getRequestCount() {
        return requestCount;
    }
    
    public long getUptimeInSeconds() {
        return java.time.Duration.between(startupTime, LocalDateTime.now()).getSeconds();
    }
    
    // Helper methods
    public double getOvertimeRate() {
        return (double) settings.getOrDefault("overtime.rate", 1.5);
    }
    
    public double getPerformanceBonusRate() {
        return (double) settings.getOrDefault("bonus.performance", 0.1);
    }
    
    public int getTransportationAllowance() {
        return (int) settings.getOrDefault("allowance.transportation", 500000);
    }
    
    public int getLunchAllowance() {
        return (int) settings.getOrDefault("allowance.lunch", 30000);
    }
    
    public double getTaxRate() {
        return (double) settings.getOrDefault("tax.rate", 0.1);
    }
}

