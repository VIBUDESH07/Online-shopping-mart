from flask import Flask, jsonify, request
from pymongo import MongoClient
import base64
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)
client = MongoClient('mongodb://localhost:27017/')
db = client['E-commerce']
collection = db['Product details']

@app.route('/product', methods=['POST'])
def insert_product():
    product_data = request.form.to_dict()

    if 'image' in request.files:
        image = request.files['image']
        image_base64 = base64.b64encode(image.read()).decode('utf-8')
        product_data['image'] = image_base64
    if 'offer_end_time' in product_data:
        product_data['offer_end_time'] = datetime.strptime(product_data['offer_end_time'], '%Y-%m-%dT%H:%M')

    collection.insert_one(product_data)
    return jsonify({'message': 'Product added successfully'}), 201

@app.route('/products', methods=['GET'])
def get_products():
    products = list(collection.find({}))

    for product in products:
        product['_id'] = str(product['_id'])
        
        # Calculate remaining offer time
        if 'offer_end_time' in product:
            offer_end_time = product['offer_end_time']
            current_time = datetime.now()
            remaining_time = offer_end_time - current_time
            product['remaining_offer_time'] = remaining_time.total_seconds()
        else:
            product['remaining_offer_time'] = None

    return jsonify(products)
@app.route('/product_specific/<product_type>', methods=['GET'])
def get_products_by_type(product_type):
    print(product_type)
    products = list(collection.find({'type': product_type}))

    if products:
        for product in products:
            product['_id'] = str(product['_id'])
            
            # Calculate remaining offer time
            if 'offer_end_time' in product:
                offer_end_time = product['offer_end_time']
                current_time = datetime.now()
                remaining_time = offer_end_time - current_time
                product['remaining_offer_time'] = remaining_time.total_seconds()
            else:
                product['remaining_offer_time'] = None

        return jsonify(products)
    else:
        return jsonify({'message': 'No products found for the specified type'}), 404


if __name__ == '__main__':
    app.run(debug=True)
