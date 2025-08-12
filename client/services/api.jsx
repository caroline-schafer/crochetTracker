// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper to get token from storage
async function getToken() {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem('userToken');
  } else {
    return await SecureStore.getItemAsync('userToken');
  }
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    // Don't attach token for public auth endpoints
    const publicEndpoints = ['/users/signup/', '/users/login/'];
    const isPublic = publicEndpoints.some((endpoint) => config.url?.endsWith(endpoint));

    if (!isPublic) {
      const token = await getToken();
      console.log("TOKEN FOUND: ", token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("SENDING WITH TOKEN");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Optional: Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle common errors here, e.g., 401 Unauthorized
    return Promise.reject(error);
  }
);

export default api;
