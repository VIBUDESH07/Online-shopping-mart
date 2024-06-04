from flask import Flask, jsonify, request
from pymongo import MongoClient
import base64
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['E-commerce']
collection = db['Product details']

@app.route('/product', methods=['POST'])
def insert_product():
    # Get product data from request.form
    product_data = request.form.to_dict()
    
    # Check if request contains file
    if 'image' in request.files:
        image = request.files['image']
        image_base64 = base64.b64encode(image.read()).decode('utf-8')
        product_data['image'] = image_base64
    collection.insert_one(product_data)
    return jsonify({'message': 'Product added successfully'}), 201

@app.route('/products', methods=['GET'])
def get_products():
    products = list(collection.find({}, {"_id": 0}))  # Fetch all products, excluding the _id field
    return jsonify(products)

if __name__ == '__main__':
    app.run(debug=True)
