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

    print("Creating classic game entries across all genres for both test users...")
    games = [
        # Action
        GameEntry(user_id=user1.id, genre_id=genre_objects["Action"].id, title="Doom (1993)", platform="PC", status="Completed", rating=5, hours_played=25.0),
        GameEntry(user_id=user2.id, genre_id=genre_objects["Action"].id, title="Devil May Cry 5", platform="PC", status="Playing", rating=5, hours_played=40.0),
        
        # Action-Adventure
        GameEntry(user_id=user1.id, genre_id=genre_objects["Action-Adventure"].id, title="The Legend of Zelda: Ocarina of Time", platform="Switch", status="Completed", rating=5, hours_played=50.0),
        GameEntry(user_id=user2.id, genre_id=genre_objects["Action-Adventure"].id, title="Grand Theft Auto V", platform="PC", status="Completed", rating=5, hours_played=120.0),
        
        # RPG
        GameEntry(user_id=user1.id, genre_id=genre_objects["RPG"].id, title="Chrono Trigger", platform="PC", status="Completed", rating=5, hours_played=30.0),
        GameEntry(user_id=user2.id, genre_id=genre_objects["RPG"].id, title="Baldur's Gate 3", platform="PS5", status="Playing", rating=5, hours_played=115.0),
        
        # Strategy
        GameEntry(user_id=user1.id, genre_id=genre_objects["Strategy"].id, title="Civilization VI", platform="PC", status="Playing", rating=4, hours_played=150.0),
        GameEntry(user_id=user2.id, genre_id=genre_objects["Strategy"].id, title="Age of Empires II", platform="PC", status="Completed", rating=5, hours_played=90.0),
        
        # Simulation
        GameEntry(user_id=user1.id, genre_id=genre_objects["Simulation"].id, title="The Sims 4", platform="PC", status="Backlog", rating=3, hours_played=15.0),
        GameEntry(user_id=user2.id, genre_id=genre_objects["Simulation"].id, title="Cities: Skylines", platform="PC", status="Completed", rating=4, hours_played=75.0),
        
        # Sports & Racing
        GameEntry(user_id=user1.id, genre_id=genre_objects["Sports & Racing"].id, title="Rocket League", platform="PC", status="Playing", rating=5, hours_played=300.0),
        GameEntry(user_id=user2.id, genre_id=genre_objects["Sports & Racing"].id, title="Forza Horizon 5", platform="PC", status="Completed", rating=5, hours_played=65.0),
        
        # Puzzle
        GameEntry(user_id=user1.id, genre_id=genre_objects["Puzzle"].id, title="Tetris Effect", platform="PC", status="Completed", rating=5, hours_played=20.0),
        GameEntry(user_id=user2.id, genre_id=genre_objects["Puzzle"].id, title="Portal 2", platform="PC", status="Completed", rating=5, hours_played=12.0),
        
        # Platformer
        GameEntry(user_id=user1.id, genre_id=genre_objects["Platformer"].id, title="Super Mario World", platform="Switch", status="Completed", rating=5, hours_played=10.0),
        GameEntry(user_id=user2.id, genre_id=genre_objects["Platformer"].id, title="Celeste", platform="PC", status="Completed", rating=5, hours_played=25.0),
        
        # Fighting
        GameEntry(user_id=user1.id, genre_id=genre_objects["Fighting"].id, title="Street Fighter II", platform="Switch", status="Completed", rating=4, hours_played=18.0),
        GameEntry(user_id=user2.id, genre_id=genre_objects["Fighting"].id, title="Super Smash Bros. Ultimate", platform="Switch", status="Playing", rating=5, hours_played=200.0),
        
        # Horror
        GameEntry(user_id=user1.id, genre_id=genre_objects["Horror"].id, title="Resident Evil 2 (Remake)", platform="PC", status="Completed", rating=5, hours_played=22.0),
        GameEntry(user_id=user2.id, genre_id=genre_objects["Horror"].id, title="Silent Hill 2", platform="PC", status="Completed", rating=5, hours_played=15.0),
        
        # Roguelike / Metroidvania
        GameEntry(user_id=user1.id, genre_id=genre_objects["Roguelike / Metroidvania"].id, title="Castlevania: Symphony of the Night", platform="PS", status="Completed", rating=5, hours_played=35.0),
        GameEntry(user_id=user2.id, genre_id=genre_objects["Roguelike / Metroidvania"].id, title="Hades", platform="PC", status="Completed", rating=5, hours_played=60.0),
        
        # Visual Novel / Indie
        GameEntry(user_id=user1.id, genre_id=genre_objects["Visual Novel / Indie"].id, title="Undertale", platform="PC", status="Completed", rating=5, hours_played=10.0),
        GameEntry(user_id=user2.id, genre_id=genre_objects["Visual Novel / Indie"].id, title="Disco Elysium", platform="PC", status="Completed", rating=5, hours_played=45.0)
    ]

    db.session.add_all(games)
    db.session.commit()

    print("Database successfully seeded with users, all genres, and iconic classic games!")