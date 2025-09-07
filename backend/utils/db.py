import mysql.connector
from config import DB_CONFIG

def get_db_connection():
    """Get database connection"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            return conn
        else:
            print("❌ Database connection failed")
            return None
    except mysql.connector.Error as err:
        print(f"❌ Database connection error: {err}")
        return None
