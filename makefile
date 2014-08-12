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

benchmark-get:
	mkdir -p test/benchmarks; \
	ab -n 5000 -c 100 $(URL) > test/benchmarks/get.txt

benchmark:
	mkdir -p test/benchmarks; \
	export URL=`heroku apps:info | grep "Web URL:" | awk '{ print $(NF) }'`; \
	ab -n 5000 -c 100 -p test/fixtures/dummy.json -T 'application/json' $(URL)signout > test/benchmarks/20k-post.txt

app: provision production deploy

