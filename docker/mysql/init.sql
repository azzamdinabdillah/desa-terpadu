-- =============================================================================
-- MySQL Initialization Script
-- Dijalankan otomatis saat container pertama kali dibuat
-- =============================================================================

-- Set proper character set
ALTER DATABASE `desa_terpadu` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant privileges (user sudah dibuat via MYSQL_USER env)
GRANT ALL PRIVILEGES ON `desa_terpadu`.* TO '${DB_USERNAME}'@'%';
FLUSH PRIVILEGES;
