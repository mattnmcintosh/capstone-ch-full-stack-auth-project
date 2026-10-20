import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Enable CORS for frontend integration
CORS(app)

# Configuration from environment variables
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "running"}), 200

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


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5555))
    app.run(port=port, debug=True)