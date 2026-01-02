import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  console.error("❌ VITE_API_BASE_URL is missing at runtime");
}

const api = axios.create({
  baseURL
});

export default api;
