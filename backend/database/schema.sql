-- Create database
CREATE DATABASE IF NOT EXISTS virtual_patient_recruitment;
USE virtual_patient_recruitment;

-- Hypertension patients table
CREATE TABLE IF NOT EXISTS hypertension_patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    bmi DECIMAL(5,2) NOT NULL,
    glucose DECIMAL(6,2) NOT NULL,
    lifestyle_risk INT NOT NULL,
    stress_level INT NOT NULL,
    systolic_bp INT NOT NULL,
    diastolic_bp INT NOT NULL,
    cholesterol_total DECIMAL(6,2) NOT NULL,
    comorbidities INT NOT NULL,
    consent VARCHAR(5) NOT NULL,
    eligibility VARCHAR(20) NOT NULL,
    source VARCHAR(20) DEFAULT 'Patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Arthritis patients table
CREATE TABLE IF NOT EXISTS arthritis_patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    age INT NOT NULL,
    years_since_diagnosis DECIMAL(4,1) NOT NULL,
    tender_joint_count INT NOT NULL,
    swollen_joint_count INT NOT NULL,
    crp_level DECIMAL(6,2) NOT NULL,
    patient_pain_score INT NOT NULL,
    egfr DECIMAL(6,2) NOT NULL,
    on_biologic_dmards TINYINT NOT NULL,
    has_hepatitis TINYINT NOT NULL,
    eligibility VARCHAR(20) NOT NULL,
    source VARCHAR(20) DEFAULT 'Patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Migraine patients table
CREATE TABLE IF NOT EXISTS migraine_patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    age INT NOT NULL,
    migraine_frequency INT NOT NULL,
    previous_medication_failures INT NOT NULL,
    liver_enzyme_level DECIMAL(6,2) NOT NULL,
    has_aura TINYINT NOT NULL,
    chronic_kidney_disease TINYINT NOT NULL,
    on_anticoagulants TINYINT NOT NULL,
    sleep_disorder TINYINT NOT NULL,
    depression TINYINT NOT NULL,
    caffeine_intake INT NOT NULL,
    eligibility VARCHAR(20) NOT NULL,
    source VARCHAR(20) DEFAULT 'Patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Phase 1 patients table
CREATE TABLE IF NOT EXISTS phase1_patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    age INT NOT NULL,
    sex TINYINT NOT NULL,
    weight_kg DECIMAL(5,2) NOT NULL,
    height_cm DECIMAL(5,2) NOT NULL,
    bmi DECIMAL(5,2) NOT NULL,
    cohort TINYINT NOT NULL,
    alt DECIMAL(6,2) NOT NULL,
    creatinine DECIMAL(5,2) NOT NULL,
    sbp INT NOT NULL,
    dbp INT NOT NULL,
    hr INT NOT NULL,
    temp_c DECIMAL(4,1) NOT NULL,
    adverse_event TINYINT NOT NULL,
    eligibility VARCHAR(20) NOT NULL,
    source VARCHAR(20) DEFAULT 'Patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('patient', 'admin') NOT NULL DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user 
INSERT INTO users (username,  password_hash, role)
VALUES (
    'Admin',
    
    '$2b$12$x5ZomYth7ibki.55CWkGUuwMP/0yMLDtuyyj6W.7ku8IC/MPdiO.K',
    'admin'
);



"""UPDATE users
SET password_hash = '$2b$12$x5ZomYth7ibki.55CWkGUuwMP/0yMLDtuyyj6W.7ku8IC/MPdiO.K',
    role = 'admin'
WHERE username = 'Admin';
select * from users;"""







-- Create indexes for better performance
CREATE INDEX idx_hypertension_created ON hypertension_patients(created_at);
CREATE INDEX idx_hypertension_eligibility ON hypertension_patients(eligibility);
CREATE INDEX idx_arthritis_created ON arthritis_patients(created_at);
CREATE INDEX idx_arthritis_eligibility ON arthritis_patients(eligibility);
CREATE INDEX idx_migraine_created ON migraine_patients(created_at);
CREATE INDEX idx_migraine_eligibility ON migraine_patients(eligibility);
CREATE INDEX idx_phase1_created ON phase1_patients(created_at);
CREATE INDEX idx_phase1_eligibility ON phase1_patients(eligibility);
