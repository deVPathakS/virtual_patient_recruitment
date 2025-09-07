# Example PostgreSQL config
DB_CONFIG = {
    'host': 'localhost',       # or your Railway/Postgres host
    'port': 5432,
    'user': 'vp_user',
    'password': 'StrongPassword123',
    'dbname': 'virtual_patient_recruitment'
}

MODEL_PATHS = {
    'hypertension': 'ml_models/hypertension_model.pkl',
    'arthritis': 'ml_models/arthritis_model.pkl',
    'migraine': 'ml_models/migraine_model.pkl',
    'phase1': 'ml_models/phase1_model.pkl'
}
