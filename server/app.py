import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Enable CORS for frontend integration
CORS(app)

# Configuration from environment variables
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_VERIFY_SUB'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # One-to-many relationship with cascade delete
    games = db.relationship('GameEntry', backref='user', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username
        }

class GameEntry(db.Model):
    __tablename__ = 'game_entries'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    platform = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(30), default='Backlog')  # Backlog, Playing, Completed, Dropped
    rating = db.Column(db.Integer, nullable=True)         # 1-5 stars
    hours_played = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "platform": self.platform,
            "status": self.status,
            "rating": self.rating,
            "hours_played": self.hours_played
        }


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password_hash=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully", "user": new_user.to_dict()}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({
        "access_token": access_token,
        "user": user.to_dict()
    }), 200

@app.route('/api/games', methods=['GET'])
@jwt_required()
def get_games():
    current_user_id = get_jwt_identity()
    user_games = GameEntry.query.filter_by(user_id=current_user_id).all()
    return jsonify([game.to_dict() for game in user_games]), 200

@app.route('/api/games', methods=['POST'])
@jwt_required()
def create_game():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not data.get('title'):
        return jsonify({"error": "Game title is required"}), 400

    new_game = GameEntry(
        user_id=current_user_id,
        title=data.get('title'),
        platform=data.get('platform'),
        status=data.get('status', 'Backlog'),
        rating=data.get('rating'),
        hours_played=data.get('hours_played', 0.0)
    )

    db.session.add(new_game)
    db.session.commit()

    return jsonify(new_game.to_dict()), 201

@app.route('/api/games/<int:id>', methods=['PATCH'])
@jwt_required()
def update_game(id):
    current_user_id = get_jwt_identity()
    game = GameEntry.query.filter_by(id=id, user_id=current_user_id).first()

    if not game:
        return jsonify({"error": "Game entry not found"}), 404

    data = request.get_json()
    game.title = data.get('title', game.title)
    game.platform = data.get('platform', game.platform)
    game.status = data.get('status', game.status)
    game.rating = data.get('rating', game.rating)
    game.hours_played = data.get('hours_played', game.hours_played)

    db.session.commit()
    return jsonify(game.to_dict()), 200

@app.route('/api/games/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_game(id):
    current_user_id = get_jwt_identity()
    game = GameEntry.query.filter_by(id=id, user_id=current_user_id).first()

    if not game:
        return jsonify({"error": "Game entry not found"}), 404

    db.session.delete(game)
    db.session.commit()
    return jsonify({"message": "Game entry deleted successfully"}), 200

# --- HEALTH CHECK ---

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "running"}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5555))
    app.run(port=port, debug=True)