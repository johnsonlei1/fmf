# backend/app.py
from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

# Function to read data from CSV file
def read_csv_data(file_path):
    try:
        df = pd.read_csv(file_path)
        return df.to_dict(orient='records')
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return []

# API endpoint to get data from CSV
@app.route('/api/data', methods=['GET'])
def get_data():
    data = read_csv_data('data.csv')  # Replace with your CSV file path
    return jsonify(data)

# Example endpoint for a specific item by ID
@app.route('/api/data/<item_id>', methods=['GET'])
def get_item(item_id):
    data = read_csv_data('data.csv')
    # Find the item with the matching ID
    item = next((item for item in data if str(item.get('id')) == item_id), None)
    if item:
        return jsonify(item)
    return jsonify({"error": "Item not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)