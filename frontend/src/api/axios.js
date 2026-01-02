import axios from "axios";

const api = axios.create({
  baseURL: "https://task-tracker-mern-9fla.onrender.com/api"
});

export default api;
