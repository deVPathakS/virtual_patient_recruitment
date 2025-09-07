from flask import Blueprint, request, jsonify
from utils.db import get_db_connection
from utils.query_builder import execute_query
from models.ml_models import predict_eligibility
import traceback

patient_bp = Blueprint('patient', __name__, url_prefix='/api/patient')

@patient_bp.route('/apply', methods=['POST'])
def patient_apply():
    """Handle patient application"""
    try:
        print("📥 Received patient application request")
        data = request.json
        trial_type = data.get('trial_type')
        patient_data = data.get('patient_data')

        if not trial_type or not patient_data:
            return jsonify({"error": "Missing trial_type or patient_data"}), 400

        eligibility = predict_eligibility(trial_type, patient_data)
        print(f"🔍 Predicted eligibility: {eligibility}")

        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor()
        table_config = execute_query(trial_type, patient_data, eligibility, 'Patient')
        if not table_config:
            return jsonify({"error": f"Unsupported trial type: {trial_type}"}), 400

        cursor.execute(table_config['query'], table_config['values'])
        patient_id = cursor.lastrowid

        conn.commit()
        cursor.close()
        conn.close()

        print(f"✅ Stored patient {patient_id} with eligibility: {eligibility}")

        return jsonify({
            "patient_id": patient_id,
            "eligibility": eligibility,
            "message": f"Application submitted successfully. You are {eligibility.lower()}.",
            "trial_type": trial_type
        })

    except Exception as e:
        print(f"❌ Error in patient_apply: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
