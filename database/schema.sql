-- Database Schema for City Complaint Management System

-- Optional: Cleanup (Uncomment to reset database)
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

-- 1. Departments
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 2. Categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    department_id INTEGER REFERENCES departments(id)
);

-- 3. Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'CITIZEN', -- CITIZEN, ADMIN, SYSTEM_ADMIN, DEPARTMENT_HEAD
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Complaints
CREATE TABLE IF NOT EXISTS complaints (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, RESOLVED, CLOSED
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Seeding initial data

-- Departments
INSERT INTO departments (name, description) VALUES 
('Roads & Transport', 'Maintenance of roads, bridges, and traffic lights'),
('Sanitation', 'Waste management and sewage system'),
('Electricity', 'Power supply and street lighting'),
('Water Supply', 'Potable water distribution'),
('Parks & Recreation', 'Maintenance of public parks and community centers'),
('Public Health', 'Health inspections and medical services')
ON CONFLICT (name) DO NOTHING;

-- Categories (Using subqueries to find IDs by name for reliability)
INSERT INTO categories (name, department_id) VALUES 
('Pothole Repair', (SELECT id FROM departments WHERE name = 'Roads & Transport')),
('Traffic Signal Malfunction', (SELECT id FROM departments WHERE name = 'Roads & Transport')),
('Broken Sidewalk', (SELECT id FROM departments WHERE name = 'Roads & Transport')),
('Garbage Collection', (SELECT id FROM departments WHERE name = 'Sanitation')),
('Illegal Dumping', (SELECT id FROM departments WHERE name = 'Sanitation')),
('Sewage Overflow', (SELECT id FROM departments WHERE name = 'Sanitation')),
('Street Light Outage', (SELECT id FROM departments WHERE name = 'Electricity')),
('Exposed Wires', (SELECT id FROM departments WHERE name = 'Electricity')),
('Water Leakage', (SELECT id FROM departments WHERE name = 'Water Supply')),
('Low Water Pressure', (SELECT id FROM departments WHERE name = 'Water Supply')),
('Park Vandalism', (SELECT id FROM departments WHERE name = 'Parks & Recreation')),
('Overgrown Vegetation', (SELECT id FROM departments WHERE name = 'Parks & Recreation')),
('Stray Animal Issue', (SELECT id FROM departments WHERE name = 'Public Health')),
('Air Quality Concern', (SELECT id FROM departments WHERE name = 'Public Health'))
ON CONFLICT (name) DO NOTHING;

-- Default Admin (Password: SysAdmin@123 - handled by seeder)
INSERT INTO users (username, email, password, full_name, role) VALUES 
('sysadmin', 'admin@city.gov', '$2a$10$eAccYoNOHEqXve8aIWT8Nu3PkMXWBaDlJ.HMc6iJ.aNrnE9SH5icK', 'System Administrator', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- Default Citizen (Password: Citizen@123 - handled by seeder)
INSERT INTO users (username, email, password, full_name, role) VALUES 
('citycitizen', 'citizen@example.com', '$2a$10$eAccYoNOHEqXve8aIWT8Nu3PkMXWBaDlJ.HMc6iJ.aNrnE9SH5icK', 'Jane Doe', 'CITIZEN')
ON CONFLICT (username) DO NOTHING;


