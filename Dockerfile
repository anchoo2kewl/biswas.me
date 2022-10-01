FROM alpine:latest as website

RUN apk update && apk upgrade
RUN apk add bash
RUN apk add nginx
RUN apk add php8 php8-fpm php8-opcache
RUN apk add php8-gd php8-zlib php8-curl php-phar php-mbstring php-openssl php-ctype


COPY server/etc/nginx /etc/nginx
COPY server/etc/php /etc/php8
COPY src /usr/share/nginx/html
RUN mkdir /var/run/php
EXPOSE 80
EXPOSE 443

WORKDIR /usr/share/nginx/html/

RUN apk add php8-gd php8-mysqli php8-zlib php8-curl

# INSTALL COMPOSER
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
COPY --from=composer /usr/bin/composer /usr/bin/composer

STOPSIGNAL SIGTERM

CMD ["/bin/bash", "-c", "php-fpm8 && chmod 777 /var/run/php/php8-fpm.sock && chmod 755 /usr/share/nginx/html/* && nginx -g 'daemon off;'"]