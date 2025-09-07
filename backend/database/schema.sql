-- Create database (Postgres doesn't support IF NOT EXISTS on CREATE DATABASE in SQL scripts)
-- Run separately if needed:
-- CREATE DATABASE virtual_patient_recruitment;

-- Hypertension patients table
CREATE TABLE IF NOT EXISTS hypertension_patients (
    id SERIAL PRIMARY KEY,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    bmi NUMERIC(5,2) NOT NULL,
    glucose NUMERIC(6,2) NOT NULL,
    lifestyle_risk INT NOT NULL,
    stress_level INT NOT NULL,
    systolic_bp INT NOT NULL,
    diastolic_bp INT NOT NULL,
    cholesterol_total NUMERIC(6,2) NOT NULL,
    comorbidities INT NOT NULL,
    consent VARCHAR(5) NOT NULL,
    eligibility VARCHAR(20) NOT NULL,
    source VARCHAR(20) DEFAULT 'Patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Arthritis patients table
CREATE TABLE IF NOT EXISTS arthritis_patients (
    id SERIAL PRIMARY KEY,
    age INT NOT NULL,
    years_since_diagnosis NUMERIC(4,1) NOT NULL,
    tender_joint_count INT NOT NULL,
    swollen_joint_count INT NOT NULL,
    crp_level NUMERIC(6,2) NOT NULL,
    patient_pain_score INT NOT NULL,
    egfr NUMERIC(6,2) NOT NULL,
    on_biologic_dmards BOOLEAN NOT NULL,
    has_hepatitis BOOLEAN NOT NULL,
    eligibility VARCHAR(20) NOT NULL,
    source VARCHAR(20) DEFAULT 'Patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migraine patients table
CREATE TABLE IF NOT EXISTS migraine_patients (
    id SERIAL PRIMARY KEY,
    age INT NOT NULL,
    migraine_frequency INT NOT NULL,
    previous_medication_failures INT NOT NULL,
    liver_enzyme_level NUMERIC(6,2) NOT NULL,
    has_aura BOOLEAN NOT NULL,
    chronic_kidney_disease BOOLEAN NOT NULL,
    on_anticoagulants BOOLEAN NOT NULL,
    sleep_disorder BOOLEAN NOT NULL,
    depression BOOLEAN NOT NULL,
    caffeine_intake INT NOT NULL,
    eligibility VARCHAR(20) NOT NULL,
    source VARCHAR(20) DEFAULT 'Patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Phase 1 patients table
CREATE TABLE IF NOT EXISTS phase1_patients (
    id SERIAL PRIMARY KEY,
    age INT NOT NULL,
    sex BOOLEAN NOT NULL, -- true/false instead of TINYINT
    weight_kg NUMERIC(5,2) NOT NULL,
    height_cm NUMERIC(5,2) NOT NULL,
    bmi NUMERIC(5,2) NOT NULL,
    cohort INT NOT NULL,
    alt NUMERIC(6,2) NOT NULL,
    creatinine NUMERIC(5,2) NOT NULL,
    sbp INT NOT NULL,
    dbp INT NOT NULL,
    hr INT NOT NULL,
    temp_c NUMERIC(4,1) NOT NULL,
    adverse_event BOOLEAN NOT NULL,
    eligibility VARCHAR(20) NOT NULL,
    source VARCHAR(20) DEFAULT 'Patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (username, password_hash, role)
VALUES (
    'Admin',
    '$2b$12$x5ZomYth7ibki.55CWkGUuwMP/0yMLDtuyyj6W.7ku8IC/MPdiO.K',
    'admin'
)
ON CONFLICT (username) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hypertension_created ON hypertension_patients(created_at);
CREATE INDEX IF NOT EXISTS idx_hypertension_eligibility ON hypertension_patients(eligibility);
CREATE INDEX IF NOT EXISTS idx_arthritis_created ON arthritis_patients(created_at);
CREATE INDEX IF NOT EXISTS idx_arthritis_eligibility ON arthritis_patients(eligibility);
CREATE INDEX IF NOT EXISTS idx_migraine_created ON migraine_patients(created_at);
CREATE INDEX IF NOT EXISTS idx_migraine_eligibility ON migraine_patients(eligibility);
CREATE INDEX IF NOT EXISTS idx_phase1_created ON phase1_patients(created_at);
CREATE INDEX IF NOT EXISTS idx_phase1_eligibility ON phase1_patients(eligibility);
