FROM alpine:latest AS website

# Install base packages
RUN apk update && apk upgrade
RUN apk add --no-cache bash nginx curl

# Add community and edge repositories
RUN echo "@community https://dl-cdn.alpinelinux.org/alpine/v3.21/community" >> /etc/apk/repositories && \
    echo "@edge https://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories

# Install PHP and extensions
RUN apk add --no-cache \
    php82 \
    php82-cli \
    php82-fpm \
    php82-opcache \
    php82-gd \
    php82-curl \
    php82-mbstring \
    php82-xml \
    php82-phar \
    php82-openssl \
    php82-ctype \
    php82-session \
    php82-mysqli \
    php82-tokenizer \
    php82-dom

# Set up PHP-FPM configuration
RUN mkdir -p /run/php && \
    sed -i 's|listen = 127.0.0.1:9000|listen = /run/php/php-fpm82.sock|' /etc/php82/php-fpm.d/www.conf && \
    sed -i 's|;listen.owner = nobody|listen.owner = nginx|' /etc/php82/php-fpm.d/www.conf && \
    sed -i 's|;listen.group = nobody|listen.group = nginx|' /etc/php82/php-fpm.d/www.conf && \
    sed -i 's|user = nobody|user = nginx|' /etc/php82/php-fpm.d/www.conf && \
    sed -i 's|group = nobody|group = nginx|' /etc/php82/php-fpm.d/www.conf

# Update PHP configuration path
COPY server/etc/nginx /etc/nginx
COPY server/etc/php /etc/php82
RUN sed -i 's|include=/etc/php8/|include=/etc/php82/|' /etc/php82/php-fpm.conf
COPY src /usr/share/nginx/html

# Set PHP error logs to stderr for Docker logging
RUN sed -i 's|;error_log = log/php82-fpm.log|error_log = /proc/self/fd/2|' /etc/php82/php-fpm.conf && \
    sed -i 's|;catch_workers_output = yes|catch_workers_output = yes|' /etc/php82/php-fpm.d/www.conf

# Set Nginx error logs to stdout for Docker logging
COPY server/etc/nginx /etc/nginx
RUN sed -i 's|error_log .*|error_log /dev/stderr warn;|' /etc/nginx/nginx.conf && \
    sed -i 's|access_log .*|access_log /dev/stdout;|' /etc/nginx/nginx.conf

# Install Node.js and yarn
RUN apk add --no-cache nodejs npm yarn

# Install composer
RUN curl -sS https://getcomposer.org/installer | php82 -- --install-dir=/usr/local/bin --filename=composer

# Set up Next.js application
WORKDIR /app
COPY modern-profile/package.json modern-profile/yarn.lock ./
RUN yarn install

COPY modern-profile/ ./
RUN yarn build

# Expose ports
EXPOSE 80
EXPOSE 3001

STOPSIGNAL SIGTERM

# Start both servers
CMD ["/bin/sh", "-c", "mkdir -p /run/php && php-fpm82 && sleep 2 && chmod -R 777 /run/php && chmod 755 /usr/share/nginx/html/* && (nginx -g 'daemon off;' &) && yarn start -p 3001"]