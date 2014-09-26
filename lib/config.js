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
  blitz_key: process.env.BLITZ_KEY,

  // App behavior
  verbose: process.env.VERBOSE || false,          // Log 200s?
  concurrent: process.env.CONCURRENT || false,    // Use Cluster?
  thrifty: process.env.THRIFTY || false,          // Web process also executes job queue?
  timeout: process.env.TIMEOUT || '5s',           // Request timeouts
  busy_ms: process.env.BUSY_MS || 1000,            // Event loop lag threshold for 503 responses
  view_cache: process.env.VIEW_CACHE || false     // Cache rendered views?
};
