import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5555/api',
});

// Automatically attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper auth services
export const loginUser = async (credentials) => {
  const response = await API.post('/login', credentials);
  localStorage.setItem('token', response.data.access_token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post('/users', userData);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

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