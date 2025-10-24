import axios from "axios";

const api = axios.create({
  baseURL: "https://blogstation-asjs.onrender.com/",
  headers: {
    "Content-Type": "application/json"
  }
});

// attach token for protected requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
