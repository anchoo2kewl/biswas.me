#!/bin/bash
# Setup nginx reverse proxy for biswas.me
# Backend on 127.0.0.1:8081, Frontend on 127.0.0.1:3000
# SSL: Cloudflare Full (Strict) - uses Cloudflare Origin Certificate
set -e

DOMAIN="biswas.me"
SSL_DIR="/etc/nginx/ssl"

echo "==> Installing nginx if not present..."
if ! command -v nginx &>/dev/null; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -qq
    apt-get install -y -qq -o Dpkg::Options::="--force-confold" nginx
fi

echo "==> Creating rate limiting zone..."
if ! grep -q "limit_req_zone.*biswas_production" /etc/nginx/nginx.conf; then
    sed -i '/http {/a\    limit_req_zone $binary_remote_addr zone=biswas_production:10m rate=10r/s;' /etc/nginx/nginx.conf
fi

echo "==> Setting global ssl_ecdh_curve (disable post-quantum groups for Cloudflare compatibility)..."
if ! grep -q "ssl_ecdh_curve" /etc/nginx/nginx.conf; then
    sed -i '/ssl_protocols/a\\tssl_ecdh_curve X25519:prime256v1:secp384r1:secp521r1;' /etc/nginx/nginx.conf
fi

echo "==> Setting up SSL certificate directory..."
mkdir -p "$SSL_DIR"

if [ ! -f "$SSL_DIR/$DOMAIN.crt" ]; then
    echo "ERROR: SSL certificate not found at $SSL_DIR/$DOMAIN.crt"
    echo "The Cloudflare Origin Certificate must be installed before running this script."
    exit 1
fi

echo "==> Writing nginx config for $DOMAIN..."
cat > "/etc/nginx/sites-available/$DOMAIN" << 'NGINX_CONF'
server {
    listen 80;
    listen [::]:80;
    server_name biswas.me;

    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name biswas.me;

    # SSL certificate (Cloudflare Full SSL)
    ssl_certificate /etc/nginx/ssl/biswas.me.crt;
    ssl_certificate_key /etc/nginx/ssl/biswas.me.key;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_ecdh_curve X25519:prime256v1:secp384r1:secp521r1;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Logging
    access_log /var/log/nginx/biswas.me_access.log;
    error_log /var/log/nginx/biswas.me_error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

    # API proxy with rate limiting
    location /api/ {
        limit_req zone=biswas_production burst=20 nodelay;
        proxy_pass http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check proxy
    location /health {
        proxy_pass http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINX_CONF

echo "==> Enabling site..."
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"

echo "==> Testing nginx configuration..."
nginx -t

echo "==> Reloading nginx..."
systemctl reload nginx

echo "==> Nginx setup complete for $DOMAIN"
