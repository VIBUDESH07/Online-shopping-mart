from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
client = MongoClient('mongodb://localhost:27017/')
db = client['E-commerce']
product_collection = db['Product details']
user_collection = db['User']

@app.route('/product', methods=['POST'])
def insert_product():
    product_data = request.form.to_dict()

    if 'image' in request.files:
        image = request.files['image']
        image_base64 = base64.b64encode(image.read()).decode('utf-8')
        product_data['image'] = image_base64
    if 'offer_end_time' in product_data:
        product_data['offer_end_time'] = datetime.strptime(product_data['offer_end_time'], '%Y-%m-%dT%H:%M')

    product_collection.insert_one(product_data)
    return jsonify({'message': 'Product added successfully'}), 201

@app.route('/products', methods=['GET'])
def get_products():
    products = list(product_collection.find({}))

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
    products = list(product_collection.find({'type': product_type}))

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

@app.route('/signup', methods=['POST'])
def signup():
    user_data = request.json

    # Validate user data
    if not user_data.get('username') or not user_data.get('email') or not user_data.get('password'):
        return jsonify({'error': 'Username, email, and password are required'}), 400

    # Prepare user data
    user = {
        'username': user_data['username'],
        'email': user_data['email'],
        'password': user_data['password'],
        'address': user_data.get('address'),
        'upiId': user_data.get('upiId'),
        'pin': user_data.get('pin')
    }

    # Insert user into the database
    user_collection.insert_one(user)

    return jsonify({'message': 'User registered successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)
