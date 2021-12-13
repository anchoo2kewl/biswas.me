# biswas.me

This is the code to my personal website.

### Install PHP and NGINX

```
yum install nginx
systemctl start nginx
systemctl enable nginx
```


#### Install PHP-FPM on CentOS 7


```
yum install php-fpm

# php-fpm on CentOS 7 run as a service, so we need to start and enable php-fpm using systemctl command.

systemctl start php-fpm

systemctl enable php-fpm
```

#### Configure PHP-FPM

First open the /etc/php-fpm.d/www.conf file and change value of listen from listen = 127.0.0.1:9000 to listen = /var/run/php-fpm/php-fpm.sock.

```
listen = /var/run/php-fpm/php-fpm.sock
```

Next, open the /etc/php.ini file and set the value of cgi.fix_pathinfo to 0 (uncomment the line if it’s been commented).

```
cgi.fix_pathinfo=0
```

Now, Restart the centos php-fpm service using systemctl command.

```
systemctl restart php-fpm
```

#### Configure Nginx for PHP-FPM

Add fastcgi to the server in /etc/nginx/sites-available/site:

```
    location ~ [^/]\.php(/|$) {
        fastcgi_split_path_info ^(.+?\.php)(/.*)$;
        fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
```

#### Install Composer

```
yum install php-cli php-zip wget unzip
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
HASH="$(wget -q -O - https://composer.github.io/installer.sig)"
php -r "if (hash_file('SHA384', 'composer-setup.php') === '$HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php --install-dir=/usr/local/bin --filename=composer
```

#### Install Mailgun dependency

```
composer require mailgun/mailgun-php symfony/http-client nyholm/psr7
```