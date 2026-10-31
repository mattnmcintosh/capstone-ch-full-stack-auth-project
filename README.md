# 🎮 Completionist Hub

> A full-stack video game backlog tracking and completionist web application built to help gamers conquer their digital libraries.

---

## ✨ Key Features

* **Secure Authentication:** JWT-based user registration and login with protected API routes and isolated user data.
* **Comprehensive Backlog Management:** Full CRUD operations (Create, Read, Update, Delete) for tracking game titles, platforms, play status, ratings, hours played, and personal notes.
* **Real-Time Title Search & Filters:** Instantly search by title and filter your backlog by Status (Backlog, Playing, Completed, Dropped) and Genre (RPG, Action-Adventure, Roguelike, etc.).
* **Quick Status Cycling:** Clickable status chips on game cards that instantly cycle status without opening a modal.
* **Advanced Sorting:** Sort libraries by Title (A-Z), Playtime (High to Low), or Rating (High to Low) with intelligent tiebreakers.
* **Personal Notes & Mini-Reviews:** Jot down boss strategies, progress thoughts, or mini-reviews for each game entry.
* **Visual Progress Tracking:** Real-time stats summary paired with a dynamic completion percentage progress bar.
* **CSV Library Export:** One-click export to download your entire game library as a spreadsheet.
* **Custom Dark Theme:** A sleek, gamer-focused UI built using Material-UI (MUI).

---

## 🛠️ Tech Stack

### **Backend**
* **Python 3.x / Flask** (REST API)
* **Flask-SQLAlchemy** (ORM & Database Management)
* **Flask-JWT-Extended** (Token-based Authentication)
* **Flask-Migrate** (Database Migrations)
* **PostgreSQL & psycopg2**
* **Werkzeug Security (Password Hashing)**

### **Frontend**
* **React 18+** (Single-Page Application)
* **Material-UI (MUI)** (Component Library & Custom Styling)
* **Vite** (Lightning-fast Build Tool & Dev Server)
* **Axios** (API Client Integration)

---

## 📊 Database Architecture

The application utilizes a robust relational database schema consisting of three primary models:
1. **`User`**: Manages credentials and links securely to user-owned records.
2. **`Genre`**: Categorizes game entries (seeded with 12 industry-standard genres).
3. **`GameEntry`**: The core resource linked via a One-to-Many relationship to both User and Genre, including support for personal notes and hours tracking.

---

## 🚀 Getting Started & Local Installation

### Prerequisites
* Python (3.8+)
* Node.js & npm
* PostgreSQL & Git

### 1. Clone the Repository
```bash
git clone https://github.com/mattnmcintosh/capstone-ch-full-stack-auth-project
cd capstone-ch-full-stack-auth-project
```

### 2. Backend Setup (`/server`)
Navigate to the server directory, create a virtual environment, install dependencies, and run database migrations/seeds:

```bash
cd server
python -m venv venv

# Activate Virtual Environment (Windows PowerShell)
.\venv\Scripts\Activate
# (macOS/Linux: source venv/bin/activate)

pip install -r requirements.txt

# Run migrations and seed the database
flask --app app.py db upgrade
python seed.py

# Start the Flask development server
python app.py
```
*(The backend runs locally at `http://localhost:5555`)*

### 3. Frontend Setup (`/client`)
Open a new terminal window, navigate to the client directory, install dependencies, and start the Vite dev server:

```bash
cd client
npm install

# Create a local environment file
echo "VITE_API_URL=http://localhost:5555/api" > .env

# Start the React development server
npm run dev
```
*(The frontend runs locally at `http://localhost:5173`)*

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/register` | Register a new user | No |
| **POST** | `/api/login` | Authenticate user and return JWT | No |
| **GET** | `/api/games` | Retrieve all games for logged-in user | Yes |
| **POST** | `/api/games` | Create a new game entry | Yes |
| **PATCH** | `/api/games/:id` | Update an existing game entry | Yes |
| **DELETE** | `/api/games/:id` | Delete a game entry | Yes |
| **GET** | `/api/genres` | Retrieve all available game genres | Yes |

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.