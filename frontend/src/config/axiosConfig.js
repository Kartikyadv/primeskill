// src/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: true,
});

export default axiosInstance;
