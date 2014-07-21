module.exports = {
  app_name: 'Node-Production',
  redis_url: process.env.REDISTOGO_URL || 'redis://localhost:6379/0',
  mongo_url: process.env.MONGOHQ_URL || 'mongodb://localhost:27017/appTest',
  session_secret: process.env.SESSION_SECRET || 'mySecret',
  port: process.env.PORT || 5000
};
