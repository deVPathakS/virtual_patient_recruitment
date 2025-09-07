from flask import Blueprint, jsonify
from utils.db import get_db_connection
from datetime import datetime
import mysql.connector

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api')

@analytics_bp.route('/analytics', methods=['GET'])
def get_analytics():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor(dictionary=True)

        summary_data = []
        trial_tables = {
            'hypertension': 'hypertension_patients',
            'arthritis': 'arthritis_patients',
            'migraine': 'migraine_patients',
            'phase1': 'phase1_patients'
        }

        for trial_type, table_name in trial_tables.items():
            try:
                query = f"""
                    SELECT 
                        '{trial_type}' as trial_type,
                        COUNT(*) as total_applications,
                        SUM(CASE WHEN eligibility = 'Eligible' THEN 1 ELSE 0 END) as eligible,
                        SUM(CASE WHEN eligibility = 'Ineligible' THEN 1 ELSE 0 END) as ineligible
                    FROM {table_name}
                """
                cursor.execute(query)
                result = cursor.fetchone()
                if result:
                    summary_data.append(result)
            except mysql.connector.Error:
                continue

        recent_data = []
        for trial_type, table_name in trial_tables.items():
            try:
                query = f"""
                    SELECT 
                        '{trial_type}' as trial_type, 
                        COUNT(*) as count, 
                        eligibility, 
                        DATE(created_at) as date
                    FROM {table_name}
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                    GROUP BY eligibility, DATE(created_at)
                    ORDER BY date DESC
                """
                cursor.execute(query)
                results = cursor.fetchall()
                recent_data.extend(results)
            except mysql.connector.Error:
                continue

        cursor.close()
        conn.close()

        return jsonify({
            "summary": summary_data,
            "recent_trends": recent_data,
            "last_updated": datetime.now().isoformat()
        })

    except Exception as e:
        print(f"Error in get_analytics: {e}")
        return jsonify({"error": str(e)}), 500


@analytics_bp.route('/patients/<trial_type>', methods=['GET'])
def get_patients(trial_type):
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor(dictionary=True)

        table_map = {
            'hypertension': 'hypertension_patients',
            'arthritis': 'arthritis_patients',
            'migraine': 'migraine_patients',
            'phase1': 'phase1_patients'
        }

        if trial_type not in table_map:
            return jsonify({"error": "Invalid trial type"}), 400

        query = f"SELECT * FROM {table_map[trial_type]} ORDER BY created_at DESC LIMIT 1000"
        cursor.execute(query)
        patients = cursor.fetchall()

        for patient in patients:
            if 'created_at' in patient and patient['created_at']:
                patient['created_at'] = patient['created_at'].isoformat()

        cursor.close()
        conn.close()

        return jsonify(patients)

    except Exception as e:
        print(f"Error in get_patients: {e}")
        return jsonify({"error": str(e)}), 500
