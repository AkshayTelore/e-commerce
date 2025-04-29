import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Use the environment variable
})

export default instance

