// Papertrail = add to here

module.exports = {
  redis_url: process.env.REDISCLOUD_URL || 'redis://localhost:6379/0',
  mongo_url: process.env.MONGOHQ_URL || 'mongodb://localhost:27017/appDev',
  rabbit_url: process.env.CLOUDAMQP_URL || 'amqp://localhost',
  session_secret: process.env.SESSION_SECRET || 'mySessionSecret',
  cookie_secret: process.env.COOKIE_SECRET || 'myCookieSecret',
  show_errors: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 5000,
  quiet: process.env.QUIET || false,
  concurrent: process.env.CONCURRENT || false,
  timeout: process.env.TIMEOUT || '5s',
  sentiment_cache_ms: process.env.SENTIMENT_CACHE || 0,
  view_cache: process.env.VIEW_CACHE || false
};