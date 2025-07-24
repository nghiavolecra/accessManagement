// frontend/src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL  // or process.env.VITE_API_URL
})

export default api
