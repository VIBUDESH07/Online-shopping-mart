from flask import Flask, jsonify, request
from pymongo import MongoClient
import os

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['E-commerce']
collection = db['Product details']

# Define the directory to save uploaded images
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Function to save uploaded image
def save_image(image):
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
    image.save(image_path)
    return image_path

@app.route('/products', methods=['POST'])
def insert_product():
    # Get product data from request.json
    product_data = request.json
    # Remove _id field if present
    product_data.pop('_id', None)
    # Check if request contains file
    if 'image' in request.files:
        image = request.files['image']
        # Save the image and get its path
        image_path = save_image(image)
        # Add image path to product data
        product_data['image'] = image_path
    # Insert product data into MongoDB collection
    collection.insert_one(product_data)
    return jsonify({'message': 'Product added successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)
