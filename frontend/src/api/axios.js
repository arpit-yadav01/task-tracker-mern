import axios from "axios";

// HARD GUARANTEED BASE URL
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://task-tracker-mern-9fla.onrender.com/api"
});

export default api;
