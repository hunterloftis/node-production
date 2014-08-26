// Papertrail = add to here

module.exports = {

  // Services
  redis_url: process.env.REDISTOGO_URL || 'redis://localhost:6379/0',
  mongo_url: process.env.MONGOHQ_URL || 'mongodb://localhost:27017/appDev',
  rabbit_url: process.env.CLOUDAMQP_URL || 'amqp://localhost',
  port: process.env.PORT || 5000,

  // Security
  session_secret: process.env.SESSION_SECRET || 'mySessionSecret',
  cookie_secret: process.env.COOKIE_SECRET || 'myCookieSecret',
  show_errors: process.env.NODE_ENV !== 'production',

  // App behavior
  verbose: process.env.VERBOSE || false,
  concurrent: process.env.CONCURRENT || false,
  thrifty: process.env.THRIFTY || false,
  timeout: process.env.TIMEOUT || '5s',
  view_cache: process.env.VIEW_CACHE || false
};
