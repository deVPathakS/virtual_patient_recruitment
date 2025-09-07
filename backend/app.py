from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import datetime
import os

from config import MODEL_PATHS
from models.ml_models import load_models, MODELS
from utils.db import get_db_connection  # now PostgreSQL via psycopg2

# Import blueprints
from routes.auth_routes import auth_bp
from routes.patient_routes import patient_bp
from routes.org_routes import org_bp
from routes.analytics_routes import analytics_bp
from routes.trial_routes import trial_bp
from errors.handlers import register_error_handlers

# Initialize Flask app
app = Flask(__name__, static_folder='build', static_url_path='/')

# Enable CORS (needed for Vercel frontend → Railway backend requests)
CORS(app)

# Password hashing
bcrypt = Bcrypt(app)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(patient_bp)
app.register_blueprint(org_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(trial_bp)

# Register custom error handlers
register_error_handlers(app)


# ✅ Serve React frontend build (for Vercel/production)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


# ✅ Healthcheck / API info endpoint
@app.route('/api/health')
def health_check():
    return {
        "message": "Virtual Patient Recruitment API",
        "status": "running",
        "loaded_models": list(MODELS.keys()),
        "models_count": len(MODELS),
        "timestamp": datetime.now().isoformat()
    }


if __name__ == '__main__':
    print("🚀 Starting Virtual Patient Recruitment API...")

    # Load ML models
    loaded_count = load_models()
    print(f"✅ Loaded {loaded_count} models: {list(MODELS.keys())}")

    # Test PostgreSQL connection
    conn = get_db_connection()
    if conn:
        print("✅ Database connection successful")
        conn.close()
    else:
        print("❌ Database connection failed")

    # Railway provides $PORT automatically
    port = int(os.environ.get("PORT", 8000))
    app.run(debug=False, host="0.0.0.0", port=port)
