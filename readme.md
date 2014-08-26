# Node-Production

Running Node all the way from development to production on Heroku.

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

```
$ script/create
$ heroku open
```

## Config

Environment variables are mapped to a config object in lib/config.js.
This provides reasonable defaults as well as a layer of generalization
(`process.env.REDISCLOUD_URL` => `config.redis_url`).

## Scaling

The app is separated into two tiers: web (server.js) and worker (worker.js).
