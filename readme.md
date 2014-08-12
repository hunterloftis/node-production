# Node-Production

A production-ready node app that can be provisioned and deployed
for free on Heroku with a single command (`make app`).
It will scale without issue and handle network interruptions gracefully.

```
git clone https://github.com/hunterloftis/node-production.git && cd node-production
make app
```

## Checklist

- 12-Factor
- Exportable & testable without http server
- Default config, overridden by the environment
- Localized package.json dependencies and devDependencies
- Cross-platform launcher (`npm start`)
- Hot reloading with debug output for dev (`npm run dev`)
- Node-core standard debug output
- Robust redis dependency
- Robust mongodb dependency
- Robust error handling
- Bcrypt + salting
- Sane gitignore

## Local dependencies

This app requires a mongodb and redis connection.
To run locally, you can provide remote connections in the environment (see config.js).
Alternatively, you can run mongodb and redis locally, eg:

```
$ brew services start mongodb
$ brew services start redis
```
