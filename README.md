# Rapt Map

This is the repo for Rapt Map, a location-aware email list builder. Still very much a work in progress.


# Dependencies

Raptmap runs on Docker. You'll need to install both [Docker Engine](https://docs.docker.com/engine/) and [Docker Compose](https://docs.docker.com/compose/) to prop up the app. (You may also need [Docker Machine](https://docs.docker.com/machine/) depending upon your Linux distribution.) Consult the following links to get started.

https://docs.docker.com/engine/installation/

https://docs.docker.com/compose/install/


# Up and running

Go ahead and clone the repo.

```bash
git clone git@github.com:xjensen/raptmap.git
cd raptmap
```

Next, create an `.env` file based upon the template.

```bash
cp .env-template .env
```

Finally, use Docker Compose to start up the app. Depending upon your system, you may need to prepend `sudo`.

```bash
docker-compose up
```

Your first use of this `up` command will take some time. Docker needs to download all of the app's dependencies. Subsequent runs will be much quicker. Go to [localhost:3000](http://localhost:3000). The app should be running. You'll see an error message; that's normal until the databases are created.

## Docker pitfalls

If Docker gives you shade about port conflicts on the host machine (i.e., your computer), then there are a few options:

* set up Docker, and run this app, within a clean VM;
* sniff out the conflicting ports on your machine and stop said services, then try again;
* change the port mappings in `docker-compose.yml` and your `.env` file.


# Creating the databases

Upon first run, you'll need to create the relevant postgres databases for Rails. First create the databases...

```bash
docker-compose exec rails rails db:create
```

...then apply all migrations.

```bash
docker-compose exec rails rails db:migrate
```

The site should now be functional. If you're using `sudo` with `docker-compose` on Linux, then you may need to add the `--user` option when running `exec` commands. Here's an example.

```bash
docker-compose exec --user "$(id -u):$(id -g)" rails rails db:migrate
```


# More on Docker Compose

To suppress the rolling logs, add the `-d` flag to your `up` command. This starts the app in daemon mode.

```bash
docker-compose up -d
```

Check the status of the app in daemon mode.

```bash
docker-compose ps # lists the active container(s)
docker-compose logs # lists recent output to stdout
```

To rebuild the Docker images, just in case your Docker-related edits don't take, add `--build`. This will rebuild the Docker images as defined in docker-compose.yml.

```bash
docker-compose up --build -d
```

Start, stop, or restart the app with the following.

```bash
docker-compose start
docker-compose stop
docker-compose restart
```

To run in production mode, call the `docker-compose-prod.yml` file.

```bash
docker-compose -f docker-compose-prod.yml up -d
```


# Working with webpack

Unlike a traditional Rails application, here the [Asset Pipeline](http://guides.rubyonrails.org/asset_pipeline.html) has been ripped out in favor of [webpack](https://webpack.github.io). Furthermore, Javascript dependencies are managed with [Yarn](https://yarnpkg.com/en/). [The next point release of the Rails framework, 5.1, will include native support for both webpack and Yarn](https://github.com/rails/webpacker), but for now, we're rolling with this custom setup.

To auto-compile files in dev, run:

```bash
webpack --progress --colors --watch
```

Before deploying to prod, use the `-p` flag. This will minify assets and fingerprint them for cache-busting.

```bash
webpack -p
```
