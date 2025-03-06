import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// ✅ Request Interceptor: Attach Token Dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Only set Content-Type if not already defined (e.g., for FormData)
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor: Handle 401 Unauthorized Globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
