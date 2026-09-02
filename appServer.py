from flask import Flask, render_template, jsonify, request, redirect, url_for, flash, session
from flask_bcrypt import Bcrypt
import pyodbc
from datetime import datetime
import configparser

app = Flask(__name__)

# Load configuration from config file
config = configparser.ConfigParser()
config.read("config.ini")

server = config.get("Sql", "server")
database = config.get("Sql", "database")
driver = config.get("Sql", "driver")

# Create a connection string with Windows Authentication
connection_string = f"DRIVER={driver};SERVER={server};DATABASE={database};Trusted_Connection=yes;"

app.config['SECRET_KEY'] = 'your_secret_key'  # Set your secret key here
bcrypt = Bcrypt(app)

def get_db_connection():
    """Utility function to get a database connection."""
    return pyodbc.connect(connection_string)

class User:
    def __init__(self, username, password, role):
        self.username = username
        self.password = password
        self.role = role

def get_user_by_username(username):
    """Fetch user from the database by username."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT username, password, role FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if row:
        return User(username=row[0], password=row[1], role=row[2])
    return None

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = get_user_by_username(username)

        if user and bcrypt.check_password_hash(user.password, password):
            session['username'] = user.username
            session['role'] = user.role
            if user.role == 'admin':
                return redirect(url_for('admin_dashboard'))
            else:
                return redirect(url_for('user_dashboard'))
        else:
            flash('Login failed. Check your credentials and try again.')
    
    return render_template('login.html')

@app.route('/admin')
def admin_dashboard():
    if 'username' in session and session['role'] == 'admin':
        return render_template('admin_dashboard.html')
    else:
        return redirect(url_for('login'))

@app.route('/user')
def user_dashboard():
    if 'username' in session and session['role'] == 'user':
        return render_template('dashboard.html')
    else:
        return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Check if username and password are in the form
        username = request.form.get('username')
        password = request.form.get('password')

        # Validate that username and password are not empty
        if not username or not password:
            flash('Username and password are required.', 'danger')
            return redirect(url_for('register'))

        # Hash the password before storing
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
                           (username, hashed_password, 'user'))  # Default role as 'user'
            conn.commit()
            flash('User registered successfully!', 'success')
            return redirect(url_for('login'))
        except pyodbc.Error as e:
            flash('Registration failed. Username might already be taken.', 'danger')
            return redirect(url_for('register'))
        finally:
            cursor.close()
            conn.close()
    
    return render_template('register.html')  # Render the registration page for GET requests


@app.route('/barcode', methods=['POST'])
def receive_barcode():
    try:
        data = request.json
        machine_number = data.get('machine_number')
        reasons = data.get('reasons')

        if not machine_number or not reasons:
            return jsonify({'status': 'error', 'message': 'Machine number and reasons are mandatory'}), 400

        # Generate the Andon number
        andon_number = generate_andon_number()

        department = "Machine"
        status = "Yellow"
        timestamp = datetime.now()

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            query = """
            INSERT INTO barcode_logs (andon_number, machine_number, reasons, department, timestamp, status)
            VALUES (?, ?, ?, ?, ?, ?)
            """
            cursor.execute(query, (andon_number, machine_number, reasons, department, timestamp, status))
            conn.commit()
            cursor.close()

            return jsonify({
                'status':'success',
                'message':'Barcode data received and stored',
                'andon_number':andon_number,
                'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S')
            }), 200
        except pyodbc.Error as e:
            return jsonify({'status': 'error', 'message': f'Database error: {str(e)}'}), 500

    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Server error: {str(e)}'}), 500

def generate_andon_number():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Retrieve the maximum existing Andon number
        cursor.execute("SELECT MAX(andon_number) FROM barcode_logs WHERE andon_number LIKE 'AN%'")
        result = cursor.fetchone()
        
        # Extract the numeric part and increment it
        if result[0] is not None:
            max_number = int(result[0][2:])  # Get the numeric part (after "AN")
            next_number = max_number + 1
        else:
            next_number = 1  # Start with 1 if no records exist

        cursor.close()

        # Generate the new Andon number
        return f"AN{next_number:03d}"  # Format with leading zeros

    except pyodbc.Error as e:
        raise Exception(f'Database error: {str(e)}')

@app.route('/acknowledge', methods=['POST'])
def acknowledge_andon():
    try:
        data = request.json
        andon_number = data.get('andon_number')

        if not andon_number:
            return jsonify({'status': 'error', 'message': 'Andon number is required for acknowledgment'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # Delete the record from barcode_logs
            query_delete = "DELETE FROM barcode_logs WHERE andon_number = ?"
            cursor.execute(query_delete, (andon_number,))
            conn.commit()

            # Insert into the andon_history table
            query_insert = "INSERT INTO andon_history (andon_number, status) VALUES (?, ?)"
            cursor.execute(query_insert, (andon_number, 'acknowledged'))
            conn.commit()

            # Optional: Check if any row was affected
            if cursor.rowcount == 0:
                return jsonify({'status': 'error', 'message': 'No record found for the provided Andon number'}), 404

            return jsonify({
                'status':'success',
                'message':'Andon acknowledged and record removed from the database'
            }), 200

        except pyodbc.Error as e:
            return jsonify({'status': 'error', 'message': f'Database error: {str(e)}'}), 500
        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Server error: {str(e)}'}), 500

@app.route('/history', methods=['GET'])
def fetch_history():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Fetching acknowledgment history
        query = "SELECT andon_number, acknowledged_at, status FROM andon_history ORDER BY acknowledged_at DESC"
        cursor.execute(query)
        history_records = cursor.fetchall()

        # Prepare the response data
        history_data = [
            {
                'andon_number': record[0],
                'acknowledged_at': record[1].strftime('%Y-%m-%d %H:%M:%S'),  # Format the datetime
                'status': record[2]
            }
            for record in history_records
        ]

        return jsonify({'status':'success', 'history': history_data}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/andon/stats', methods=['GET'])
def get_andon_stats():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Count total Andon events
        cursor.execute("SELECT COUNT(*) FROM barcode_logs")
        total_andon_count = cursor.fetchone()[0]

        # Count open Andon events (assuming you have a way to define open)
        cursor.execute("SELECT COUNT(*) FROM barcode_logs WHERE status = 'open'")
        open_andon_count = cursor.fetchone()[0]

        return jsonify({
            'total_andon': total_andon_count,
            'open_andon': open_andon_count
        }), 200

    except pyodbc.Error as e:
        return jsonify({'status': 'error', 'message': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/logs', methods=['GET'])
def fetch_andon_logs():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "SELECT andon_number, machine_number, reasons, department, timestamp, status FROM barcode_logs"
        cursor.execute(query)
        rows = cursor.fetchall()

        logs = [
            {
                'andon_number': row[0],
                'machine_number': row[1],
                'reasons': row[2],
                'department': row[3],
                'timestamp': row[4].strftime('%Y-%m-%d %H:%M:%S'),
                'status': row[5]
            }
            for row in rows
        ]

        total_count = len(logs)
        open_count = sum(1 for log in logs if log['status'] == 'Yellow')

        return jsonify({
            'status':'success',
            'logs': logs,
            'totalCount': total_count,
            'openCount': open_count
        }), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    app.run(debug=True)
