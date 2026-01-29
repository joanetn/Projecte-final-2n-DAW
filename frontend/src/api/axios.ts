import axios from 'axios';
export const laravel = axios.create({
    baseURL: "http://localhost:4004",
    withCredentials: true
});
export const fastapi = axios.create({
    baseURL: "http://localhost:8000",
});
export const backend_rapid = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true
})
backend_rapid.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
