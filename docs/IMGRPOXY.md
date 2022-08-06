# imgproxy setup

imgproxy is a open source software that allows you to optimize your images on the fly. You can find a number of ways to deploy imgproxy on their [Website](https://imgproxy.net/). The easiest is to Deploy to heroku.

> I stopped using this method because it was not working for my setup ([explanation](#problems)). Imgproxy is still a grate service and I would enjoy to use it in the future.

## Env Variables

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