provision:
  heroku create
  heroku addons:add mongohq
  heroku addons:add rediscloud

deploy:
  git push heroku master
  heroku open
