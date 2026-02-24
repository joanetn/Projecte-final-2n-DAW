import axios from 'axios';

export const laravel = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true
})

export const fastapi = axios.create({
    baseURL: "http://localhost:5005",
    withCredentials: true
})

// laravel.interceptors.request.use(config => {
//     const token = localStorage.getItem("token")
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     return config;
// })