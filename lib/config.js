module.exports = {
  app_name: 'Node-Production',
  redis_url: process.env.REDISCLOUD_URL || 'redis://localhost:6379/0',
  mongo_url: process.env.MONGOHQ_URL || 'mongodb://localhost:27017/appDev',
  session_secret: process.env.SESSION_SECRET || 'mySecret',
  show_errors: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 5000
};
