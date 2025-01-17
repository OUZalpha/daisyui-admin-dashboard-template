import axios from 'axios';

const api = axios.create({
  baseURL: 'https://wellbe-api.onrender.com/api/v1', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
