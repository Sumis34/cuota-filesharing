![Alt text](public/assets/images/banner.png "Quota")

# Cuota File sharing

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.

# Run App

1. Clone repo
2. Configure ENV Variables
3. Configure Logging. `sentry-cli login` [sentry.io](https://docs.sentry.io/product/cli/configuration/)
4. Deploy (Recommended to deploy to Vercel)

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

**For now I use a manual compression proccess on the Client**. If you are interested about my learnings with imgproxy you can check out my [Notes](docs/IMGRPOXY.md).

# Maintenance

Because we want our shared files to expire eventually we need to set a cronjob. But because this project is centered around a easy to use solution we will use the [cron-job.org](https://cron-job.org) service. This service is a simple to use service that allows you to schedule a http request to a url.

## Cronjob.org Setup

I have setup a job with the following configuration.

> Add your service key (SERVICE_KEY) configured in the [.env](.env) file.

![cron config](docs/images/cron-job-conf.png)

# Inspiration
- https://buildui.com/series/framer-motion-recipes/multistep-wizard
- https://www.framer.com/templates/category/startup/
- Create. Share. Earn.

# Ideas

- [ ] show if server is bottleneck
- [ ] Showcase. Option to create showcase where you can showcase your work. Includes option for custom branding in form of a image.
- [ ] Allow custom branding for Teams and Buisness.
- [ ] Access controll. Allow sharing for spesific users by specifying a email.
