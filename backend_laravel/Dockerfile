FROM php:8.2-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpq-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring xml bcmath \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar composer files primero para cachear dependencias
COPY composer.json composer.lock* ./

RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copiar el resto del código
COPY . .

# Generar autoloader optimizado
RUN composer dump-autoload --optimize

# Permisos para storage y cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8000 8001 8002 8003 8004 8005 8006 8007 8008

# Por defecto arranca el gateway, pero docker-compose sobreescribe con command
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
