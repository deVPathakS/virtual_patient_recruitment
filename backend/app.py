from flask import Flask, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import datetime

from config import DB_CONFIG, MODEL_PATHS
from models.ml_models import load_models, MODELS
from utils.db import get_db_connection

# Import blueprints
from routes.auth_routes import auth_bp
from routes.patient_routes import patient_bp
from routes.org_routes import org_bp
from routes.analytics_routes import analytics_bp
from routes.trial_routes import trial_bp
from errors.handlers import register_error_handlers

# filepath: backend/app.py
app = Flask(__name__, static_folder='build', static_url_path='/')

CORS(app)
bcrypt = Bcrypt(app)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(patient_bp)
app.register_blueprint(org_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(trial_bp)

# Register error handlers
register_error_handlers(app)

@app.route('/')
def home():
    return jsonify({
        "message": "Virtual Patient Recruitment API",
        "status": "running",
        "loaded_models": list(MODELS.keys()),
        "models_count": len(MODELS),
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🚀 Starting Virtual Patient Recruitment API...")

    # Load ML models
    loaded_count = load_models()
    print(f"✅ Loaded {loaded_count} models: {list(MODELS.keys())}")

    # Test database connection
    conn = get_db_connection()
    if conn:
        print("✅ Database connection successful")
        conn.close()
    else:
        print("❌ Database connection failed")

    app.run(debug=True, port=5000, host='0.0.0.0')
