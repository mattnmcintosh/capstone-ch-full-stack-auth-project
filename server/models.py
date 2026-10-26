from extensions import db
from sqlalchemy_serializer import SerializerMixin
from werkzeug.security import generate_password_hash, check_password_hash

class Genre(db.Model, SerializerMixin):
    __tablename__ = 'genres'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }


class GameEntry(db.Model, SerializerMixin):
    __tablename__ = 'game_entries'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    platform = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(30), nullable=False, default='Backlog')
    rating = db.Column(db.Integer, nullable=True)
    hours_played = db.Column(db.Float, nullable=True, default=0.0)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    genre_id = db.Column(db.Integer, db.ForeignKey('genres.id'), nullable=True)

    @property
    def genre_name(self):
        return self.genre.name if self.genre else 'None'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'platform': self.platform,
            'status': self.status,
            'rating': self.rating,
            'hours_played': self.hours_played,
            'user_id': self.user_id,
            'genre_id': self.genre_id,
            'genre_name': self.genre_name
        }


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username
        }


# Relationships
User.games = db.relationship(GameEntry, backref='user', cascade='all, delete-orphan')
Genre.games = db.relationship(GameEntry, backref='genre', cascade='all, delete-orphan')