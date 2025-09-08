# Example PostgreSQL config
import os
import psycopg2
from urllib.parse import urlparse

# Railway injects DATABASE_URL for Postgres
db_url = os.getenv("DATABASE_URL")

if db_url:
    url = urlparse(db_url)
    DB_CONFIG = {
        'host': url.hostname,
        'port': url.port or 5432,
        'user': url.username,
        'password': url.password,
        'dbname': url.path.lstrip('/')
    }
else:
    # fallback for local dev
    DB_CONFIG = {
        'host': 'localhost',
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
