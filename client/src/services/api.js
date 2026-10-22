import axios from 'axios';

// Create an Axios instance configured for your Flask backend
const API = axios.create({
  baseURL: 'http://localhost:5555/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach the JWT token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
export const registerUser = async (credentials) => {
  const response = await API.post('/register', credentials);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post('/login', credentials);
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

// Game CRUD Services
export const getGames = async () => {
  const response = await API.get('/games');
  return response.data;
};

export const createGame = async (gameData) => {
  const response = await API.post('/games', gameData);
  return response.data;
};

export const updateGame = async (id, gameData) => {
  const response = await API.patch(`/games/${id}`, gameData);
  return response.data;
};

export const deleteGame = async (id) => {
  const response = await API.delete(`/games/${id}`);
  return response.data;
};

export default API;