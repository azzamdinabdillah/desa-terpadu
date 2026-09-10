# =============================================================================
# Stage 1: Node.js Build Stage (Frontend Assets)
# =============================================================================
FROM node:22-alpine AS node-builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including optional linux binaries for rollup/tailwind)
RUN npm ci --include=optional

# Copy source files needed for build
COPY resources/ resources/
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY .env.example .env

# Placeholder APP env so Vite can build
ENV VITE_APP_NAME="Desa Terpadu"

# Build frontend assets
RUN npm run build


# =============================================================================
# Stage 2: Composer / PHP Dependencies
# =============================================================================
FROM composer:2.8 AS composer-builder

WORKDIR /app

COPY composer.json composer.lock ./

# Install PHP dependencies without dev deps
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --prefer-dist \
    --no-scripts


# =============================================================================
# Stage 3: Final Production Image
# =============================================================================
FROM php:8.3-fpm-alpine AS production

LABEL maintainer="Desa Terpadu Team"
LABEL description="Laravel 12 + React + Inertia.js - Desa Terpadu Application"

# Install system dependencies
RUN apk add --no-cache \
    # Networking & utilities
    curl \
    wget \
    # For PHP extensions
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    libxml2-dev \
    # MySQL client
    mysql-client \
    # Nginx
    nginx \
    # Supervisor (process manager)
    supervisor \
    # Timezone
    tzdata

# Set timezone to Asia/Jakarta
RUN cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime && \
    echo "Asia/Jakarta" > /etc/timezone

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        mbstring \
        zip \
        exif \
        pcntl \
        bcmath \
        gd \
        intl \
        xml \
        opcache

# Install Redis extension via PECL
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy PHP dependencies from composer stage
COPY --from=composer-builder /app/vendor ./vendor

# Copy application source
COPY . .

# Copy built frontend assets from node stage
COPY --from=node-builder /app/public/build ./public/build

# Copy Docker configuration files
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/php/php.ini $PHP_INI_DIR/conf.d/app.ini
COPY docker/php/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/scripts/entrypoint.sh /usr/local/bin/entrypoint.sh

# Make entrypoint executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Create storage directories if not exist
RUN mkdir -p storage/framework/{sessions,views,cache} \
    storage/logs \
    bootstrap/cache

# Optimize PHP OPcache
RUN echo "opcache.enable=1" >> $PHP_INI_DIR/conf.d/app.ini \
    && echo "opcache.memory_consumption=256" >> $PHP_INI_DIR/conf.d/app.ini \
    && echo "opcache.max_accelerated_files=20000" >> $PHP_INI_DIR/conf.d/app.ini \
    && echo "opcache.validate_timestamps=0" >> $PHP_INI_DIR/conf.d/app.ini

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
