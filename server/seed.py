import os
from dotenv import load_dotenv
from app import app, db, User, GameEntry
from werkzeug.security import generate_password_hash

load_dotenv()

with app.app_context():
    print("Deleting existing data...")
    GameEntry.query.delete()
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

    print("Creating seed game entries...")
    games = [
        GameEntry(
            user_id=user1.id,
            title="Elden Ring",
            platform="PC",
            status="Playing",
            rating=5,
            hours_played=85.5
        ),
        GameEntry(
            user_id=user1.id,
            title="Hades",
            platform="PC",
            status="Completed",
            rating=5,
            hours_played=45.0
        ),
        GameEntry(
            user_id=user1.id,
            title="Cyberpunk 2077",
            platform="PC",
            status="Backlog",
            rating=None,
            hours_played=0.0
        ),
        GameEntry(
            user_id=user2.id,
            title="Baldur's Gate 3",
            platform="PS5",
            status="Playing",
            rating=5,
            hours_played=120.0
        )
    ]

    db.session.add_all(games)
    db.session.commit()

    print("Database seeded successfully!")