// api/api.ts
import axios from 'axios';


const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 15000,
});


export default apiClient;