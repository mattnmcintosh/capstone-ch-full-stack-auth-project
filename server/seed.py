import os
from dotenv import load_dotenv
from app import app, db, User, Genre, GameEntry
from werkzeug.security import generate_password_hash

load_dotenv()

with app.app_context():
    print("Deleting existing data...")
    GameEntry.query.delete()
    Genre.query.delete()
    User.query.delete()

    print("Creating seed users...")
    user1 = User(
        username="gamer_matt",
        password_hash=generate_password_hash("password123")
    )
    user2 = User(
        username="completionist_pro",
        password_hash=generate_password_hash("securepass456")
    )

    db.session.add_all([user1, user2])
    db.session.commit()

    print("Creating comprehensive seed genres...")
    genres_data = [
        "Action",
        "Action-Adventure",
        "RPG",
        "Strategy",
        "Simulation",
        "Sports & Racing",
        "Puzzle",
        "Platformer",
        "Fighting",
        "Horror",
        "Roguelike / Metroidvania",
        "Visual Novel / Indie"
    ]
    
    genre_objects = {}
    for name in genres_data:
        g = Genre(name=name)
        db.session.add(g)
        genre_objects[name] = g
    
    db.session.commit()

    print("Creating seed game entries...")
    games = [
        GameEntry(
            user_id=user1.id,
            genre_id=genre_objects["RPG"].id,
            title="Elden Ring",
            platform="PC",
            status="Playing",
            rating=5,
            hours_played=85.5
        ),
        GameEntry(
            user_id=user1.id,
            genre_id=genre_objects["Roguelike / Metroidvania"].id,
            title="Hades",
            platform="PC",
            status="Completed",
            rating=5,
            hours_played=45.0
        ),
        GameEntry(
            user_id=user1.id,
            genre_id=genre_objects["Action-Adventure"].id,
            title="Cyberpunk 2077",
            platform="PC",
            status="Backlog",
            rating=None,
            hours_played=0.0
        ),
        GameEntry(
            user_id=user2.id,
            genre_id=genre_objects["RPG"].id,
            title="Baldur's Gate 3",
            platform="PS5",
            status="Playing",
            rating=5,
            hours_played=120.0
        )
    ]

    db.session.add_all(games)
    db.session.commit()

    print("Database seeded successfully with Users, Genres, and Games!")