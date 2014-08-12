provision:
	heroku create
	heroku addons:add mongohq
	heroku addons:add rediscloud
	heroku config:set SESSION_SECRET="`openssl rand -base64 32`"

deploy:
	git push heroku master
	heroku open

production:
	heroku config:set NODE_ENV=production
	heroku config:set QUIET=true
	heroku config:unset DEBUG

staging:
	heroku config:set NODE_ENV=staging
	heroku config:unset QUIET
	heroku config:set DEBUG='Node-Production:*'

app: provision production deploy

