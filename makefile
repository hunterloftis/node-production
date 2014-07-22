provision:
	heroku create
	heroku addons:add mongohq
	heroku addons:add rediscloud

deploy:
	git push heroku master
	heroku open

production:
	heroku config:set NODE_ENV=production

staging:
	heroku config:set NODE_ENV=staging

