# biswas.me

This is the code to my personal website.

## Build the image

```
$ docker build -t biswas/website:v0.1-SNAPSHOT .
```

## Run with Docker-compose

```
$ docker-compose up -d
```

## Create table

```
#Login into mysql and apply up scripts from migrations
```

## Install Composer

```
docker exec -it `docker container ls  | grep 'website' | awk '{print $1}'` composer require mailgun/mailgun-php symfony/http-client nyholm/psr7
```