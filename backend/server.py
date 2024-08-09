from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from flask_mail import Mail, Message
import random
import datetime
import base64
from bson import ObjectId 

app = Flask(__name__)
CORS(app)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'vibudeshrb.22cse@kongu.edu'  # Replace with your Gmail address
app.config['MAIL_PASSWORD'] = 'andx xznk qhsn aagi'  # Replace with your Gmail app password
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

client = MongoClient('mongodb+srv://vibudesh:040705@cluster0.bojv6ut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['E-commerce']
product_collection = db['Product details']
user_collection = db['User']

# Temporary storage for OTPs
otp_storage = {}

def generate_otp():
    # Generate a 6-digit random OTP
    return ''.join(random.choices('0123456789', k=6))

@app.route('/request-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')
    print(email)
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    otp = generate_otp()
    print(otp)
    otp_storage[email] = {
        'otp': otp,
        'expires_at': datetime.datetime.now() + datetime.timedelta(minutes=5)
    }
    print(otp_storage)

    # Send OTP via email
    try:
        msg = Message('OTP for Verification', sender='vibudeshrb.22cse@kongu.edu', recipients=[email])
        msg.body = f'Your OTP for verification is: {otp}'
        mail.send(msg)
        return jsonify({'success': True, 'message': 'OTP sent successfully'})
    except Exception as e:
        print(f"Failed to send OTP: {e}")
        return jsonify({'error': 'Failed to send OTP'}), 500
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password are required'}), 400

        user = user_collection.find_one({'email': email})
        
        # Debugging print statements - remove in production
        print(user, password)
        
        if user and user['password'] == password:
            # Prepare user data excluding the password
            user_data = {key: value for key, value in user.items() if key != 'password'}
            return jsonify({'success': True, 'user': user_data}), 200
        else:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    address = data.get('address')
    upiId = data.get('upiId')
    pin = data.get('pin')
    otp = data.get('otp')

    verification_result = verify_otp(email, otp)
    if not verification_result['success']:
        return jsonify({"success": False, "message": verification_result['message']}), 400

    try:
        # Insert new user into MongoDB
        user_collection.insert_one({
            'username': username,
            'email': email,
            'password': password,
            'address': address,
            'upiId': upiId,
            'pin': pin
        })

        return jsonify({"success": True, "message": "Signup successful"}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

def verify_otp(email, otp):
    if not email or not otp:
        return {'success': False, 'message': 'Email and OTP are required'}

    if email in otp_storage:
        stored_otp = otp_storage[email]
        if datetime.datetime.now() > stored_otp['expires_at']:
            del otp_storage[email]
            return {'success': False, 'message': 'OTP expired'}
        if stored_otp['otp'] == otp:
            del otp_storage[email]  # Remove OTP after successful verification
            return {'success': True, 'message': 'OTP verified successfully'}
    return {'success': False, 'message': 'Invalid OTP'}

@app.route('/product/<id>', methods=['GET'])
def get_product(id):
    print(id)
    try:
        product = product_collection.find_one({'_id':  ObjectId(id)})
        if product:
            product['_id'] = str(product['_id'])
            return jsonify(product), 200
        else:
            return jsonify({'error': 'Product not found'}), 404
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
@app.route('/cart/add', methods=['POST'])
def add_to_cart():
    cart_collection = client.db.cart
    data = request.json
    cart_collection.insert_one(data)
    return jsonify({'message': 'Product added to cart'}), 200

@app.route('/product', methods=['POST'])
def insert_product():
    try:
        product_data = request.form.to_dict()

        # Handle image files
        images = {}
        for image_type in ['frontImage', 'backImage', 'sideImage', 'extraImage']:
            if image_type in request.files:
                image = request.files[image_type]
                images[image_type] = base64.b64encode(image.read()).decode('utf-8')

        product_data.update(images)

        if 'offer_end_time' in product_data:
            product_data['offer_end_time'] = datetime.datetime.strptime(product_data['offer_end_time'], '%Y-%m-%dT%H:%M')

        product_collection.insert_one(product_data)
        return jsonify({'message': 'Product added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/products', methods=['GET'])
def get_products():
    try:
        products = list(product_collection.find({}))

        for product in products:
            product['_id'] = str(product['_id'])
            
            # Calculate remaining offer time
            if 'offer_end_time' in product:
                offer_end_time = product['offer_end_time']
                current_time = datetime.datetime.now()
                remaining_time = offer_end_time - current_time
                product['remaining_offer_time'] = remaining_time.total_seconds()
            else:
                product['remaining_offer_time'] = None
    
        return jsonify(products)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/product_specific/<product_type>', methods=['GET'])
def get_products_by_type(product_type):
    try:
        products = list(product_collection.find({'type': product_type}))

        if products:
            for product in products:
                product['_id'] = str(product['_id'])
                
                # Calculate remaining offer time
                if 'offer_end_time' in product:
                    offer_end_time = product['offer_end_time']
                    current_time = datetime.datetime.now()
                    remaining_time = offer_end_time - current_time
                    product['remaining_offer_time'] = remaining_time.total_seconds()
                else:
                    product['remaining_offer_time'] = None

            return jsonify(products)
        else:
            return jsonify({'message': 'No products found for the specified type'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
