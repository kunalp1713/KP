import os
import configparser

class Config:
    # Load the configuration from config.ini
    config = configparser.ConfigParser()
    config.read(os.path.join(os.path.dirname(__file__), 'config.ini'))

    # SQL Server database configuration
    SQL_SERVER = config['Sql']['server']
    SQL_DATABASE = config['Sql']['database']
    SQL_DRIVER = config['Sql']['driver']

    # Flask server configuration
    HOST = config['server']['host']
    PORT = int(config['server']['port'].strip())  # Strips whitespace

    # Build the SQLAlchemy URI with proper format for pyodbc
    SQLALCHEMY_DATABASE_URI = (
        f"mssql+pyodbc://{SQL_SERVER}/{SQL_DATABASE}"
        f"?driver={{{SQL_DRIVER}}}"
        "&Trusted_Connection=yes"  # Change to your authentication method
    )
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.urandom(24)  # Use a randomly generated secret key for session management
