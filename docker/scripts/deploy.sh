#!/bin/bash
# =============================================================================
# Deployment Script - Desa Terpadu (Production)
# Jalankan di server: bash docker/scripts/deploy.sh
# =============================================================================

set -e

COMPOSE_FILE="docker/docker-compose.yml"
ENV_FILE="docker/.env.docker"
APP_NAME="desa-terpadu"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   Desa Terpadu - Production Deploy       ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ ERROR: $ENV_FILE tidak ditemukan!"
    echo "   Salin dan isi: cp docker/.env.docker docker/.env.docker"
    echo "   Lalu edit nilainya sebelum deploy."
    exit 1
fi

# Pull latest images
echo "📦 Pulling base Docker images..."
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE pull db redis

# Build application image
echo "🔨 Building application image..."
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE build app

# Stop old containers gracefully
echo "⏹  Stopping old containers..."
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE down --remove-orphans || true

# Start all services
echo "🚀 Starting all services..."
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d

# Wait for app to be healthy
echo "⏳ Waiting for app to be healthy..."
RETRY=0
MAX_RETRY=30
until docker inspect --format='{{.State.Health.Status}}' ${APP_NAME}-app 2>/dev/null | grep -q "healthy"; do
    RETRY=$((RETRY + 1))
    if [ $RETRY -ge $MAX_RETRY ]; then
        echo "❌ App did not become healthy in time!"
        echo "   Lihat logs dengan: docker compose -f $COMPOSE_FILE logs app"
        exit 1
    fi
    echo "   Waiting... ($RETRY/$MAX_RETRY)"
    sleep 5
done

echo ""
echo "✅ Deploy berhasil!"
echo ""
echo "📋 Status containers:"
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE ps
echo ""
echo "🌐 Aplikasi berjalan di: $(grep APP_URL $ENV_FILE | cut -d '=' -f2)"
echo ""
