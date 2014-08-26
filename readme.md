# Node-Production

Running Node all the way from development to production on Heroku.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/hunterloftis/node-production)

## Local dependencies

- Redis for sessions
- MongoDB for data
- RabbitMQ for job queueing

## Installing

```
$ brew install redis mongodb rabbitmq
$ brew services start mongodb
$ brew services start redis
$ brew services start rabbitmq
$ npm install
```

## Running

`npm start` then [http://localhost:5000](http://localhost:5000)

## Deploying

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/hunterloftis/node-production)

If you would rather clone locally and then deploy from the CLI:

```
$ script/create

(app deploys)

$ heroku open

(check it out)
(hack...hack...hack)

$ git commit -am 'awesome changes'
$ git push heroku master
```

## Config

Environment variables are mapped to a config object in lib/config.js.
This provides reasonable defaults as well as a layer of generalization
(`process.env.REDISCLOUD_URL` => `config.redis_url`).

## Scaling

The app is separated into two tiers: web (server.js) and worker (worker.js).
This enables horizontally scaling for both web traffic and long-running requests.

### Locally

`npm start` runs node-foreman, which will start a single web process and a single worker process.

### On Heroku

The default deploy configuration includes `THRIFTY=true`, which starts the app in single-dyno mode (free!).
With `THRIFTY=true`, the web process handles both http requests and queued jobs.

Of course, a production app should never run in a single instance,
and you should avoid tying up serving your users with long-running processes.
When you're ready to test in staging or deploy to production, you can
scale beyond single-dyno mode:

```
heroku config:unset THRIFTY
heroku ps:scale web=1 worker=1
```

