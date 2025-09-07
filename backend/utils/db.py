import mysql.connector
import os
from urllib.parse import urlparse

def get_db_connection():
    """Get database connection using Railway's MYSQL_URL"""
    try:
        # Get the database URL from environment variables
        db_url_str = os.environ.get('${{ MySQL.MYSQL_URL }}')

        if not db_url_str:
            print("❌ MYSQL_URL environment variable not set.")
            return None

        # Parse the URL to extract connection details
        db_url = urlparse(db_url_str)

        # Build the configuration dictionary for mysql.connector
        DB_CONFIG = {
            'user': db_url.username,
            'password': db_url.password,
            'host': db_url.hostname,
            'port': db_url.port,
            'database': db_url.path[1:]  # The path has a leading '/', so we strip it
        }

        # Establish the connection
        conn = mysql.connector.connect(**DB_CONFIG)

        if conn.is_connected():
            print("✅ Database connection successful!")
            return conn
        else:
            # This part is less likely to be reached as an error would be raised first
            print("❌ Database connection failed")
            return None

    except mysql.connector.Error as err:
        print(f"❌ Database connection error: {err}")
        return None


