// api/api.ts
import axios from 'axios';


const apiClient = axios.create({
  baseURL: 'https://iteach-backend-fkgpu.ondigitalocean.app',
  timeout: 15000,
});


export default apiClient;