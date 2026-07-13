// api/api.ts
import axios from 'axios';


const apiClient = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
  timeout: 15000,
});


export default apiClient;