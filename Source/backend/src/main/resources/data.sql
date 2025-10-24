-- Insert sample employees with different contract types
INSERT INTO employee (id, name, position, contract_type, salary_base, hourly_rate, product_rate, kpi_bonus) VALUES
(1, 'Nguyễn Văn An', 'Developer', 'FIXED', 15000000, 0, 0, 0),
(2, 'Trần Thị Bình', 'Part-time Assistant', 'HOURLY', 0, 50000, 0, 0),
(3, 'Lê Văn Cường', 'Production Worker', 'PRODUCT_BASED', 0, 0, 20000, 0),
(4, 'Phạm Thị Dung', 'Sales Manager', 'KPI_BASED', 10000000, 0, 0, 5000000);

-- Reset sequence to start from 5 (after the 4 sample employees)
ALTER TABLE employee ALTER COLUMN id RESTART WITH 5;

-- Insert sample attendance records
INSERT INTO attendance (id, employee_id, check_in, check_out, working_hours) VALUES
(1, 1, '2025-10-01 08:00:00', '2025-10-01 17:00:00', 8),
(2, 1, '2025-10-02 08:00:00', '2025-10-02 17:00:00', 8),
(3, 1, '2025-10-03 08:00:00', '2025-10-03 17:00:00', 8),
(4, 2, '2025-10-01 09:00:00', '2025-10-01 13:00:00', 4),
(5, 2, '2025-10-02 09:00:00', '2025-10-02 14:00:00', 5),
(6, 3, '2025-10-01 08:00:00', '2025-10-01 17:00:00', 50),
(7, 3, '2025-10-02 08:00:00', '2025-10-02 17:00:00', 45),
(8, 4, '2025-10-01 08:00:00', '2025-10-01 17:00:00', 8),
(9, 4, '2025-10-02 08:00:00', '2025-10-02 17:00:00', 8);

-- Reset attendance sequence
ALTER TABLE attendance ALTER COLUMN id RESTART WITH 10;

-- Insert sample payroll records
INSERT INTO payroll (id, employee_id, salary, calculation_type, created_date) VALUES
(1, 1, 15000000, 'FIXED', '2025-09-30 10:00:00'),
(2, 2, 450000, 'HOURLY', '2025-09-30 10:00:00'),
(3, 3, 1900000, 'PRODUCT_BASED', '2025-09-30 10:00:00'),
(4, 4, 15000000, 'KPI_BASED', '2025-09-30 10:00:00');

-- Reset payroll sequence
ALTER TABLE payroll ALTER COLUMN id RESTART WITH 5;


