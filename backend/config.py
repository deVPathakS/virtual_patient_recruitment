# Example config file – make sure to adjust values
import os
from urllib.parse import urlparse

# Railway injects MYSQL_URL variable
mysql_url = os.getenv("MYSQL_URL", "")

if mysql_url:
    url = urlparse(mysql_url)
    DB_CONFIG = {
        'host': url.hostname,
        'user': url.username,
        'password': url.password,
        'database': url.path.lstrip('/'),
        'port': url.port or 3306
    }
else:
    # fallback for local dev
    DB_CONFIG = {
        'host': 'localhost',
        'user': 'vp_user',
        'password': 'StrongPassword123',
        'database': 'virtual_patient_recruitment'
    }

MODEL_PATHS = {
    'hypertension': 'ml_models/hypertension_model.pkl',
    'arthritis': 'ml_models/arthritis_model.pkl',
    'migraine': 'ml_models/migraine_model.pkl',
    'phase1': 'ml_models/phase1_model.pkl'
}


