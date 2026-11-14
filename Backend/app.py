from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta
from functools import wraps
import json

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Secret key for JWT (in production, use a strong secret key from environment variables)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', '0e8e30c6d856950f4036a791aaeb32dcf24bfbad60694bb148e331e28741581f')

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the model with correct configuration
generation_config = {
    "temperature": 0.4,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 1800,
}

safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

# Try different model names - using the latest available models
try:
    model = genai.GenerativeModel(
        model_name='models/gemini-2.5-flash',
        generation_config=generation_config,
        safety_settings=safety_settings
    )
    print("✓ Using model: gemini-2.5-flash")
except Exception as e:
    try:
        model = genai.GenerativeModel(
            model_name='models/gemini-1.5-flash',
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        print("✓ Using model: gemini-1.5-flash")
    except Exception as e2:
        print(f"⚠ Error initializing model: {e2}")
        model = None

# Simple in-memory user storage (in production, use a database)
users_db = {}

# Load users from file if exists
USER_FILE = 'users.json'
if os.path.exists(USER_FILE):
    try:
        with open(USER_FILE, 'r') as f:
            users_db = json.load(f)
    except:
        users_db = {}

def save_users():
    """Save users to file"""
    with open(USER_FILE, 'w') as f:
        json.dump(users_db, f)

def token_required(f):
    """Decorator to check if token is valid"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users_db.get(data['email'])
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Backend is running'}), 200

# API status endpoint — lets frontend check if Gemini key is configured
@app.route('/api-status', methods=['GET'])
def api_status():
    return jsonify({
        'gemini_configured': bool(GEMINI_API_KEY),
        'model_ready': model is not None,
        'status': 'ready' if (GEMINI_API_KEY and model) else 'not_configured'
    }), 200

# List available models endpoint
@app.route('/models', methods=['GET'])
def list_models():
    try:
        models = genai.list_models()
        available_models = []
        for m in models:
            if 'generateContent' in m.supported_generation_methods:
                available_models.append(m.name)
        return jsonify({
            'success': True,
            'models': available_models
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Signup endpoint
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        email = data.get('email', '').lower()
        password = data.get('password', '')
        name = data.get('name', '')
        
        if not email or not password or not name:
            return jsonify({'error': 'All fields are required'}), 400
        
        if email in users_db:
            return jsonify({'error': 'User already exists'}), 400
        
        # Store user (in production, hash the password!)
        users_db[email] = {
            'email': email,
            'password': password,  # In production, use bcrypt or similar to hash
            'name': name,
            'created_at': datetime.now().isoformat()
        }
        
        save_users()
        
        # Generate token
        token = jwt.encode({
            'email': email,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'email': email,
                'name': name
            }
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email', '').lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = users_db.get(email)
        
        if not user or user['password'] != password:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate token
        token = jwt.encode({
            'email': email,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'email': user['email'],
                'name': user['name']
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Chat endpoint (original, kept for backward compatibility)
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        if model is None:
            return jsonify({
                'error': 'Model not initialized. Please check your API key and internet connection.'
            }), 500
        
        health_context = """You are a helpful medical assistant chatbot. 
        Provide informative and compassionate responses to health-related questions.
        Always remind users to consult healthcare professionals for serious concerns.
        If the question is not health-related, politely redirect to health topics."""
        
        full_prompt = f"{health_context}\n\nUser question: {user_message}"
        
        response = model.generate_content(full_prompt)
        bot_response = response.text
        
        return jsonify({
            'success': True,
            'response': bot_response,
            'message': user_message
        }), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while processing your request',
            'details': str(e)
        }), 500

# Chat endpoint with conversation history
@app.route('/chat-with-history', methods=['POST'])
def chat_with_history():
    try:
        data = request.json
        user_message = data.get('message', '')
        conversation_history = data.get('history', [])
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        if model is None:
            return jsonify({
                'error': 'Model not initialized'
            }), 500
        
        # Build context from conversation history
        health_context = """You are a helpful medical assistant chatbot. 
        Provide informative and compassionate responses to health-related questions.
        Always remind users to consult healthcare professionals for serious concerns.
        Keep track of the conversation context and provide relevant follow-up responses."""
        
        # Format conversation history
        context = health_context + "\n\nConversation history:\n"
        for msg in conversation_history[-10:]:  # Last 10 messages for context
            role = "User" if msg.get('role') == 'user' else "Assistant"
            content = msg.get('content', '')
            context += f"{role}: {content}\n"
        
        # Add current message
        full_prompt = f"{context}\nUser: {user_message}\nAssistant:"
        
        # Generate response
        response = model.generate_content(full_prompt)
        
        return jsonify({
            'success': True,
            'response': response.text,
            'message': user_message
        }), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while processing your request',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    # Check if API key is configured
    if not GEMINI_API_KEY:
        print("⚠ WARNING: GEMINI_API_KEY not found in environment variables!")
        print("Please create a .env file with your API key")
    else:
        print("✓ Gemini API key loaded successfully")
    
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000)