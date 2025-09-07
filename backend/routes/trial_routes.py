from flask import Blueprint, jsonify

trial_bp = Blueprint('trial', __name__, url_prefix='/api')

@trial_bp.route('/trials', methods=['GET'])
def get_trials():
    trials = [
        {"id": "hypertension", "name": "Hypertension Trial", "description": "Clinical trial for hypertension treatment"},
        {"id": "arthritis", "name": "Arthritis Trial", "description": "Rheumatoid arthritis treatment study"},
        {"id": "migraine", "name": "Migraine Trial", "description": "Migraine prevention medication trial"},
        {"id": "phase1", "name": "Phase 1 Trial", "description": "Phase 1 safety and dosage study"}
    ]
    return jsonify(trials)


@trial_bp.route('/trial-fields/<trial_type>', methods=['GET'])
def get_trial_fields(trial_type):
    fields = {
        "hypertension": [
            {"name": "age", "type": "number", "label": "Age (25-80)", "min": 25, "max": 80, "required": True},
            {"name": "gender", "type": "select", "label": "Gender", "options": ["Male", "Female"], "required": True},
            {"name": "bmi", "type": "number", "label": "BMI (18-45)", "min": 18, "max": 45, "step": 0.1, "required": True},
            {"name": "glucose", "type": "number", "label": "Blood Glucose (70-250 mg/dL)", "min": 70, "max": 250, "required": True}
        ],
        "arthritis": [
            {"name": "age", "type": "number", "label": "Age (years)", "required": True},
            {"name": "years_since_diagnosis", "type": "number", "label": "Years Since Diagnosis", "required": True}
        ],
        "migraine": [
            {"name": "age", "type": "number", "label": "Age (18-65)", "min": 18, "max": 65, "required": True},
            {"name": "migraine_frequency", "type": "number", "label": "Migraine Frequency (attacks/month)", "min": 0, "max": 20, "required": True}
        ],
        "phase1": [
            {"name": "age", "type": "number", "label": "Age (years)", "required": True},
            {"name": "sex", "type": "select", "label": "Sex", "options": [{"value": 0, "label": "Male"}, {"value": 1, "label": "Female"}], "required": True}
        ]
    }

    if trial_type not in fields:
        return jsonify({"error": "Invalid trial type"}), 400

    return jsonify(fields[trial_type])
