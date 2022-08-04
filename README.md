![Alt text](public/assets/images/banner.png "Quota")

# Cuota File sharing

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.

# MinIo Setup

MinIo is a self hosted s3 storage solution. Because this project is focused around open source solutions cuota is optimized to work with MinIo.

## MinIo Container

This docker command starts the container with admin pass and Domain configured.

Replace **CHANGEME** with secure password.

```bash
docker run \
  -p 9000:9000 \
  -p 9001:9001 \
  -d \
  --name minio \
  -v /mnt/hd1/minio/data:/data \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_BROWSER_REDIRECT_URL=http://admin.s3.noekrebs.ch" \
  -e "MINIO_SERVER_URL=https://s3.noekrebs.ch" \
  -e "MINIO_ROOT_PASSWORD=CHANGEME" \
  quay.io/minio/minio server /data --console-address ":9001"
```

## Apache Proxy configuration

This configuration allows public access to the self hosted Minio server (Running in Docker).

```bash
<VirtualHost *:443>
    ServerName storage.noekrebs.ch
    ServerAlias s3.noekrebs.ch
    ServerAdmin webmaster@localhost

    ErrorLog ${APACHE_LOG_DIR}/storage_error.log
    CustomLog ${APACHE_LOG_DIR}/storage_access.log combined

    ProxyRequests Off
    ProxyVia Block
    ProxyPreserveHost On

    <Proxy *>
         Require all granted
    </Proxy>

    ProxyPass / http://localhost:9000/
    ProxyPassReverse / http://localhost:9000/

    Header setifempty Access-Control-Allow-Origin "*"

    SSLCertificateFile /etc/letsencrypt/live/s3.noekrebs.ch-0001/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/s3.noekrebs.ch-0001/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
```

Currently there is a problem with CORS because the MinIo server dose not return a CORS Header for Images. This blocks the frontend from Automatically download the files. This is fixed with the following workaround in the Proxy configuration.

```bash
Header setifempty Access-Control-Allow-Origin "*"
```

# Image optimization

imgproxy is a open source software that allows you to optimize your images on the fly.

**For now I use a manual compression proccess on the Client** You can find a description of the reason down below under the **Problems** section.

## imgproxy setup

You can find a number of ways to deploy imgproxy on their [Website](https://imgproxy.net/). The easiest is to Deploy to heroku.

its important to set these tow variables in your heroku (docker) environment for URL Signature to work.

> These variables must be set in the environment of your imgproxy instance and **not in the .env of this project**

```bash
IMGPROXY_KEY=CHANGEME
IMGPROXY_SALT=CHANGEME

#optional for large images
IMGPROXY_MAX_SRC_RESOLUTION=50
IMGPROXY_READ_TIMEOUT=20

# Tell imgproxy to use s3 storage
IMGPROXY_USE_S3=true
IMGPROXY_S3_ENDPOINT=https://s3.noekrebs.ch
IMGPROXY_S3_REGION=eu-central-1

# S3 bucket credentials
AWS_SECRET_ACCESS_KEY=CHANGEME
AWS_ACCESS_KEY_ID=CHANGEME

#useful for debugging
IMGPROXY_DEVELOPMENT_ERRORS_MODE=true

#if this is not set to one heroku timeout's because the large images took to long to fetch simultaneously
IMGPROXY_CONCURRENCY=1
```

## Proxy configuration for caching

Create cache directory

```bash
mkdir /mnt/hd1/cache/apache2/mod_cache_disk/routing/
```

Grant access to web user on the CacheRoot

```bash
sudo chown -R www-data /mnt/hd1/cache/apache2/mod_cache_disk/routing/
```

enable apache modules for caching

```bash
sudo a2enmod cache
sudo a2enmod cache_disk
sudo a2enmod headers
sudo a2enmod expires
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod ssl # if reverse proxying to https servers
```

Virtual Host configuration for img cashing

```bash                                                               /etc/apache2/sites-available/ch.noekrebs.imgporoxy.conf *
<VirtualHost *:443>
    ServerName img.noekrebs.ch
    ServerAlias imgproxy.noekrebs.ch
    ServerAdmin webmaster@localhost

    ErrorLog ${APACHE_LOG_DIR}/storage_error.log
    CustomLog ${APACHE_LOG_DIR}/storage_access.log combined

    ProxyRequests On
    ProxyVia Block
    ProxyPreserveHost On

    CacheLockPath /tmp/mod_cache-lock
    CacheEnable disk /
    CacheRoot /mnt/hd1/cache/apache2/mod_cache_disk/routing

    # common caching directives
    CacheQuickHandler on
    CacheLock on
    CacheHeader On

    # cache control
    CacheDirLevels 3
    CacheDirLength 5
    CacheIgnoreCacheControl On
    CacheMaxFileSize 100000000
    CacheIgnoreNoLastMod On
    CacheIgnoreQueryString On

    # unset headers from upstream server
    Header unset Expires
    Header unset Cache-Control
    Header unset Pragma

    # set expiration headers for static content
    ExpiresActive on

    # send an Expires: header for each of these mimetypes (as defined by server)
    ExpiresDefault "access 1 month"

    ProxyPass / https://cuota-images.herokuapp.com/
    ProxyPassReverse / https://cuota-images.herokuapp.com/

    SSLProxyEngine On
    SSLProxyVerify none
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
    SSLProxyCheckPeerExpire off

    SSLCertificateFile /etc/letsencrypt/live/img.noekrebs.ch/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/img.noekrebs.ch/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>

<VirtualHost *:80>
    ServerName img.noekrebs.ch
    ServerAlias imgproxy.noekrebs.ch
    RewriteEngine On
    RewriteCond %{SERVER_NAME} =img.noekrebs.ch [OR]
    RewriteCond %{SERVER_NAME} =imgproxy.noekrebs.ch
    RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>
```

## Problems

Correctly it takes way to long for the imgproxy server to fetch the original images. The only way I can think of to solve this is to move the imgproxy to to the same server as Minio. This currently dose not work for me because Minio is hosted on a Pi 4 and imgproxy is not running on ARM at the Moment (04.08.2022).

Also if many images are requested at the same time the imgproxy server will take to long to fetch the images. And Heroku will time out.

I fixed this by prefetching the images one by one after they are uploaded. Sadly this is not a bullet proof solution.

src: [taylor.callsen.me](https://taylor.callsen.me/creating-a-caching-proxy-server-with-apache/)

# Ideas

- [ ] show if server is bottleneck
- [ ] Showcase. Option to create showcase where you can showcase your work. Includes option for custom branding in form of a image.
