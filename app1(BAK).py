from flask import Flask, request, jsonify, render_template
import pyodbc
from datetime import datetime
import configparser
import uuid

app = Flask(__name__)

# Load configuration from config file
config = configparser.ConfigParser()
config.read("config.ini")

server = config.get("Sql", "server")
database = config.get("Sql", "database")
driver = config.get("Sql", "driver")

# Create a connection string with Windows Authentication
connection_string = f"DRIVER={driver};SERVER={server};DATABASE={database};Trusted_Connection=yes;"

@app.route('/')
def index():
    return render_template('dashboard.html')

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
            conn = pyodbc.connect(connection_string)
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
        conn = pyodbc.connect(connection_string)
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

        conn = pyodbc.connect(connection_string)
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
        conn = pyodbc.connect(connection_string)
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
        conn = pyodbc.connect(connection_string)
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
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        query = "SELECT andon_number, machine_number, reasons, department, timestamp, status FROM barcode_logs"
        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()

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
        return jsonify({'status': 'error', 'message': f'Server error: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
