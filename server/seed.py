from app import app
from extensions import db
from models import User, Genre, GameEntry

def seed_database():
    with app.app_context():
        print("🌱 Starting database seeding...")

        print("🔨 Creating database tables...")
        db.create_all()

        print("🧹 Deleting existing data...")
        GameEntry.query.delete()
        Genre.query.delete()
        User.query.delete()
        db.session.commit()

        print("👤 Creating seed users...")
        user1 = User(username="gamer_matt")
        user1.set_password("password123")
        
        user2 = User(username="completionist_pro")
        user2.set_password("password123")

        db.session.add_all([user1, user2])
        db.session.commit()

        print("📚 Creating genres...")
        genres_data = [
            "RPG",
            "Action-Adventure",
            "Platformer",
            "Strategy",
            "Survival Horror",
            "Puzzle"
        ]
        
        genres = {name: Genre(name=name) for name in genres_data}
        db.session.add_all(genres.values())
        db.session.commit()

        print("🎮 Creating game entries across genres and statuses...")
        
        # Comprehensive dataset covering all genres and status permutations
        sample_games = [
            {
                "title": "Castlevania: Symphony of the Night",
                "platform": "PlayStation",
                "status": "Completed",
                "rating": 5,
                "hours_played": 20.0,
                "genre": "Platformer"
            },
            {
                "title": "Shin Megami Tensei V",
                "platform": "Nintendo Switch",
                "status": "Playing",
                "rating": 4,
                "hours_played": 35.5,
                "genre": "RPG"
            },
            {
                "title": "The Witcher 3: Wild Hunt",
                "platform": "PC",
                "status": "Backlog",
                "rating": None,
                "hours_played": 0.0,
                "genre": "RPG"
            },
            {
                "title": "Portal 2",
                "platform": "PC",
                "status": "Completed",
                "rating": 5,
                "hours_played": 12.0,
                "genre": "Puzzle"
            },
            {
                "title": "Civilization VI",
                "platform": "PC",
                "status": "Playing",
                "rating": 4,
                "hours_played": 85.0,
                "genre": "Strategy"
            },
            {
                "title": "Silent Hill 2",
                "platform": "PlayStation 2",
                "status": "Completed",
                "rating": 5,
                "hours_played": 9.5,
                "genre": "Survival Horror"
            },
            {
                "title": "Metroid Dread",
                "platform": "Nintendo Switch",
                "status": "Dropped",
                "rating": 3,
                "hours_played": 4.0,
                "genre": "Platformer"
            },
            {
                "title": "Hades",
                "platform": "PC",
                "status": "Completed",
                "rating": 5,
                "hours_played": 50.0,
                "genre": "Action-Adventure"
            }
        ]

        for data in sample_games:
            game = GameEntry(
                title=data["title"],
                platform=data["platform"],
                status=data["status"],
                rating=data["rating"],
                hours_played=data["hours_played"],
                user_id=user1.id,
                genre_id=genres[data["genre"]].id
            )
            db.session.add(game)

        db.session.commit()
        print("🚀 Database seeded successfully with full genre & status variety!")

if __name__ == "__main__":
    seed_database()