run: setup .env
	/bin/bash -c "source .env && bundle exec jekyll serve --watch"

build: setup .env
	/bin/bash -c "source .env && bundle exec jekyll build"

setup:
	bundle
	npm install

test: build
	bundle exec rspec spec
	bundle exec htmlproofer --disable-external --allow-hash-href `pwd`/_site

clean:
	rm -rf _site

.env:
	cp -n .env.example .env

.PHONY: setup clean
