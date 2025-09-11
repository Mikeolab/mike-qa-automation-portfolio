import axios from "axios";
import Cookies from "js-cookie";
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = Cookies.get("accessToken");

    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear any auth tokens
      Cookies.remove("accessToken");

      // Redirect to unauthorized page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const axiosInstanceFormData = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Add request interceptor
axiosInstanceFormData.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = Cookies.get("accessToken");

    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstanceFormData.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear any auth tokens
      Cookies.remove("accessToken");

      // Redirect to unauthorized page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
