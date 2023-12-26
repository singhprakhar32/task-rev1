import axios from "axios";
const BASE_URL = "http://localhost:5000/api";
const axiosInstance = axios.createInstance();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;
export default axiosInstance;