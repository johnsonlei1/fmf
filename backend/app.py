# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Function to read data from CSV file
def read_csv_data(file_path):
    try:
        df = pd.read_csv(file_path)
        return df.to_dict(orient='records')
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return []

@app.route('/api/categories', methods=['GET'])
def get_unique_categories():
    data = read_csv_data('food.csv')
    categories = set()
    for item in data:
        raw = item.get('categories', '')
        for cat in raw.split(','):
            clean = cat.strip().lower()
            if clean:
                categories.add(clean)
    return jsonify(sorted(categories))

# API endpoint to get all data from CSV
@app.route('/api/data', methods=['GET'])
def get_data():
    data = read_csv_data('food.csv') 
    return jsonify(data)

# Example endpoint for a specific item by ID
@app.route('/api/data/<item_id>', methods=['GET'])
def get_item(item_id):
    data = read_csv_data('food.csv')
    # Find the item with the matching ID
    item = next((item for item in data if str(item.get('id')) == item_id), None)
    if item:
        return jsonify(item)
    return jsonify({"error": "Item not found"}), 404

# New endpoint to search restaurants by city
@app.route('/api/search', methods=['GET'])
def search_by_city():
    city = request.args.get('city', '')
    stars = request.args.get('stars', '')  # optional
    category = request.args.get('category', '').lower()  # optional
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))

    print(f"🔍 Search triggered: city='{city}', stars='{stars}', category='{category}', page={page}, limit={limit}")

    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    data = read_csv_data('food.csv')

    # Filter by city
    filtered_results = [
        item for item in data
        if city.lower() in item.get('city', '').lower()
    ]

    # Filter by stars
    if stars:
        try:
            min_stars = float(stars)
            filtered_results = [
                item for item in filtered_results
                if float(item.get('stars', 0)) >= min_stars
            ]
        except ValueError:
            print("⚠️ Invalid 'stars' filter value — skipping stars filter.")

    # Filter by category
    if category:
        filtered_results = [
            item for item in filtered_results
            if category in item.get('categories', '').lower()
        ]

    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated_results = filtered_results[start:end]

    return jsonify({
        "results": paginated_results,
        "total": len(filtered_results),
        "page": page,
        "limit": limit
    })



if __name__ == '__main__':
    app.run(debug=False, port=5000)