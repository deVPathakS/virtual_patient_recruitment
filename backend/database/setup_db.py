import mysql.connector
from mysql.connector import Error
from config import DB_CONFIG  # Remove 'backend.' prefix
import os

def setup_database():
    """Setup database and tables"""
    try:
        print(" Starting database setup...")
        
        # First connect without specifying database
        connection_config = DB_CONFIG.copy()
        database_name = connection_config.pop('database')
        
        print(f"📡 Connecting to MySQL server at {connection_config['host']}...")
        connection = mysql.connector.connect(**connection_config)
        cursor = connection.cursor()
        
        print(f"Creating database '{database_name}'...")
        # Create database if not exists
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database_name}")
        cursor.execute(f"USE {database_name}")
        
        # Read and execute schema
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        print(f" Reading schema from {schema_path}...")
        
        if not os.path.exists(schema_path):
            print(f" Schema file not found at {schema_path}")
            return False
            
        with open(schema_path, 'r') as file:
            schema_sql = file.read()
        
        print(" Creating tables...")
        # Execute each statement
        statements = schema_sql.split(';')
        for statement in statements:
            if statement.strip():
                try:
                    cursor.execute(statement)
                    print(f"✓ Executed: {statement.strip()[:50]}...")
                except Error as e:
                    print(f" Warning executing statement: {e}")
        
        connection.commit()
        print("✅ Database setup completed successfully!")
        
        # Verify tables were created
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print(f" Created tables: {[table[0] for table in tables]}")
        
        return True
        
    except Error as e:
        print(f"❌ Error setting up database: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
            print(" Database connection closed.")

if __name__ == "__main__":
    success = setup_database()
    if success:
        print("\n You can now start the Flask application!")
    else:
        print("\n Database setup failed. Please check the errors above.")
