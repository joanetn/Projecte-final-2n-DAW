import axios from 'axios';

export const laravel = axios.create({
    baseURL: "http://localhost:4004",
    withCredentials: true
});

export const fastapi = axios.create({
    baseURL: "http://localhost:8000",
});
