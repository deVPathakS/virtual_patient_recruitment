from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from utils.db import get_db_connection
import mysql.connector

auth_bp = Blueprint('auth', __name__, url_prefix='/api')
bcrypt = Bcrypt()

@auth_bp.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

        query = "INSERT INTO users (username, password_hash, role) VALUES (%s, %s, %s)"
        cursor.execute(query, (username, password_hash, 'patient'))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "User registered successfully", "role": "patient"}), 201
    except mysql.connector.IntegrityError:
        return jsonify({"error": "Username already exists"}), 400
    except Exception as e:
        print(f"❌ Error in register_user: {e}")
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.route('/login', methods=['POST'])
def login_user():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM users WHERE username = %s"
        cursor.execute(query, (username,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if not user:
            return jsonify({"error": "Invalid username or password"}), 401

        if not bcrypt.check_password_hash(user['password_hash'], password):
            return jsonify({"error": "Invalid username or password"}), 401

        return jsonify({
            "message": "Login successful",
            "role": user['role'],
            "username": user['username']
        }), 200
    except Exception as e:
        print(f"❌ Error in login_user: {e}")
        return jsonify({"error": "Internal server error"}), 500
