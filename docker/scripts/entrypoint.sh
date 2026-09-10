#!/bin/sh
set -e

# =============================================================================
# Docker Entrypoint Script - Desa Terpadu
# Runs before supervisor starts
# =============================================================================

echo "=============================================="
echo " Starting Desa Terpadu Application"
echo "=============================================="

# Wait for MySQL to be ready
echo "[1/7] Waiting for MySQL to be ready..."
until php -r "
    \$pdo = new PDO(
        'mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_DATABASE'),
        getenv('DB_USERNAME'),
        getenv('DB_PASSWORD')
    );
    echo 'Connected!';
" 2>/dev/null; do
    echo "    MySQL not ready yet. Retrying in 2s..."
    sleep 2
done
echo "    MySQL is ready!"

# Ensure correct permissions on storage
echo "[2/7] Setting storage permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Create supervisor log directory
mkdir -p /var/log/supervisor
mkdir -p /var/lib/php/session /var/lib/php/wsdlcache /var/lib/php/opcache
chown -R www-data:www-data /var/lib/php

# Laravel cache clear on startup
echo "[3/7] Clearing Laravel caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run migrations
echo "[4/7] Running database migrations..."
php artisan migrate --force

# Run database seeds only on first deploy (check if users table is empty)
echo "[5/7] Checking initial seed..."
SEED_CHECK=$(php artisan tinker --execute="echo \App\Models\User::count();" 2>/dev/null | tail -1)
if [ "$SEED_CHECK" = "0" ]; then
    echo "    No users found. Running database seeder..."
    php artisan db:seed --force
    echo "    Seeding complete!"
else
    echo "    Data already exists. Skipping seeder."
fi

# Optimize for production
echo "[6/7] Optimizing Laravel for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

echo "[7/7] Starting supervisor (Nginx + PHP-FPM + Queue Worker)..."
echo "=============================================="

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
