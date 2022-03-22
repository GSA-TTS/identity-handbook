run:
	make -j2 watch_js watch_jekyll

build: build_js build_jekyll

build_jekyll: setup .env
	/bin/bash -c "source .env && bundle exec jekyll build"

watch_jekyll: .env
	/bin/bash -c "source .env && bundle exec jekyll serve --watch"

build_js: setup
	npm run build

watch_js:
	npm start

setup:
	bundle
	npm install

lint:
	npm run lint

typecheck:
	npm run typecheck

test: build
	bundle exec rspec spec
	bundle exec htmlproofer --disable-external --allow-hash-href `pwd`/_site

clean:
	rm -rf _site

.env:
	cp -n .env.example .env

.PHONY: run build setup lint
