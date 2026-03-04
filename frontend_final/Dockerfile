FROM node:22-alpine AS build

WORKDIR /app

# Copiar package files primero para cachear dependencias
COPY package.json package-lock.json* ./

RUN npm install

# Copiar el resto del código
COPY . .

# Build args para las URLs de los backends (se inyectan en build time)
ARG VITE_LARAVEL_URL=http://localhost:8000
ARG VITE_FASTAPI_URL=http://localhost:5005

RUN npm run build

# --- Stage 2: servir con nginx ---
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Configuración de nginx para SPA (react-router)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
