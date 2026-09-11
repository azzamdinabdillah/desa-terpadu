# 🐳 Docker Production Guide — Desa Terpadu

## Struktur File Docker

```
docker/
├── Dockerfile                   # Multi-stage build (Node → Composer → PHP-FPM+Nginx)
├── docker-compose.yml           # Orkestrasi semua services
├── .env.docker                  # Template environment variables (wajib diisi)
├── nginx/
│   ├── nginx.conf               # Konfigurasi Nginx utama
│   └── default.conf             # Virtual host Laravel
├── php/
│   ├── php.ini                  # PHP production settings
│   └── php-fpm.conf             # PHP-FPM pool configuration
├── mysql/
│   ├── init.sql                 # Inisialisasi database
│   └── my.cnf                   # MySQL performance tuning
├── supervisor/
│   └── supervisord.conf         # Process manager (Nginx + FPM + Queue)
└── scripts/
    ├── entrypoint.sh            # Startup script container
    └── deploy.sh                # Script deploy ke server
```

---

## Tech Stack di Docker

| Service   | Image                      | Fungsi             |
| --------- | -------------------------- | ------------------ |
| **app**   | PHP 8.3-FPM Alpine + Nginx | Laravel + Frontend |
| **db**    | MySQL 8.4                  | Database           |
| **redis** | Redis 7.4 Alpine           | Cache & Queue      |

---

## 🚀 Cara Deploy ke Server

### Langkah 1 — Clone repo ke server

```bash
git clone https://github.com/your-repo/desa-terpadu-2.git
cd desa-terpadu-2
```

### Langkah 2 — Siapkan environment file

```bash
cp docker/.env.docker docker/.env.docker.local
nano docker/.env.docker.local  # atau gunakan editor favorit
```

**Wajib diisi di `.env.docker.local`:**

```env
APP_KEY=          # Generate dengan: php artisan key:generate --show
APP_URL=          # https://yourdomain.com
DB_PASSWORD=      # password kuat untuk user database
DB_ROOT_PASSWORD= # password root MySQL
REDIS_PASSWORD=   # password Redis (opsional tapi recommended)
```

> **Generate APP_KEY:**
>
> ```bash
> docker run --rm php:8.3-alpine php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
> ```

### Langkah 3 — Deploy

```bash
bash docker/scripts/deploy.sh
```

Atau manual:

```bash
# Build & start semua services
docker compose -f docker/docker-compose.yml --env-file docker/.env.docker.local up -d --build

# Lihat logs
docker compose -f docker/docker-compose.yml logs -f app
```

---

## 📋 Perintah Berguna

```bash
# Masuk ke container app
docker exec -it desa-terpadu-app sh

# Jalankan artisan command
docker exec -it desa-terpadu-app php artisan migrate
docker exec -it desa-terpadu-app php artisan db:seed
docker exec -it desa-terpadu-app php artisan cache:clear

# Lihat logs
docker compose -f docker/docker-compose.yml logs -f app
docker compose -f docker/docker-compose.yml logs -f db
docker compose -f docker/docker-compose.yml logs -f redis

# Restart services
docker compose -f docker/docker-compose.yml restart app

# Stop semua
docker compose -f docker/docker-compose.yml down

# Stop + hapus volumes (⚠️ data hilang!)
docker compose -f docker/docker-compose.yml down -v
```

---

## 🔒 Setup SSL (HTTPS)

Jika server punya domain dan mau pakai **Let's Encrypt**:

### Opsi A — Gunakan Nginx di host (recommended)

Install Nginx dan Certbot di host, lalu proxy ke container port 80:

```nginx
server {
    server_name yourdomain.com;
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
}
```

```bash
sudo certbot --nginx -d yourdomain.com
```

### Opsi B — Uncomment certbot di docker-compose.yml

Uncomment section `proxy` dan `certbot` di `docker/docker-compose.yml`.

---

## 🔄 Update Aplikasi

```bash
git pull origin main
bash docker/scripts/deploy.sh
```

Script deploy otomatis akan:

1. Build ulang image dengan kode terbaru
2. Jalankan `php artisan migrate`
3. Jalankan `php artisan config:cache`, `route:cache`, `view:cache`
4. Restart container

---

## 🗄️ Backup Database

```bash
# Backup
docker exec desa-terpadu-db mysqldump -u root -p${DB_ROOT_PASSWORD} desa_terpadu > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i desa-terpadu-db mysql -u root -p${DB_ROOT_PASSWORD} desa_terpadu < backup.sql
```
