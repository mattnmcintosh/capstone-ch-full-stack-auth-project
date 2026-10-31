import axios from 'axios';

// Create an Axios instance pointing to your Flask API
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5555/api',
});

// Automatically attach the JWT token to every outgoing request header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Authentication API Endpoints

export const loginUser = async (credentials) => {
  const response = await API.post('/login', credentials);
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post('/register', userData);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

// Game API Endpoints

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